import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart3, Users, Calendar, DollarSign, Settings, Star, TrendingUp,
  LogOut, Search, Bell, ChevronDown, Clock, CheckCircle2, AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Total Users", value: "12,847", change: "+12%", icon: Users, color: "text-blue-600 bg-blue-500/10" },
  { label: "Active Bookings", value: "342", change: "+8%", icon: Calendar, color: "text-primary bg-primary/10" },
  { label: "Revenue (MTD)", value: "₹4,82,300", change: "+23%", icon: DollarSign, color: "text-accent bg-accent/10" },
  { label: "Avg Rating", value: "4.7", change: "+0.2", icon: Star, color: "text-secondary bg-secondary/10" },
];

const recentBookings = [
  { id: "BK-1024", customer: "Rahul S.", service: "Deep Cleaning", partner: "CleanPro Team", status: "In Progress", amount: "₹999" },
  { id: "BK-1023", customer: "Priya M.", service: "AC Service", partner: "TechFix", status: "Completed", amount: "₹1,499" },
  { id: "BK-1022", customer: "Amit K.", service: "Birthday Décor", partner: "PartyPro", status: "Pending", amount: "₹2,999" },
  { id: "BK-1021", customer: "Sneha R.", service: "Haircut", partner: "StyleHub", status: "Accepted", amount: "₹499" },
  { id: "BK-1020", customer: "Vikram D.", service: "Plumbing", partner: "FixIt Pro", status: "Completed", amount: "₹799" },
];

const statusColors: Record<string, string> = {
  "Pending": "text-yellow-600 bg-yellow-500/10",
  "Accepted": "text-blue-600 bg-blue-500/10",
  "In Progress": "text-primary bg-primary/10",
  "Completed": "text-accent bg-accent/10",
  "Cancelled": "text-destructive bg-destructive/10",
};

const navItems = [
  { label: "Overview", icon: BarChart3, active: true },
  { label: "Bookings", icon: Calendar },
  { label: "Users", icon: Users },
  { label: "Revenue", icon: DollarSign },
  { label: "Feedback", icon: Star },
  { label: "Settings", icon: Settings },
];

const AdminDashboard = () => {
  const [activeNav, setActiveNav] = useState("Overview");

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-card border-r border-border p-6">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-warm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">SB</span>
          </div>
          <span className="font-display text-xl font-bold text-foreground">Admin</span>
        </Link>

        <nav className="space-y-1 flex-1">
          {navItems.map(item => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeNav === item.label
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
            <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, Admin</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 w-64" />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
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

          {/* Recent Bookings */}
          <div className="bg-card rounded-xl border border-border">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-foreground">Recent Bookings</h2>
              <Button variant="ghost" size="sm">View All <ChevronDown className="w-4 h-4 ml-1" /></Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">ID</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Customer</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Service</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Partner</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Status</th>
                    <th className="text-left text-xs font-medium text-muted-foreground px-5 py-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(b => (
                    <tr key={b.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 text-sm font-medium text-foreground">{b.id}</td>
                      <td className="px-5 py-3 text-sm text-foreground">{b.customer}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{b.service}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{b.partner}</td>
                      <td className="px-5 py-3">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium text-foreground">{b.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Stats Row */}
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
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
