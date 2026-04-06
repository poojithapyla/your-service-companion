import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar, Clock, CheckCircle2, Star, MapPin, XCircle,
  ArrowLeft, LogOut, Plus, Phone, User, IndianRupee, ChevronDown, ChevronUp, Languages
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-500/10" },
  accepted: { label: "Accepted", color: "text-blue-600 bg-blue-500/10" },
  in_progress: { label: "In Progress", color: "text-primary bg-primary/10" },
  completed: { label: "Completed", color: "text-accent bg-accent/10" },
  cancelled: { label: "Cancelled", color: "text-destructive bg-destructive/10" },
};

const CustomerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratingBookingId, setRatingBookingId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(0);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (user) {
      fetchBookings();
      const channel = supabase
        .channel('customer-bookings')
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `user_id=eq.${user.id}`,
        }, (payload) => {
          if (payload.eventType === 'UPDATE') {
            const updated = payload.new as any;
            setBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
            if (updated.status === 'accepted') toast.success("Your booking has been accepted by a partner!");
            else if (updated.status === 'in_progress') toast.info("Your service is now in progress!");
            else if (updated.status === 'completed') toast.success("Your service has been completed!");
          } else if (payload.eventType === 'INSERT') {
            setBookings(prev => [payload.new as any, ...prev]);
          }
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load bookings");
    else setBookings(data || []);
    setLoading(false);
  };

  const cancelBooking = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) toast.error("Failed to cancel");
    else { toast.success("Booking cancelled"); fetchBookings(); }
  };

  const submitRating = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ rating: ratingValue, feedback }).eq("id", id);
    if (error) toast.error("Failed to submit rating");
    else { toast.success("Rating submitted!"); setRatingBookingId(null); setRatingValue(0); setFeedback(""); fetchBookings(); }
  };

  const getServiceNames = (services: any) => {
    if (Array.isArray(services)) return services.flatMap((s: any) => s.serviceNames || []).join(", ");
    return "Service";
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
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-muted-foreground">No bookings yet</p>
            <Button variant="hero" asChild><Link to="/book">Book Your First Service</Link></Button>
          </div>
        ) : (
          bookings.map(booking => {
            const sc = statusConfig[booking.status] || statusConfig.pending;
            return (
              <div key={booking.id} className="bg-card rounded-xl border border-border p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">{booking.id.slice(0, 8)}</div>
                    <div className="text-base font-semibold text-foreground">{getServiceNames(booking.services)}</div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>{sc.label}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {booking.schedule_date ? new Date(booking.schedule_date).toLocaleDateString() : "ASAP"}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {booking.schedule_type}</div>
                  {booking.address && <div className="flex items-center gap-1.5 col-span-2"><MapPin className="w-3.5 h-3.5" /> {booking.address}</div>}
                </div>

                {/* Show partner details once accepted */}
                {["accepted", "in_progress", "completed"].includes(booking.status) && booking.assigned_partner_name && (
                  <div className="bg-accent/5 rounded-lg p-3 border border-accent/20 space-y-1.5">
                    <p className="text-xs font-medium text-accent">Partner Assigned</p>
                    <div className="flex items-center gap-1.5 text-xs text-foreground">
                      <User className="w-3.5 h-3.5 text-muted-foreground" /> {booking.assigned_partner_name}
                    </div>
                    {booking.assigned_partner_phone && (
                      <div className="flex items-center gap-1.5 text-xs text-foreground">
                        <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                        <a href={`tel:${booking.assigned_partner_phone}`} className="text-primary hover:underline">{booking.assigned_partner_phone}</a>
                      </div>
                    )}
                  </div>
                )}

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
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= booking.rating ? "text-secondary fill-secondary" : "text-muted-foreground"}`} />
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {["pending", "accepted"].includes(booking.status) && (
                    <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/30" onClick={() => cancelBooking(booking.id)}>
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Cancel
                    </Button>
                  )}
                  <div className="text-lg font-bold text-foreground ml-auto">₹{(booking.estimated_cost || 0).toLocaleString()}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
