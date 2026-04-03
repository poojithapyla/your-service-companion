import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Calendar, CheckCircle2, XCircle, Clock, Star, MapPin, User,
  Phone, LogOut, ArrowLeft, IndianRupee, Bell, BellOff
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-500/10", icon: Clock },
  accepted: { label: "Accepted", color: "text-blue-600 bg-blue-500/10", icon: CheckCircle2 },
  in_progress: { label: "In Progress", color: "text-primary bg-primary/10", icon: Clock },
  completed: { label: "Completed", color: "text-accent bg-accent/10", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "text-destructive bg-destructive/10", icon: XCircle },
};

const PartnerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  const requestNotifications = useCallback(async () => {
    if (!("Notification" in window)) { toast.error("Notifications not supported"); return; }
    const perm = await Notification.requestPermission();
    setNotificationsEnabled(perm === "granted");
    if (perm === "granted") toast.success("Notifications enabled!");
    else toast.error("Notifications blocked");
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if (notificationsEnabled && "Notification" in window) {
      new Notification(title, { body, icon: "/icon-192.png" });
    }
  }, [notificationsEnabled]);

  useEffect(() => {
    if (user) {
      fetchBookings();
      const channel = supabase
        .channel('partner-bookings')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, (payload) => {
          if (payload.eventType === 'INSERT') {
            const newBooking = payload.new as any;
            const partnerCats = profile?.partner_categories || [];
            const bookingServices = Array.isArray(newBooking.services) ? newBooking.services : [];
            const matches = bookingServices.some((s: any) => partnerCats.includes(s.categoryId));
            if (matches) {
              setBookings(prev => [newBooking, ...prev]);
              toast.info("New booking available in your category!");
              const svcNames = bookingServices.flatMap((s: any) => s.serviceNames || []).join(", ");
              showNotification("New Booking!", `${svcNames} — ₹${newBooking.estimated_cost || 0}`);
            }
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => prev.map(b => b.id === (payload.new as any).id ? payload.new as any : b));
          }
        })
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [user, profile]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load bookings");
    else setBookings(data || []);
    setLoading(false);
  };

  const handleAction = async (id: string, action: string) => {
    const updates: any = { status: action };
    if (action === "accepted" && user) {
      updates.assigned_partner_id = user.id;
      updates.assigned_partner_name = profile?.full_name || "Partner";
      updates.assigned_partner_phone = profile?.phone || "";
    }
    if (action === "rejected") {
      // Clear partner assignment on reject
      updates.assigned_partner_id = null;
      updates.assigned_partner_name = null;
      updates.assigned_partner_phone = null;
    }
    const { error } = await supabase.from("bookings").update(updates).eq("id", id);
    if (error) {
      toast.error("Failed to update booking");
    } else {
      toast.success(`Booking ${action}`);
      fetchBookings();
    }
  };

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
  const myAccepted = bookings.filter(b => b.assigned_partner_id === user?.id && ["accepted", "in_progress", "completed"].includes(b.status));
  const earnings = bookings
    .filter(b => b.status === "completed" && b.assigned_partner_id === user?.id)
    .reduce((sum, b) => sum + (b.estimated_cost || 0), 0);

  const getServiceNames = (services: any) => {
    if (Array.isArray(services)) return services.flatMap((s: any) => s.serviceNames || []).join(", ");
    return "Service";
  };

  const getCategoryNames = (services: any) => {
    if (Array.isArray(services)) return [...new Set(services.map((s: any) => s.categoryLabel || s.categoryId || ""))].join(", ");
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="w-5 h-5" /></Link>
            <span className="font-display text-lg font-bold text-foreground">{t("partner.dashboard")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={requestNotifications}
              className={notificationsEnabled ? "text-accent" : "text-muted-foreground"}
              title={notificationsEnabled ? "Notifications enabled" : "Enable notifications"}
            >
              {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </Button>
            <span className="text-sm text-muted-foreground">{profile?.full_name}</span>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-1" /> {t("common.logout")}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {profile?.partner_categories?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground self-center">My categories:</span>
            {profile.partner_categories.map((cat: string) => (
              <span key={cat} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 capitalize">
                {cat.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{bookings.filter(b => b.status === "pending").length}</div>
            <div className="text-xs text-muted-foreground">{t("partner.available")}</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{myAccepted.length}</div>
            <div className="text-xs text-muted-foreground">{t("partner.myJobs")}</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <Clock className="w-5 h-5 text-accent mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">{bookings.filter(b => b.status === "completed" && b.assigned_partner_id === user?.id).length}</div>
            <div className="text-xs text-muted-foreground">{t("partner.completed")}</div>
          </div>
          <div className="bg-card rounded-xl border border-border p-4 text-center">
            <IndianRupee className="w-5 h-5 text-secondary mx-auto mb-1" />
            <div className="text-2xl font-bold text-foreground">₹{earnings.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{t("partner.earnings")}</div>
          </div>
        </div>

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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(booking => {
              const sc = statusConfig[booking.status] || statusConfig.pending;
              const isMyJob = booking.assigned_partner_id === user?.id;
              return (
                <div key={booking.id} className="bg-card rounded-xl border border-border p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-muted-foreground">{booking.id.slice(0, 8)}</div>
                      <div className="text-base font-semibold text-foreground">{getServiceNames(booking.services)}</div>
                      <div className="text-xs text-muted-foreground">{getCategoryNames(booking.services)}</div>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${sc.color}`}>{sc.label}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5" /> {booking.schedule_date ? new Date(booking.schedule_date).toLocaleDateString() : "ASAP"}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <IndianRupee className="w-3.5 h-3.5" /> ₹{booking.estimated_cost || 0}
                    </div>
                  </div>

                  {/* Show full customer details once accepted */}
                  {isMyJob && ["accepted", "in_progress", "completed"].includes(booking.status) && (
                    <div className="bg-accent/5 rounded-lg p-3 space-y-1.5 text-xs border border-accent/20">
                      <p className="font-medium text-accent text-[11px] uppercase tracking-wider">Customer Details</p>
                      {booking.address && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {booking.address}</div>}
                      {booking.recipient_name && <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-muted-foreground" /> {booking.recipient_name}</div>}
                      {booking.recipient_phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                          <a href={`tel:${booking.recipient_phone}`} className="text-primary hover:underline">{booking.recipient_phone}</a>
                        </div>
                      )}
                      {booking.book_for === "self" && !booking.recipient_name && (
                        <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-muted-foreground" /> Customer (self-booking)</div>
                      )}
                      {booking.notes && <div className="text-muted-foreground italic">Note: {booking.notes}</div>}
                      {booking.photos && booking.photos.length > 0 && (
                        <div className="flex gap-1.5 flex-wrap mt-1">
                          {booking.photos.map((url: string, i: number) => (
                            <a key={i} href={url} target="_blank" rel="noreferrer">
                              <img src={url} alt="" className="w-14 h-14 rounded-md object-cover border border-border" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions based on status */}
                  <div className="flex gap-2">
                    {booking.status === "pending" && !booking.assigned_partner_id && (
                      <>
                        <Button size="sm" variant="hero" className="flex-1" onClick={() => handleAction(booking.id, "accepted")}>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {t("partner.accept")}
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-destructive border-destructive/30" onClick={() => handleAction(booking.id, "rejected")}>
                          <XCircle className="w-3.5 h-3.5 mr-1" /> {t("partner.reject")}
                        </Button>
                      </>
                    )}
                    {booking.status === "accepted" && isMyJob && (
                      <Button size="sm" variant="hero" className="flex-1" onClick={() => handleAction(booking.id, "in_progress")}>
                        {t("partner.startService")}
                      </Button>
                    )}
                    {booking.status === "in_progress" && isMyJob && (
                      <Button size="sm" variant="hero" className="flex-1" onClick={() => handleAction(booking.id, "completed")}>
                        Mark Completed
                      </Button>
                    )}
                    {booking.status === "accepted" && !isMyJob && (
                      <span className="text-xs text-muted-foreground italic">Accepted by another partner</span>
                    )}
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No bookings found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerDashboard;
