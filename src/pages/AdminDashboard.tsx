import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3, Users, Calendar, DollarSign, Settings, Star, TrendingUp,
  LogOut, Search, Bell, ChevronDown, Clock, CheckCircle2, AlertCircle,
  MessageSquare, Shield, Package, UserCheck, IndianRupee, Eye, Edit, Trash2, Plus
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Users", value: "12,847", change: "+12%", icon: Users, color: "text-blue-600 bg-blue-500/10" },
  { label: "Active Bookings", value: "342", change: "+8%", icon: Calendar, color: "text-primary bg-primary/10" },
  { label: "Revenue (MTD)", value: "₹4,82,300", change: "+23%", icon: IndianRupee, color: "text-accent bg-accent/10" },
  { label: "Avg Rating", value: "4.7", change: "+0.2", icon: Star, color: "text-secondary bg-secondary/10" },
];

const recentBookings = [
  { id: "BK-1024", customer: "Rahul S.", service: "Deep Cleaning", partner: "CleanPro Team", status: "In Progress", amount: "₹999", date: "2026-03-22" },
  { id: "BK-1023", customer: "Priya M.", service: "AC Service", partner: "TechFix", status: "Completed", amount: "₹1,499", date: "2026-03-21" },
  { id: "BK-1022", customer: "Amit K.", service: "Birthday Décor", partner: "PartyPro", status: "Pending", amount: "₹2,999", date: "2026-03-21" },
  { id: "BK-1021", customer: "Sneha R.", service: "Haircut", partner: "StyleHub", status: "Accepted", amount: "₹499", date: "2026-03-20" },
  { id: "BK-1020", customer: "Vikram D.", service: "Plumbing", partner: "FixIt Pro", status: "Completed", amount: "₹799", date: "2026-03-20" },
  { id: "BK-1019", customer: "Meera L.", service: "Cooking", partner: "HomeChef", status: "Completed", amount: "₹599", date: "2026-03-19" },
];

const statusColors: Record<string, string> = {
  "Pending": "text-yellow-600 bg-yellow-500/10",
  "Accepted": "text-blue-600 bg-blue-500/10",
  "In Progress": "text-primary bg-primary/10",
  "Completed": "text-accent bg-accent/10",
  "Cancelled": "text-destructive bg-destructive/10",
};

const feedbackData = [
  { id: 1, customer: "Rahul S.", service: "Deep Cleaning", rating: 5, comment: "Excellent service, very thorough!", date: "2026-03-22", status: "Published" },
  { id: 2, customer: "Priya M.", service: "AC Service", rating: 4, comment: "Good work but arrived 15 mins late.", date: "2026-03-21", status: "Published" },
  { id: 3, customer: "Amit K.", service: "Plumbing", rating: 2, comment: "Issue not fully resolved, had to call again.", date: "2026-03-20", status: "Flagged" },
  { id: 4, customer: "Sneha R.", service: "Haircut", rating: 5, comment: "Amazing stylist! Will book again.", date: "2026-03-19", status: "Published" },
];

const serviceProviders = [
  { id: 1, name: "CleanPro Team", category: "Home Services", bookings: 156, rating: 4.8, status: "Active", revenue: "₹1,23,400" },
  { id: 2, name: "TechFix Solutions", category: "Technical Services", bookings: 89, rating: 4.6, status: "Active", revenue: "₹89,200" },
  { id: 3, name: "StyleHub", category: "Personal Services", bookings: 234, rating: 4.9, status: "Active", revenue: "₹1,56,000" },
  { id: 4, name: "PartyPro Décor", category: "Décor Services", bookings: 67, rating: 4.5, status: "Active", revenue: "₹2,34,500" },
  { id: 5, name: "FixIt Pro", category: "Technical Services", bookings: 112, rating: 4.3, status: "Suspended", revenue: "₹67,800" },
];

const financialData = {
  totalRevenue: "₹24,56,800",
  totalCosts: "₹18,42,600",
  profit: "₹6,14,200",
  margin: "25%",
  monthly: [
    { month: "Jan", revenue: 320000, cost: 240000 },
    { month: "Feb", revenue: 380000, cost: 285000 },
    { month: "Mar", revenue: 482300, cost: 361000 },
  ],
  categoryRevenue: [
    { category: "Home Services", revenue: "₹8,45,000", pct: 34 },
    { category: "Technical Services", revenue: "₹6,12,000", pct: 25 },
    { category: "Personal Services", revenue: "₹5,89,000", pct: 24 },
    { category: "Décor Services", revenue: "₹3,45,000", pct: 14 },
    { category: "Other / Custom", revenue: "₹65,800", pct: 3 },
  ],
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

const AdminDashboard = () => {
  const [activeNav, setActiveNav] = useState<NavSection>("overview");
  const [searchQuery, setSearchQuery] = useState("");

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
                activeNav === item.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <Button variant="ghost" size="sm" className="justify-start gap-2 text-muted-foreground" asChild>
          <Link to="/"><LogOut className="w-4 h-4" /> Back to Site</Link>
        </Button>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground capitalize">{activeNav === "overview" ? "Dashboard" : navItems.find(n => n.id === activeNav)?.label}</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 w-64" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* ========== OVERVIEW ========== */}
          {activeNav === "overview" && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(stat => (
                  <div key={stat.label} className="bg-card rounded-xl border border-border p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-accent flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">On-Time Delivery</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">94%</div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: "94%" }} />
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Completion Rate</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">97%</div>
                  <div className="w-full bg-muted rounded-full h-2 mt-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "97%" }} />
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Open Complaints</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">8</div>
                  <div className="text-xs text-muted-foreground mt-1">3 critical, 5 minor</div>
                </div>
              </div>

              {/* Growth chart placeholder */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Growth Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">+2,340</div>
                    <div className="text-xs text-muted-foreground">New Users (This Month)</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">+15%</div>
                    <div className="text-xs text-muted-foreground">Booking Growth</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">+23%</div>
                    <div className="text-xs text-muted-foreground">Revenue Growth</div>
                  </div>
                </div>
              </div>

              {/* Bookings per category */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Bookings by Category</h3>
                <div className="space-y-3">
                  {financialData.categoryRevenue.map(cat => (
                    <div key={cat.category} className="flex items-center gap-3">
                      <span className="text-sm text-foreground w-40 shrink-0">{cat.category}</span>
                      <div className="flex-1 bg-muted rounded-full h-3">
                        <div className="bg-gradient-warm h-3 rounded-full transition-all" style={{ width: `${cat.pct}%` }} />
                      </div>
                      <span className="text-sm font-medium text-foreground w-16 text-right">{cat.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ========== BOOKINGS ========== */}
          {activeNav === "bookings" && (
            <div className="bg-card rounded-xl border border-border">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-foreground">All Bookings</h2>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{recentBookings.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      {["ID", "Date", "Customer", "Service", "Partner", "Status", "Amount"].map(h => (
                        <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map(b => (
                      <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3 text-sm font-medium text-foreground">{b.id}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">{b.date}</td>
                        <td className="px-5 py-3 text-sm text-foreground">{b.customer}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">{b.service}</td>
                        <td className="px-5 py-3 text-sm text-muted-foreground">{b.partner}</td>
                        <td className="px-5 py-3">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[b.status]}`}>{b.status}</span>
                        </td>
                        <td className="px-5 py-3 text-sm font-medium text-foreground">{b.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== USERS & PARTNERS ========== */}
          {activeNav === "users" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Total Customers</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">11,234</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Service Partners</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">1,613</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Active Today</span>
                  </div>
                  <div className="text-3xl font-bold text-foreground">3,891</div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="font-display text-lg font-semibold text-foreground">Service Providers</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {["Name", "Category", "Bookings", "Rating", "Revenue", "Status", "Actions"].map(h => (
                          <th key={h} className="text-left text-xs font-medium text-muted-foreground px-5 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {serviceProviders.map(sp => (
                        <tr key={sp.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3 text-sm font-medium text-foreground">{sp.name}</td>
                          <td className="px-5 py-3 text-sm text-muted-foreground">{sp.category}</td>
                          <td className="px-5 py-3 text-sm text-foreground">{sp.bookings}</td>
                          <td className="px-5 py-3 text-sm text-foreground flex items-center gap-1">
                            <Star className="w-3 h-3 text-secondary fill-secondary" /> {sp.rating}
                          </td>
                          <td className="px-5 py-3 text-sm font-medium text-foreground">{sp.revenue}</td>
                          <td className="px-5 py-3">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              sp.status === "Active" ? "text-accent bg-accent/10" : "text-destructive bg-destructive/10"
                            }`}>{sp.status}</span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex gap-1">
                              <button className="p-1.5 rounded hover:bg-muted"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                              <button className="p-1.5 rounded hover:bg-muted"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {/* ========== FEEDBACK ========== */}
          {activeNav === "feedback" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-sm font-medium text-foreground mb-1">Average Rating</div>
                  <div className="text-3xl font-bold text-foreground flex items-center gap-2">
                    4.7 <Star className="w-6 h-6 text-secondary fill-secondary" />
                  </div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-sm font-medium text-foreground mb-1">Total Reviews</div>
                  <div className="text-3xl font-bold text-foreground">8,432</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-sm font-medium text-foreground mb-1">Flagged Reviews</div>
                  <div className="text-3xl font-bold text-destructive">12</div>
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border">
                <div className="px-5 py-4 border-b border-border">
                  <h2 className="font-display text-lg font-semibold text-foreground">Recent Feedback</h2>
                </div>
                <div className="divide-y divide-border">
                  {feedbackData.map(fb => (
                    <div key={fb.id} className="px-5 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground">{fb.customer}</span>
                            <span className="text-xs text-muted-foreground">on {fb.service}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              fb.status === "Flagged" ? "bg-destructive/10 text-destructive" : "bg-accent/10 text-accent"
                            }`}>{fb.status}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < fb.rating ? "text-secondary fill-secondary" : "text-muted"}`} />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{fb.comment}</p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{fb.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ========== FINANCIAL ========== */}
          {activeNav === "financial" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-xs text-muted-foreground mb-1">Total Revenue</div>
                  <div className="text-2xl font-bold text-foreground">{financialData.totalRevenue}</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-xs text-muted-foreground mb-1">Total Costs</div>
                  <div className="text-2xl font-bold text-foreground">{financialData.totalCosts}</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-xs text-muted-foreground mb-1">Net Profit</div>
                  <div className="text-2xl font-bold text-accent">{financialData.profit}</div>
                </div>
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="text-xs text-muted-foreground mb-1">Profit Margin</div>
                  <div className="text-2xl font-bold text-foreground">{financialData.margin}</div>
                </div>
              </div>

              {/* Monthly breakdown */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Monthly Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        {["Month", "Revenue", "Costs", "Profit"].map(h => (
                          <th key={h} className="text-left text-xs font-medium text-muted-foreground px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {financialData.monthly.map(m => (
                        <tr key={m.month} className="border-b border-border/50">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{m.month} 2026</td>
                          <td className="px-4 py-3 text-sm text-foreground">₹{(m.revenue / 1000).toFixed(0)}K</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">₹{(m.cost / 1000).toFixed(0)}K</td>
                          <td className="px-4 py-3 text-sm font-medium text-accent">₹{((m.revenue - m.cost) / 1000).toFixed(0)}K</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Revenue by category */}
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Revenue by Category</h3>
                <div className="space-y-3">
                  {financialData.categoryRevenue.map(cat => (
                    <div key={cat.category} className="flex items-center justify-between">
                      <span className="text-sm text-foreground">{cat.category}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-gradient-warm h-2 rounded-full" style={{ width: `${cat.pct}%` }} />
                        </div>
                        <span className="text-sm font-medium text-foreground w-24 text-right">{cat.revenue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ========== CONTROL PANEL ========== */}
          {activeNav === "control" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Manage Services */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" /> Services
                    </h3>
                    <Button size="sm" variant="outline" className="gap-1"><Plus className="w-3 h-3" /> Add</Button>
                  </div>
                  <div className="space-y-2">
                    {["Home Services", "Technical Services", "Personal Services", "Décor Services", "Other / Custom"].map(cat => (
                      <div key={cat} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                        <span className="text-sm text-foreground">{cat}</span>
                        <div className="flex gap-1">
                          <button className="p-1.5 rounded hover:bg-muted"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button className="p-1.5 rounded hover:bg-muted"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manage Pricing */}
                <div className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                      <IndianRupee className="w-5 h-5 text-accent" /> Pricing
                    </h3>
                    <Button size="sm" variant="outline" className="gap-1"><Edit className="w-3 h-3" /> Edit</Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-foreground">Base Price per Service</span>
                      <span className="text-sm font-bold text-foreground">₹499</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-foreground">Instant Booking Surcharge</span>
                      <span className="text-sm font-bold text-foreground">₹99</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-foreground">Platform Commission</span>
                      <span className="text-sm font-bold text-foreground">15%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm text-foreground">Cancellation Fee</span>
                      <span className="text-sm font-bold text-foreground">₹50</span>
                    </div>
                  </div>
                </div>

                {/* Manage Providers */}
                <div className="bg-card rounded-xl border border-border p-5 col-span-full">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-blue-600" /> Provider Management
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <div className="text-2xl font-bold text-foreground">1,613</div>
                      <div className="text-xs text-muted-foreground">Total Partners</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <div className="text-2xl font-bold text-accent">1,498</div>
                      <div className="text-xs text-muted-foreground">Active</div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50 text-center">
                      <div className="text-2xl font-bold text-destructive">115</div>
                      <div className="text-xs text-muted-foreground">Suspended</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
