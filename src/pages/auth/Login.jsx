import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useBuyer } from "@/hooks/useBuyer";
import { httpService } from "@/utils/http-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Building2, Mail, Lock, User, Phone } from "lucide-react";
import { PoweredByRafftar } from "@/components/PoweredByRafftar";

const Login = () => {
  const { login } = useBuyer();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";

  const [loginEmail,    setLoginEmail]    = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName,    setSignupName]    = useState("");
  const [signupEmail,   setSignupEmail]   = useState("");
  const [signupPhone,   setSignupPhone]   = useState("");
  const [signupCompany, setSignupCompany] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    try {
      const data = await httpService.login({ email: loginEmail, password: loginPassword });
      const buyer = data.buyer ?? data;
      login(buyer);
      toast.success(`Welcome back, ${buyer.email ?? ""}!`);
      navigate(buyer.is_kyc_verified ? redirectTo : "/kyc");
    } catch (err) {
      if (err.code === "INVALID_CREDENTIALS") {
        toast.error("Invalid email or password.");
      } else {
        toast.error(err.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword) {
      toast.error("Email and password are required");
      return;
    }
    if (signupPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const data = await httpService.register({
        email:    signupEmail,
        password: signupPassword,
        name:     signupName    || undefined,
        phone:    signupPhone   || undefined,
        company:  signupCompany || undefined,
      });
      const buyer = data.buyer ?? data;
      login(buyer);
      toast.success("Account created! Complete KYC to unlock full features.");
      navigate("/kyc");
    } catch (err) {
      if (err.code === "EMAIL_TAKEN") {
        toast.error("This email is already registered. Please log in.");
      } else {
        toast.error(err.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <span className="text-foreground">Bharat </span>
            <span className="text-primary">Buildcon</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">B2B construction materials marketplace</p>
          <div className="mt-3 flex justify-center"><PoweredByRafftar /></div>
        </div>

        <Card>
          <Tabs defaultValue="login">
            <CardHeader className="pb-3">
              <TabsList className="w-full">
                <TabsTrigger value="login"  className="flex-1">Login</TabsTrigger>
                <TabsTrigger value="signup" className="flex-1">Sign Up</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              {/* ── Login ── */}
              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10"
                        placeholder="you@company.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10"
                        autoComplete="current-password"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Logging in…" : "Login"}
                  </Button>
                </form>
              </TabsContent>

              {/* ── Sign Up ── */}
              <TabsContent value="signup" className="mt-0">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pl-10"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Business Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10"
                        placeholder="you@company.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-phone"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="pl-10"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-company">Company Name</Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-company"
                        value={signupCompany}
                        onChange={(e) => setSignupCompany(e.target.value)}
                        className="pl-10"
                        placeholder="ABC Constructions Pvt Ltd"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password * (min 8 chars)</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Creating Account…" : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <p className="text-xs text-center text-muted-foreground mt-4">
          {"By continuing, you agree to Bharat Buildcon's Terms of Service and Privacy Policy."}
        </p>
      </div>
    </div>
  );
};

export default Login;
