import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, CreditCard, Smartphone, Banknote, Globe, Check, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const paymentMethods = [
  { id: "upi", label: "UPI", desc: "Google Pay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Card", desc: "Credit / Debit Card", icon: CreditCard },
  { id: "online", label: "Net Banking", desc: "All major banks", icon: Globe },
  { id: "cod", label: "Cash on Delivery", desc: "Pay when service is done", icon: Banknote },
];

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {};
  const estimatedCost = bookingData.estimatedCost || 0;

  const [method, setMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const canPay = () => {
    if (!method) return false;
    if (method === "upi" && !upiId.includes("@")) return false;
    if (method === "card" && (!cardNumber || !cardExpiry || !cardCvv)) return false;
    return true;
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
    }, 2000);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card rounded-2xl border border-border p-10 text-center max-w-md w-full shadow-elevated"
        >
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-accent" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Booking Confirmed!</h2>
          <p className="text-sm text-muted-foreground mb-6">
            {method === "cod" ? "Pay ₹" + estimatedCost + " when the service is completed." : "Payment of ₹" + estimatedCost + " received successfully."}
          </p>
          <div className="space-y-3">
            <Button variant="hero" className="w-full" asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto flex items-center h-16 px-4 gap-4">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-display text-lg font-bold text-foreground">Payment</span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-soft space-y-6"
        >
          {/* Amount */}
          <div className="bg-primary/5 rounded-xl p-5 border border-primary/20 text-center">
            <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
            <p className="text-3xl font-bold text-gradient-warm">₹{estimatedCost}</p>
          </div>

          {/* Payment methods */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">Select Payment Method <span className="text-destructive">*</span></h3>
            <div className="space-y-2">
              {paymentMethods.map(pm => (
                <button
                  key={pm.id}
                  onClick={() => setMethod(pm.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                    method === pm.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    method === pm.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  }`}>
                    <pm.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{pm.label}</div>
                    <div className="text-xs text-muted-foreground">{pm.desc}</div>
                  </div>
                  {method === pm.id && <Check className="w-5 h-5 text-primary ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* UPI details */}
          {method === "upi" && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">UPI ID <span className="text-destructive">*</span></label>
              <Input placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
            </div>
          )}

          {/* Card details */}
          {method === "card" && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Card Number <span className="text-destructive">*</span></label>
                <Input placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => setCardNumber(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">Expiry</label>
                  <Input placeholder="MM/YY" value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">CVV</label>
                  <Input type="password" placeholder="•••" value={cardCvv} onChange={e => setCardCvv(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Net banking info */}
          {method === "online" && (
            <p className="text-sm text-muted-foreground text-center py-2">You will be redirected to your bank's website to complete payment.</p>
          )}

          {/* COD info */}
          {method === "cod" && (
            <p className="text-sm text-muted-foreground text-center py-2">Pay ₹{estimatedCost} in cash when the service is completed.</p>
          )}

          {/* Security badge */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure & encrypted payment</span>
          </div>

          <Button
            variant="hero"
            size="lg"
            className="w-full py-6 text-base"
            disabled={!canPay() || processing}
            onClick={handlePay}
          >
            {processing ? "Processing..." : method === "cod" ? "Confirm Booking (COD)" : `Pay ₹${estimatedCost}`}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
