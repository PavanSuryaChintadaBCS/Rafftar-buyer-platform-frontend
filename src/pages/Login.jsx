import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBuyer } from "@/contexts/BuyerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Building2, Mail, Lock, User, Phone, Zap, Smartphone } from "lucide-react";
import { PoweredByRafftar } from "@/components/PoweredByRafftar";

const Login = () => {
  const { login } = useBuyer();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginName, setLoginName] = useState("");
  const [otpPhone, setOtpPhone] = useState("");
  const [otpName, setOtpName] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginName) {
      toast.error("Please enter your name");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const isRajesh = loginName.toLowerCase().includes("rajesh");
    login(loginName);
    if (isRajesh) {
      toast.success("Welcome back, Rajesh! \u{1F680} Rafftar pricing activated.");
    } else {
      toast.success(`Welcome, ${loginName}! Complete KYC to unlock full features.`);
    }
    setLoading(false);
    navigate(isRajesh ? redirectTo : "/kyc");
  };
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!otpPhone || otpPhone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!otpName) {
      toast.error("Please enter your name");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1e3));
    setOtpSent(true);
    setLoading(false);
    toast.success("OTP sent to your phone!");
  };
  const handleVerifyOTP = async () => {
    if (otpValue.length < 6) {
      toast.error("Please enter the complete OTP");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    const isRajesh = otpName.toLowerCase().includes("rajesh");
    login(otpName);
    if (isRajesh) {
      toast.success("Welcome back, Rajesh! \u{1F680} Rafftar pricing activated.");
    } else {
      toast.success(`Welcome, ${otpName}! Complete KYC to unlock full features.`);
    }
    setLoading(false);
    navigate(isRajesh ? redirectTo : "/kyc");
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupName || !signupEmail || !signupPassword) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    login(signupName);
    toast.success("Account created! Complete KYC to unlock full features.");
    setLoading(false);
    navigate("/kyc");
  };
  return <div className="min-h-screen bg-background flex items-center justify-center p-4"><div className="w-full max-w-md">{
    /* Logo */
  }<div className="text-center mb-8"><h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}><span className="text-foreground">Bharat </span><span className="text-primary">Buildcon</span></h1><p className="text-sm text-muted-foreground mt-2">B2B construction materials marketplace</p><div className="mt-3 flex justify-center"><PoweredByRafftar /></div></div><Card><Tabs defaultValue="login"><CardHeader className="pb-3"><TabsList className="w-full"><TabsTrigger value="login" className="flex-1">Login</TabsTrigger><TabsTrigger value="otp" className="flex-1">OTP Login</TabsTrigger><TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger></TabsList></CardHeader><CardContent>{
    /* Email/Password Login */
  }<TabsContent value="login" className="mt-0"><form onSubmit={handleLogin} className="space-y-4"><div className="space-y-2"><Label htmlFor="login-name">Full Name</Label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="login-name" value={loginName} onChange={(e) => setLoginName(e.target.value)} className="pl-10" placeholder="Rajesh Kumar" /></div></div><div className="space-y-2"><Label htmlFor="login-email">Email</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="login-email" type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="pl-10" placeholder="you@company.com" /></div></div><div className="space-y-2"><Label htmlFor="login-password">Password</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="pl-10" /></div></div><Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Logging in..." : "Login"}</Button><div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-center space-y-1"><p className="font-medium flex items-center justify-center gap-1"><Zap className="h-3 w-3 text-primary" /> Demo Tip
                    </p><p className="text-muted-foreground">
                      Login as <strong>"Rajesh Kumar"</strong> to see Rafftar exclusive pricing.
                      Any other name gets standard pricing.
                    </p></div></form></TabsContent>{
    /* OTP Login */
  }<TabsContent value="otp" className="mt-0">{!otpSent ? <form onSubmit={handleSendOTP} className="space-y-4"><div className="space-y-2"><Label htmlFor="otp-name">Full Name</Label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="otp-name" value={otpName} onChange={(e) => setOtpName(e.target.value)} className="pl-10" placeholder="Rajesh Kumar" /></div></div><div className="space-y-2"><Label htmlFor="otp-phone">Phone Number</Label><div className="relative"><Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="otp-phone" value={otpPhone} onChange={(e) => setOtpPhone(e.target.value)} className="pl-10" placeholder="+91 9876543210" /></div></div><Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Sending OTP..." : "Send OTP"}</Button><div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-center space-y-1"><p className="font-medium flex items-center justify-center gap-1"><Zap className="h-3 w-3 text-primary" /> Demo Tip
                      </p><p className="text-muted-foreground">
                        Use name <strong>"Rajesh Kumar"</strong> to see Rafftar exclusive pricing. Any OTP works.
                      </p></div></form> : <div className="space-y-4"><div className="text-center space-y-2"><div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto"><Smartphone className="h-6 w-6 text-primary" /></div><p className="text-sm text-muted-foreground">
                        Enter the 6-digit OTP sent to <strong>{otpPhone}</strong></p></div><div className="flex justify-center"><InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}><InputOTPGroup><InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} /><InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} /></InputOTPGroup></InputOTP></div><Button className="w-full" size="lg" disabled={loading || otpValue.length < 6} onClick={handleVerifyOTP}>{loading ? "Verifying..." : "Verify & Login"}</Button><Button variant="ghost" size="sm" className="w-full" onClick={() => {
    setOtpSent(false);
    setOtpValue("");
  }}>
                      Change phone number
                    </Button></div>}</TabsContent>{
    /* Signup */
  }<TabsContent value="signup" className="mt-0"><form onSubmit={handleSignup} className="space-y-4"><div className="space-y-2"><Label htmlFor="signup-name">Full Name *</Label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="signup-name" value={signupName} onChange={(e) => setSignupName(e.target.value)} className="pl-10" placeholder="Your Name" /></div></div><div className="space-y-2"><Label htmlFor="signup-email">Business Email *</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="signup-email" type="email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="pl-10" placeholder="you@company.com" /></div></div><div className="space-y-2"><Label htmlFor="signup-phone">Phone</Label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="signup-phone" value={signupPhone} onChange={(e) => setSignupPhone(e.target.value)} className="pl-10" placeholder="+91 9876543210" /></div></div><div className="space-y-2"><Label htmlFor="signup-company">Company Name</Label><div className="relative"><Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="signup-company" value={signupCompany} onChange={(e) => setSignupCompany(e.target.value)} className="pl-10" placeholder="ABC Constructions Pvt Ltd" /></div></div><div className="space-y-2"><Label htmlFor="signup-password">Password *</Label><div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /><Input id="signup-password" type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} className="pl-10" placeholder="Min 8 characters" /></div></div><Button type="submit" className="w-full" size="lg" disabled={loading}>{loading ? "Creating Account..." : "Create Account"}</Button></form></TabsContent></CardContent></Tabs></Card><p className="text-xs text-center text-muted-foreground mt-4">
          {"By continuing, you agree to Bharat Buildcon's Terms of Service and Privacy Policy."}
        </p></div></div>;
};
export default Login;
