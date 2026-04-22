import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBuyer } from "@/hooks/useBuyer";
import { httpService } from "@/utils/http-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { CheckCircle2, Upload, Building2, FileText, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const KYC = () => {
  const { buyer, toggleKYC } = useBuyer();
  const navigate = useNavigate();

  const [step, setStep] = useState("business");
  const [loading, setLoading] = useState(false);

  // Step 1 fields
  const [companyName,   setCompanyName]   = useState("");
  const [gstin,         setGstin]         = useState("");
  const [businessType,  setBusinessType]  = useState("");
  const [address,       setAddress]       = useState("");

  // Step 2 — file refs
  const [panFile,         setPanFile]         = useState(null);
  const [gstFile,         setGstFile]         = useState(null);
  const [addressFile,     setAddressFile]     = useState(null);

  const steps = [
    { key: "business",     label: "Business Info", icon: <Building2   className="h-4 w-4" /> },
    { key: "documents",    label: "Documents",     icon: <FileText    className="h-4 w-4" /> },
    { key: "verification", label: "Verification",  icon: <Shield      className="h-4 w-4" /> },
  ];
  const stepIndex = steps.findIndex((s) => s.key === step);
  const progress  = ((stepIndex + 1) / steps.length) * 100;

  const handleBusinessSubmit = () => {
    if (!companyName || !gstin || !businessType) {
      toast.error("Please fill all required fields");
      return;
    }
    setStep("documents");
  };

  const handleDocumentsSubmit = () => {
    if (!panFile || !gstFile) {
      toast.error("Please upload PAN and GST certificates");
      return;
    }
    setStep("verification");
  };

  const handleVerify = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("companyName",  companyName);
      formData.append("gstin",        gstin);
      formData.append("businessType", businessType);
      if (address)     formData.append("address",  address);
      if (panFile)     formData.append("files[]",  panFile);
      if (gstFile)     formData.append("files[]",  gstFile);
      if (addressFile) formData.append("files[]",  addressFile);

      await httpService.submitKyc(formData);

      if (!buyer.isKYCVerified) toggleKYC();
      toast.success("KYC submitted! You now have full access to pricing and ordering.");
      navigate("/");
    } catch (err) {
      if (err.code === "VALIDATION_ERROR") {
        toast.error("Invalid GSTIN or missing fields. Please check and resubmit.");
      } else {
        toast.error(err.message || "KYC submission failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (buyer.isKYCVerified) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-16 max-w-md text-center">
          <div className="h-20 w-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">KYC Already Verified</h1>
          <p className="text-muted-foreground mb-6">
            Your business is verified. You have full access to all features.
          </p>
          <Button onClick={() => navigate("/")}>Go to Home</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-2xl font-bold mb-2">Business Verification (KYC)</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Complete your KYC to unlock pricing, place orders, and access bulk discounts.
        </p>

        {/* Step indicator */}
        <div className="mb-8">
          <Progress value={progress} className="h-1.5 mb-4" />
          <div className="flex justify-between">
            {steps.map((s, i) => (
              <button
                key={s.key}
                onClick={() => i <= stepIndex && setStep(s.key)}
                className={cn(
                  "flex items-center gap-1.5 text-xs font-medium transition-colors",
                  i <= stepIndex ? "text-primary" : "text-muted-foreground"
                )}
              >
                {i < stepIndex ? <CheckCircle2 className="h-4 w-4" /> : s.icon}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 1: Business Info */}
        {step === "business" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Business Information</CardTitle>
              <CardDescription>Tell us about your business</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Company / Firm Name *</Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="ABC Constructions Pvt Ltd" />
              </div>
              <div className="space-y-2">
                <Label>GSTIN *</Label>
                <Input value={gstin} onChange={(e) => setGstin(e.target.value)} placeholder="22AAAAA0000A1Z5" maxLength={15} />
              </div>
              <div className="space-y-2">
                <Label>Business Type *</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contractor">General Contractor</SelectItem>
                    <SelectItem value="builder">Builder / Developer</SelectItem>
                    <SelectItem value="dealer">Material Dealer</SelectItem>
                    <SelectItem value="architect">Architect / Consultant</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Registered Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full address with PIN code" />
              </div>
              <Button onClick={handleBusinessSubmit} className="w-full">Continue</Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Documents */}
        {step === "documents" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upload Documents</CardTitle>
              <CardDescription>Upload your business verification documents (PDF, JPG, PNG — max 10 MB each)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "PAN Card *",              file: panFile,     setter: setPanFile },
                { label: "GST Certificate *",       file: gstFile,     setter: setGstFile },
                { label: "Address Proof (optional)",file: addressFile, setter: setAddressFile },
              ].map(({ label, file, setter }) => (
                <div
                  key={label}
                  className={cn("border rounded-lg p-4 flex items-center justify-between", file && "border-primary bg-primary/5")}
                >
                  <div className="flex items-center gap-3">
                    {file
                      ? <CheckCircle2 className="h-5 w-5 text-primary" />
                      : <Upload className="h-5 w-5 text-muted-foreground" />}
                    <div>
                      <p className="text-sm font-medium">{label}</p>
                      <p className="text-xs text-muted-foreground">{file ? file.name : "PDF, JPG, PNG (max 10 MB)"}</p>
                    </div>
                  </div>
                  {!file && (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setter(e.target.files[0]);
                            toast.success("Document selected");
                          }
                        }}
                      />
                      <Button variant="outline" size="sm" asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                  )}
                  {file && (
                    <Button variant="ghost" size="sm" onClick={() => setter(null)}>Remove</Button>
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep("business")} className="flex-1">Back</Button>
                <Button onClick={handleDocumentsSubmit} className="flex-1">Continue</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Verification */}
        {step === "verification" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Review & Submit</CardTitle>
              <CardDescription>Confirm your details to complete KYC</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/50 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Company</span>
                  <span className="font-medium">{companyName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">GSTIN</span>
                  <span className="font-medium">{gstin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{businessType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Documents</span>
                  <span className="font-medium">
                    {[panFile, gstFile, addressFile].filter(Boolean).length}/3 uploaded
                  </span>
                </div>
              </div>
              <div className="border rounded-lg p-4 text-sm">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Your documents will be reviewed by our team</li>
                  <li>• Full pricing and bulk discounts will be unlocked once approved</li>
                  <li>• You can place orders and access all marketplace features</li>
                </ul>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("documents")} className="flex-1">Back</Button>
                <Button onClick={handleVerify} className="flex-1 gap-2" disabled={loading}>
                  {loading ? "Submitting…" : <><Shield className="h-4 w-4" /> Submit KYC</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default KYC;
