import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar, Clock, CheckCircle2, Star, Phone, MapPin, XCircle,
  ArrowLeft, LogOut, MessageCircle, Edit, Plus
} from "lucide-react";
import { Link } from "react-router-dom";

interface CustomerBooking {
  id: string;
  service: string;
  category: string;
  partner: string;
  partnerPhone: string;
  date: string;
  time: string;
  address: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  amount: string;
  rating?: number;
}

const mockBookings: CustomerBooking[] = [
  { id: "BK-1024", service: "Deep Cleaning", category: "Home Services", partner: "CleanPro Team", partnerPhone: "+91 99887 76655", date: "2026-03-23", time: "10:00 AM", address: "Flat 302, Sunrise Apts", status: "in_progress", amount: "₹999" },
  { id: "BK-1023", service: "AC Service - Regular", category: "Technical Services", partner: "TechFix", partnerPhone: "+91 88776 65544", date: "2026-03-22", time: "2:00 PM", address: "Flat 302, Sunrise Apts", status: "completed", amount: "₹1,499", rating: 4 },
  { id: "BK-1022", service: "Birthday Décor - Premium", category: "Decoration Services", partner: "PartyPro", partnerPhone: "+91 77665 54433", date: "2026-03-25", time: "4:00 PM", address: "Flat 302, Sunrise Apts", status: "pending", amount: "₹2,999" },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-500/10" },
  accepted: { label: "Accepted", color: "text-blue-600 bg-blue-500/10" },
  in_progress: { label: "In Progress", color: "text-primary bg-primary/10" },
  completed: { label: "Completed", color: "text-accent bg-accent/10" },
  cancelled: { label: "Cancelled", color: "text-destructive bg-destructive/10" },
};

const CustomerDashboard = () => {
  const [bookings, setBookings] = useState(mockBookings);
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [feedback, setFeedback] = useState("");

  const cancelBooking = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "cancelled" as const } : b));
  };

  const submitRating = (id: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, rating: ratingValue } : b));
    setRatingBookingId(null);
    setRatingValue(0);
    setFeedback("");
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
            <span className="font-display text-lg font-bold text-foreground">My Bookings</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="hero" size="sm" asChild>
              <Link to="/book"><Plus className="w-4 h-4 mr-1" /> New Booking</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/"><LogOut className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-4">
        {bookings.map(booking => {
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

              <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {booking.date}</div>
                <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {booking.time}</div>
                <div className="flex items-center gap-1.5 col-span-2"><MapPin className="w-3.5 h-3.5" /> {booking.address}</div>
              </div>

              {/* Partner info for accepted/in_progress/completed */}
              {["accepted", "in_progress", "completed"].includes(booking.status) && (
                <div className="bg-muted/50 rounded-lg p-3 flex items-center justify-between">
                  <div className="text-xs">
                    <div className="font-medium text-foreground">{booking.partner}</div>
                    <div className="text-muted-foreground">{booking.partnerPhone}</div>
                  </div>
                  <a href={`tel:${booking.partnerPhone}`} className="p-2 rounded-lg bg-accent/10 text-accent">
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Rating */}
              {booking.status === "completed" && !booking.rating && ratingBookingId !== booking.id && (
                <Button size="sm" variant="outline" onClick={() => setRatingBookingId(booking.id)} className="w-full">
                  <Star className="w-3.5 h-3.5 mr-1" /> Rate this service
                </Button>
              )}

              {ratingBookingId === booking.id && (
                <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                  <div className="flex gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} onClick={() => setRatingValue(s)}>
                        <Star className={`w-6 h-6 ${s <= ratingValue ? "text-secondary fill-secondary" : "text-muted-foreground"}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea placeholder="Share your experience..." value={feedback} onChange={e => setFeedback(e.target.value)} rows={2} />
                  <Button size="sm" variant="hero" className="w-full" onClick={() => submitRating(booking.id)}>Submit Rating</Button>
                </div>
              )}

              {booking.rating && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  Your rating: {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`w-3.5 h-3.5 ${s <= booking.rating! ? "text-secondary fill-secondary" : "text-muted-foreground"}`} />
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {["pending", "accepted"].includes(booking.status) && (
                  <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/30" onClick={() => cancelBooking(booking.id)}>
                    <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                  </Button>
                )}
                <div className="text-lg font-bold text-foreground ml-auto">{booking.amount}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerDashboard;
