import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3, Users, Calendar, Settings, Star, TrendingUp,
  LogOut, Search, Bell, Clock, CheckCircle2, AlertCircle,
  MessageSquare, Shield, Package, UserCheck, IndianRupee, Eye, Edit, Plus, ArrowUpDown
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "text-yellow-600 bg-yellow-500/10",
  accepted: "text-blue-600 bg-blue-500/10",
  in_progress: "text-primary bg-primary/10",
  completed: "text-accent bg-accent/10",
  cancelled: "text-destructive bg-destructive/10",
  rejected: "text-destructive bg-destructive/10",
};

type NavSection = "overview" | "bookings" | "users" | "feedback" | "financial" | "control";

const navItems: { label: string; id: NavSection; icon: any }[] = [
  { label: "Overview", id: "overview", icon: BarChart3 },
  { label: "Bookings", id: "bookings", icon: Calendar },
  { label: "Users & Partners", id: "users", icon: Users },
  { label: "Feedback", id: "feedback", icon: MessageSquare },
  { label: "Financial", id: "financial", icon: IndianRupee },
  { label: "Control Panel", id: "control", icon: Settings },
];

// Users & Partners drill-down component
const UsersPartnersSection = ({ profiles, searchQuery }: { profiles: any[]; searchQuery: string }) => {
  const [view, setView] = useState<"all" | "customers" | "partners">("all");
  const customers = profiles.filter(p => !p.partner_categories || p.partner_categories.length === 0);
  const partners = profiles.filter(p => p.partner_categories && p.partner_categories.length > 0);
  const displayed = view === "customers" ? customers : view === "partners" ? partners : profiles;
  const q = searchQuery.toLowerCase();
  const filtered = displayed.filter(p => !q || (p.full_name || "").toLowerCase().includes(q) || (p.phone || "").includes(q));

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button onClick={() => setView(view === "customers" ? "all" : "customers")} className={`bg-card rounded-xl border p-5 text-left transition-all ${view === "customers" ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/30"}`}>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Customers</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{customers.length}</div>
          <p className="text-xs text-muted-foreground mt-1">{view === "customers" ? "Showing customers ▼" : "Click to filter"}</p>
        </button>
        <button onClick={() => setView(view === "partners" ? "all" : "partners")} className={`bg-card rounded-xl border p-5 text-left transition-all ${view === "partners" ? "border-primary ring-1 ring-primary/30" : "border-border hover:border-primary/30"}`}>
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Partners</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{partners.length}</div>
          <p className="text-xs text-muted-foreground mt-1">{view === "partners" ? "Showing partners ▼" : "Click to filter"}</p>
        </button>
      </div>
      <div className="bg-card rounded-xl border border-border">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-foreground">
            {view === "customers" ? "Customers" : view === "partners" ? "Partners" : "All Users"}
          </h2>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{filtered.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Phone", "Role", "Categories", "Address", "Joined"].map(h => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">{p.full_name || "—"}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{p.phone || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${p.partner_categories?.length > 0 ? "text-blue-600 bg-blue-500/10" : "text-accent bg-accent/10"}`}>
                      {p.partner_categories?.length > 0 ? "Partner" : "Customer"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{p.partner_categories?.length > 0 ? p.partner_categories.join(", ") : "—"}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground max-w-[150px] truncate">{p.saved_address || "—"}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-muted-foreground">No users found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [activeNav, setActiveNav] = useState<NavSection>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<"created_at" | "estimated_cost" | "status">("created_at");
  const [sortAsc, setSortAsc] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [bookingsRes, profilesRes] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("*"),
    ]);
    if (bookingsRes.error) toast.error("Failed to load bookings");
    else setBookings(bookingsRes.data || []);
    if (profilesRes.error) toast.error("Failed to load users");
    else setProfiles(profilesRes.data || []);
    setLoading(false);
  };

  const getServiceNames = (services: any) => {
    if (Array.isArray(services)) return services.flatMap((s: any) => s.serviceNames || []).join(", ");
    return "Service";
  };

  const getCategoryNames = (services: any) => {
    if (Array.isArray(services)) return [...new Set(services.map((s: any) => s.categoryLabel || s.categoryId || ""))].join(", ");
    return "";
  };

  const getProfileName = (userId: string) => {
    const p = profiles.find(p => p.id === userId);
    return p?.full_name || "Unknown";
  };

  // Real stats
  const totalUsers = profiles.length;
  const activeBookings = bookings.filter(b => ["pending", "accepted", "in_progress"].includes(b.status)).length;
  const totalRevenue = bookings.filter(b => b.payment_status === "paid" || b.status === "completed").reduce((sum, b) => sum + (b.estimated_cost || 0), 0);
  const ratedBookings = bookings.filter(b => b.rating);
  const avgRating = ratedBookings.length > 0 ? (ratedBookings.reduce((s, b) => s + b.rating, 0) / ratedBookings.length).toFixed(1) : "N/A";
  const completedCount = bookings.filter(b => b.status === "completed").length;
  const completionRate = bookings.length > 0 ? Math.round((completedCount / bookings.length) * 100) : 0;

  // Sort & filter bookings
  const sortedBookings = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let filtered = bookings.filter(b => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (!q) return true;
      return getServiceNames(b.services).toLowerCase().includes(q)
        || getProfileName(b.user_id).toLowerCase().includes(q)
        || b.id.toLowerCase().includes(q)
        || (b.status || "").toLowerCase().includes(q);
    });
    filtered.sort((a, b) => {
      let va: any, vb: any;
      if (sortField === "created_at") { va = a.created_at; vb = b.created_at; }
      else if (sortField === "estimated_cost") { va = a.estimated_cost || 0; vb = b.estimated_cost || 0; }
      else { va = a.status; vb = b.status; }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return filtered;
  }, [bookings, searchQuery, sortField, sortAsc, statusFilter, profiles]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(false); }
  };

  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    bookings.forEach(b => {
      const cats = getCategoryNames(b.services).split(", ");
      cats.forEach(c => { if (c) map[c] = (map[c] || 0) + 1; });
    });
    const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
    return Object.entries(map).map(([category, count]) => ({
      category,
      count,
      pct: Math.round((count / total) * 100),
      revenue: bookings.filter(b => getCategoryNames(b.services).includes(category)).reduce((s, b) => s + (b.estimated_cost || 0), 0),
    })).sort((a, b) => b.count - a.count);
  }, [bookings]);

  const stats = [
    { label: "Total Users", value: totalUsers.toLocaleString(), icon: Users, color: "text-blue-600 bg-blue-500/10" },
    { label: "Active Bookings", value: activeBookings.toString(), icon: Calendar, color: "text-primary bg-primary/10" },
    { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: IndianRupee, color: "text-accent bg-accent/10" },
    { label: "Avg Rating", value: avgRating, icon: Star, color: "text-secondary bg-secondary/10" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border p-6">
        <Link to="/" className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SB</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">Admin</span>
        </Link>
        <div className="flex items-center gap-1 mb-8">
          <Shield className="w-3 h-3 text-accent" />
          <span className="text-[10px] text-accent font-medium">ADMIN ACCESS ONLY</span>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeNav === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="space-y-1 border-t border-border pt-3 mt-3">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" asChild>
            <Link to="/book"><Plus className="w-4 h-4" /> Book a Service</Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" asChild>
            <Link to="/auth?mode=signup&role=partner"><UserCheck className="w-4 h-4" /> Become a Partner</Link>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground" asChild>
            <Link to="/dashboard"><Calendar className="w-4 h-4" /> Customer Dashboard</Link>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="justify-start gap-2 text-muted-foreground" asChild>
          <Link to="/"><LogOut className="w-4 h-4" /> Back to Site</Link>
        </Button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground capitalize">{activeNav === "overview" ? "Dashboard" : navItems.find(n => n.id === activeNav)?.label}</h1>
            <p className="text-sm text-muted-foreground">Real-time data from your app</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 w-64" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <Button variant="ghost" size="sm" onClick={() => fetchData()}>Refresh</Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* OVERVIEW */}
          {activeNav === "overview" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                  <div key={stat.label} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Completion Rate</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{completionRate}%</div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${completionRate}%` }} />
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Total Bookings</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{bookings.length}</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Pending Bookings</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{bookings.filter(b => b.status === "pending").length}</div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Bookings by Category</h3>
                <div className="space-y-3">
                  {categoryBreakdown.map(cat => (
                    <div key={cat.category} className="flex items-center gap-3">
                      <span className="text-sm text-foreground w-40 shrink-0">{cat.category}</span>
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div className="bg-gradient-warm h-3 rounded-full transition-all" style={{ width: `${cat.pct}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground w-12 text-right">{cat.count}</span>
                      <span className="text-xs text-muted-foreground w-20 text-right">₹{cat.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                  {categoryBreakdown.length === 0 && <p className="text-sm text-muted-foreground">No bookings yet</p>}
                </div>
              </div>
            </>
          )}

          {/* BOOKINGS */}
          {activeNav === "bookings" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {["all", "pending", "accepted", "in_progress", "completed", "cancelled", "rejected"].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                      statusFilter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {s === "all" ? "All" : s.replace("_", " ")}
                  </button>
                ))}
              </div>
            <div className="bg-card rounded-xl border border-border">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-foreground">Bookings</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{sortedBookings.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">ID</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 cursor-pointer" onClick={() => toggleSort("created_at")}>
                        <span className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Customer</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Services</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Partner</th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 cursor-pointer" onClick={() => toggleSort("status")}>
                        <span className="flex items-center gap-1">Status <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3 cursor-pointer" onClick={() => toggleSort("estimated_cost")}>
                        <span className="flex items-center gap-1">Amount <ArrowUpDown className="w-3 h-3" /></span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBookings.map(b => (
                      <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 text-sm font-medium text-foreground">{b.id.slice(0, 8)}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</td>
                        <td className="px-5 py-3 text-sm text-foreground">{getProfileName(b.user_id)}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground max-w-[200px] truncate">{getServiceNames(b.services)}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">{b.assigned_partner_name || "—"}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[b.status] || ""}`}>{b.status}</span>
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-foreground">₹{(b.estimated_cost || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                    {sortedBookings.length === 0 && (
                      <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-muted-foreground">No bookings found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* USERS */}
          {activeNav === "users" && (
            <UsersPartnersSection profiles={profiles} searchQuery={searchQuery} />
          )}

          {/* FEEDBACK */}
          {activeNav === "feedback" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-sm font-medium text-foreground mb-1">Average Rating</div>
                  <div className="text-3xl font-bold text-foreground flex items-center gap-2">
                    {avgRating} {avgRating !== "N/A" && <Star className="w-6 h-6 text-secondary fill-secondary" />}
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-sm font-medium text-foreground mb-1">Total Reviews</div>
                  <div className="text-3xl font-bold text-foreground">{ratedBookings.length}</div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="font-display text-lg font-semibold text-foreground">Reviews</h2>
                </div>
                <div className="divide-y divide-border">
                  {ratedBookings.length === 0 && <p className="px-5 py-8 text-center text-sm text-muted-foreground">No reviews yet</p>}
                  {ratedBookings.map(b => (
                    <div key={b.id} className="px-5 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">{getProfileName(b.user_id)}</span>
                            <span className="text-xs text-muted-foreground">on {getServiceNames(b.services)}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < b.rating ? "text-secondary fill-secondary" : "text-muted"}`} />
                            ))}
                          </div>
                          {b.feedback && <p className="text-sm text-muted-foreground">{b.feedback}</p>}
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{new Date(b.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* FINANCIAL */}
          {activeNav === "financial" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-xs text-muted-foreground mb-1">Total Revenue</div>
                  <div className="text-2xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-xs text-muted-foreground mb-1">Total Bookings</div>
                  <div className="text-2xl font-bold text-foreground">{bookings.length}</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-xs text-muted-foreground mb-1">Completed</div>
                  <div className="text-2xl font-bold text-accent">{completedCount}</div>
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Revenue by Category</h3>
                <div className="space-y-3">
                  {categoryBreakdown.map(cat => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{cat.category}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-gradient-warm h-2 rounded-full" style={{ width: `${cat.pct}%` }} />
                        </div>
                        <span className="text-sm font-medium text-foreground w-24 text-right">₹{cat.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                  {categoryBreakdown.length === 0 && <p className="text-sm text-muted-foreground">No data yet</p>}
                </div>
              </div>
            </>
          )}

          {/* CONTROL */}
          {activeNav === "control" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-primary" /> Services
                </h3>
                <div className="space-y-2">
                  {["Home Services", "Repairs & Installations", "Beauty & Grooming", "Décor Services", "Other / Custom"].map(cat => (
                    <div key={cat} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-foreground">{cat}</span>
                      <span className="text-xs text-muted-foreground">
                        {bookings.filter(b => getCategoryNames(b.services).includes(cat)).length} bookings
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                  <IndianRupee className="w-5 h-5 text-accent" /> Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-foreground">Avg Booking Value</span>
                    <span className="text-sm font-bold text-foreground">₹{bookings.length > 0 ? Math.round(totalRevenue / bookings.length).toLocaleString() : 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-foreground">Cancelled</span>
                    <span className="text-sm font-bold text-destructive">{bookings.filter(b => b.status === "cancelled").length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm text-foreground">Rejected</span>
                    <span className="text-sm font-bold text-destructive">{bookings.filter(b => b.status === "rejected").length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
