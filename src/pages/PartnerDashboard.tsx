import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar, CheckCircle2, XCircle, Clock, Star, DollarSign, User,
  Phone, MapPin, LogOut, ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";

interface Booking {
  id: string;
  customer: string;
  phone: string;
  service: string;
  category: string;
  date: string;
  time: string;
  address: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "rejected";
  amount: string;
  notes?: string;
}

const mockBookings: Booking[] = [
  { id: "BK-2001", customer: "Rahul S.", phone: "+91 98765 43210", service: "Deep Cleaning", category: "Home Services", date: "2026-03-23", time: "10:00 AM", address: "Flat 302, Sunrise Apts, MG Road", status: "pending", amount: "₹999", notes: "3BHK apartment" },
  { id: "BK-2002", customer: "Priya M.", phone: "+91 87654 32109", service: "AC Service - Regular", category: "Technical Services", date: "2026-03-24", time: "2:00 PM", address: "House 12, Green Valley, Whitefield", status: "accepted", amount: "₹1,499" },
  { id: "BK-2003", customer: "Sneha R.", phone: "+91 76543 21098", service: "Birthday Décor - Premium", category: "Decoration Services", date: "2026-03-25", time: "4:00 PM", address: "Villa 8, Palm Meadows", status: "in_progress", amount: "₹2,999", notes: "Theme: Unicorn" },
  { id: "BK-2004", customer: "Amit K.", phone: "+91 65432 10987", service: "Sofa Cleaning", category: "Home Services", date: "2026-03-22", time: "11:00 AM", address: "Apt 501, Lake View, HSR Layout", status: "completed", amount: "₹799" },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-500/10", icon: Clock },
  accepted: { label: "Accepted", color: "text-blue-600 bg-blue-500/10", icon: CheckCircle2 },
  in_progress: { label: "In Progress", color: "text-primary bg-primary/10", icon: Clock },
  completed: { label: "Completed", color: "text-accent bg-accent/10", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-destructive bg-destructive/10", icon: XCircle },
};

const PartnerDashboard = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [filter, setFilter] = useState<string>("all");

  const handleAction = (id: string, action: "accepted" | "rejected" | "in_progress" | "completed") => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: action } : b));
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);

  const earnings = bookings.filter(b => b.status === "completed").reduce((sum, b) => sum + parseInt(b.amount.replace(/[₹,]/g, "")), 0);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
            <span className="font-display text-lg font-bold text-foreground">Partner Dashboard</span>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><LogOut className="w-4 h-4 mr-1" /> Logout</Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{bookings.filter(b => b.status === "pending").length}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{bookings.filter(b => b.status === "in_progress").length}</div>
            <div className="text-xs text-muted-foreground">In Progress</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-accent mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{bookings.filter(b => b.status === "completed").length}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <DollarSign className="w-5 h-5 text-secondary mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">₹{earnings.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Earnings</div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {["all", "pending", "accepted", "in_progress", "completed"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
                filter === f ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
              }`}
            >
              {f === "all" ? "All" : f.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Bookings */}
        <div className="space-y-4">
          {filtered.map(booking => {
            const sc = statusConfig[booking.status];
            return (
              <div key={booking.id} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">{booking.id}</div>
                    <div className="text-base font-semibold text-foreground">{booking.service}</div>
                    <div className="text-xs text-muted-foreground">{booking.category}</div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>{sc.label}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" /> {booking.date} at {booking.time}
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <DollarSign className="w-3.5 h-3.5" /> {booking.amount}
                  </div>
                </div>

                {/* Show customer details only for accepted/in_progress/completed */}
                {["accepted", "in_progress", "completed"].includes(booking.status) && (
                  <div className="bg-muted/50 rounded-lg p-3 space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-muted-foreground" /> {booking.customer}</div>
                    <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-muted-foreground" /> {booking.phone}</div>
                    <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {booking.address}</div>
                    {booking.notes && <div className="text-muted-foreground italic">Note: {booking.notes}</div>}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {booking.status === "pending" && (
                    <>
                      <Button size="sm" variant="hero" className="flex-1" onClick={() => handleAction(booking.id, "accepted")}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/30" onClick={() => handleAction(booking.id, "rejected")}>
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {booking.status === "accepted" && (
                    <Button size="sm" variant="hero" className="flex-1" onClick={() => handleAction(booking.id, "in_progress")}>
                      Start Service
                    </Button>
                  )}
                  {booking.status === "in_progress" && (
                    <Button size="sm" variant="hero" className="flex-1" onClick={() => handleAction(booking.id, "completed")}>
                      Mark Completed
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">No bookings found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
