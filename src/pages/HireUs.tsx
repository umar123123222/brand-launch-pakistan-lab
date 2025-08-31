import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, Calculator, Calendar, FileText, CheckCircle, XCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface Lead {
  id?: string;
  brand_name?: string;
  website?: string;
  contact_name?: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  currency: string;
  aov?: number;
  gross_margin_pct?: number;
  monthly_ad_budget?: number;
  current_orders_per_month?: number;
  per_sale_fee?: number;
  gp_per_order?: number;
  cps_breakeven?: number;
  roas_breakeven?: number;
  target_net_margin_pct?: number;
  cps_target?: number;
  vertical?: string;
  geo?: string;
  notes?: string;
  source: string;
  status: string;
}

interface AvailabilitySlot {
  id: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
}

const HireUs = () => {
  const { toast } = useToast();
  
  // State for calculator
  const [calculatorData, setCalculatorData] = useState({
    currency: 'PKR',
    aov: '',
    gross_margin_pct: '',
    monthly_ad_budget: '',
    current_orders_per_month: '',
    target_net_margin_pct: '',
    fee_share_pct: 20
  });

  // State for pre-qualification
  const [preQualData, setPreQualData] = useState({
    brand_name: '',
    website: '',
    contact_name: '',
    email: '',
    whatsapp: '',
    currency: 'PKR',
    monthly_ad_budget: '',
    current_orders_per_month: '',
    vertical: '',
    geo: '',
    notes: ''
  });

  // State for MSA
  const [msaData, setMsaData] = useState({
    client_legal_name: '',
    jurisdiction: 'Pakistan',
    currency: 'PKR',
    aov: '',
    gross_margin_pct: '',
    fee_share_pct: '',
    per_sale_fee: '',
    term_start_date: new Date().toISOString().split('T')[0],
    term_length_months: 12,
    notice_days: 30,
    reporting_cadence: 'weekly',
    brand_assets_permission: false
  });

  // State management
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailabilitySlot | null>(null);
  const [isQualified, setIsQualified] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [showMSA, setShowMSA] = useState(false);
  const [savedLead, setSavedLead] = useState<Lead | null>(null);

  // Load availability slots
  useEffect(() => {
    loadAvailabilitySlots();
  }, []);

  const loadAvailabilitySlots = async () => {
    try {
      const { data, error } = await supabase
        .from('availability_slots')
        .select('*')
        .eq('is_booked', false)
        .gte('start_time', new Date().toISOString())
        .order('start_time');

      if (error) throw error;
      setAvailableSlots(data || []);
    } catch (error) {
      console.error('Error loading slots:', error);
    }
  };

  // Calculator calculations
  const calculatorResults = useMemo(() => {
    const aov = parseFloat(calculatorData.aov) || 0;
    const gross_margin_pct = parseFloat(calculatorData.gross_margin_pct) || 0;
    const monthly_ad_budget = parseFloat(calculatorData.monthly_ad_budget) || 0;
    const fee_share_pct = calculatorData.fee_share_pct || 20;
    const target_net_margin_pct = parseFloat(calculatorData.target_net_margin_pct) || 0;

    const gp_per_order = aov * (gross_margin_pct / 100);
    const per_sale_fee = Math.max(1, gp_per_order * (fee_share_pct / 100));
    const cps_breakeven = Math.max(1, gp_per_order - per_sale_fee);
    const roas_breakeven = aov > 0 ? aov / cps_breakeven : 0;
    const max_monthly_orders = cps_breakeven > 0 ? monthly_ad_budget / cps_breakeven : 0;
    const cps_target = target_net_margin_pct > 0 ? 
      gp_per_order - per_sale_fee - (aov * target_net_margin_pct / 100) : null;

    return {
      gp_per_order: gp_per_order.toFixed(2),
      per_sale_fee: per_sale_fee.toFixed(2),
      cps_breakeven: cps_breakeven.toFixed(2),
      roas_breakeven: roas_breakeven.toFixed(2),
      max_monthly_orders: max_monthly_orders.toFixed(0),
      cps_target: cps_target ? cps_target.toFixed(2) : null
    };
  }, [calculatorData]);

  // Currency formatting
  const formatCurrency = (amount: string, currency: string) => {
    const symbols: { [key: string]: string } = { PKR: 'Rs. ', AED: 'AED ', USD: '$ ' };
    return `${symbols[currency] || ''}${amount}`;
  };

  // Currency thresholds
  const getMinBudget = (currency: string) => {
    const thresholds: { [key: string]: number } = { PKR: 500000, AED: 5000, USD: 1500 };
    return thresholds[currency] || 500000;
  };

  // Save calculator data
  const handleSaveCalculator = async () => {
    try {
      const leadData = {
        currency: calculatorData.currency,
        aov: parseFloat(calculatorData.aov) || null,
        gross_margin_pct: parseFloat(calculatorData.gross_margin_pct) || null,
        monthly_ad_budget: parseFloat(calculatorData.monthly_ad_budget) || null,
        current_orders_per_month: parseFloat(calculatorData.current_orders_per_month) || null,
        per_sale_fee: parseFloat(calculatorResults.per_sale_fee),
        gp_per_order: parseFloat(calculatorResults.gp_per_order),
        cps_breakeven: parseFloat(calculatorResults.cps_breakeven),
        roas_breakeven: parseFloat(calculatorResults.roas_breakeven),
        target_net_margin_pct: parseFloat(calculatorData.target_net_margin_pct) || null,
        cps_target: calculatorResults.cps_target ? parseFloat(calculatorResults.cps_target) : null,
        source: 'calculator',
        status: 'new'
      };

      const { data, error } = await supabase
        .from('leads_elevate')
        .insert(leadData)
        .select()
        .single();

      if (error) throw error;
      
      setSavedLead(data);
      toast({ title: "Calculator data saved successfully!" });
      
      // Scroll to pre-qual
      document.getElementById('pre-qual')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error saving calculator:', error);
      toast({ title: "Error saving data", variant: "destructive" });
    }
  };

  // Submit pre-qualification
  const handlePreQualSubmit = async () => {
    try {
      const budget = parseFloat(preQualData.monthly_ad_budget);
      const orders = parseFloat(preQualData.current_orders_per_month);
      const minBudget = getMinBudget(preQualData.currency);
      
      const isQualified = budget >= minBudget && orders > 0;
      
      const leadData = {
        brand_name: preQualData.brand_name,
        website: preQualData.website,
        contact_name: preQualData.contact_name,
        email: preQualData.email,
        whatsapp: preQualData.whatsapp,
        currency: preQualData.currency,
        monthly_ad_budget: budget,
        current_orders_per_month: orders,
        vertical: preQualData.vertical,
        geo: preQualData.geo,
        notes: preQualData.notes,
        source: 'prequal',
        status: isQualified ? 'qualified' : 'rejected'
      };

      // If we have saved calculator data, merge it
      if (savedLead && preQualData.email) {
        const { error } = await supabase
          .from('leads_elevate')
          .update(leadData)
          .eq('id', savedLead.id);
        
        if (error) throw error;
        setCurrentLead({ ...savedLead, ...leadData });
      } else {
        const { data, error } = await supabase
          .from('leads_elevate')
          .insert(leadData)
          .select()
          .single();

        if (error) throw error;
        setCurrentLead(data);
      }

      setIsQualified(isQualified);
      
      if (isQualified) {
        toast({ title: "Great! You're qualified. Choose a time below." });
        document.getElementById('scheduler')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        toast({ title: "Not quite a fit yet, but bookmark this page for later.", variant: "destructive" });
      }
    } catch (error) {
      console.error('Error submitting pre-qual:', error);
      toast({ title: "Error submitting form", variant: "destructive" });
    }
  };

  // Book a slot
  const handleBookSlot = async (slot: AvailabilitySlot) => {
    if (!currentLead || !isQualified) return;

    try {
      // Create booking
      const { error: bookingError } = await supabase
        .from('bookings_elevate')
        .insert({
          lead_id: currentLead.id,
          slot_id: slot.id,
          brand_name: currentLead.brand_name || '',
          contact_name: currentLead.contact_name || '',
          email: currentLead.email || '',
          phone: currentLead.phone,
          whatsapp: currentLead.whatsapp,
          agenda: 'Performance marketing consultation'
        });

      if (bookingError) throw bookingError;

      // Mark slot as booked
      const { error: slotError } = await supabase
        .from('availability_slots')
        .update({ is_booked: true })
        .eq('id', slot.id);

      if (slotError) throw slotError;

      // Update lead status
      const { error: leadError } = await supabase
        .from('leads_elevate')
        .update({ status: 'booked' })
        .eq('id', currentLead.id);

      if (leadError) throw leadError;

      setSelectedSlot(slot);
      setIsBooked(true);
      
      // Pre-fill MSA data
      setMsaData(prev => ({
        ...prev,
        client_legal_name: currentLead.brand_name || '',
        currency: currentLead.currency,
        aov: currentLead.aov?.toString() || '',
        gross_margin_pct: currentLead.gross_margin_pct?.toString() || '',
        fee_share_pct: '20',
        per_sale_fee: currentLead.per_sale_fee?.toString() || ''
      }));

      toast({ title: "Meeting booked successfully!" });
      
    } catch (error) {
      console.error('Error booking slot:', error);
      toast({ title: "Error booking meeting", variant: "destructive" });
    }
  };

  // Generate MSA
  const generateMSAHtml = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Master Services Agreement (Performance-Only)</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { text-align: center; margin-bottom: 30px; }
    h2 { margin-top: 25px; margin-bottom: 10px; }
    p { margin-bottom: 15px; line-height: 1.6; }
    .signature-section { margin-top: 40px; }
    .signature-line { border-bottom: 1px solid #000; width: 200px; display: inline-block; margin-right: 50px; }
  </style>
</head>
<body>
  <h1>Master Services Agreement (Performance-Only)</h1>
  
  <p><strong>Parties:</strong> ${msaData.client_legal_name} ("Client") and Elevate51 ("Agency").</p>
  
  <h2>Scope</h2>
  <p>Agency manages Client's paid acquisition on Meta and YouTube and provides strategy, creative briefs, campaign builds, daily optimizations, and weekly reporting.</p>
  
  <h2>Compensation</h2>
  <p>Per-sale fee equals ${msaData.fee_share_pct}% of Gross Profit per Order. "Gross Profit per Order" = AOV × ${msaData.gross_margin_pct}%. Example: AOV ${formatCurrency(msaData.aov, msaData.currency)} × Margin ${msaData.gross_margin_pct}% = ${formatCurrency((parseFloat(msaData.aov) * parseFloat(msaData.gross_margin_pct) / 100).toFixed(2), msaData.currency)}; Fee ${msaData.fee_share_pct}% = ${formatCurrency(msaData.per_sale_fee, msaData.currency)} per order. Fees are invoiced weekly against platform-tracked purchases (last-click Attribution Settings disclosed in reporting).</p>
  
  <h2>Term & Termination</h2>
  <p>Term starts ${msaData.term_start_date} for ${msaData.term_length_months} months and renews month-to-month. Either party may terminate with ${msaData.notice_days} days' written notice.</p>
  
  <h2>Minimums</h2>
  <p>Client maintains an ad budget of at least ${formatCurrency(getMinBudget(msaData.currency).toString(), msaData.currency)} per month and gives Agency admin access to ad accounts and assets.</p>
  
  <h2>Reporting</h2>
  <p>${msaData.reporting_cadence === 'weekly' ? 'Weekly' : 'Bi-weekly'} report includes spend, purchases, revenue, CPS, ROAS, top creatives, and next actions.</p>
  
  <h2>Creative & Rights</h2>
  <p>Client owns all creative produced for the account. Agency may reference anonymized performance in its portfolio unless Client opts out.</p>
  
  <h2>Invoicing & Payment</h2>
  <p>Invoices due within 7 days. Late payments may pause services.</p>
  
  <h2>Confidentiality & Data</h2>
  <p>Both parties keep shared data confidential and comply with applicable laws.</p>
  
  <h2>Limitation of Liability</h2>
  <p>No indirect or consequential damages; liability capped at one month of fees.</p>
  
  <h2>Governing Law</h2>
  <p>${msaData.jurisdiction}.</p>
  
  <div class="signature-section">
    <p><strong>Signed:</strong></p>
    <p>Client: <span class="signature-line"></span> Date: <span class="signature-line"></span></p>
    <p>Agency (Elevate51): <span class="signature-line"></span> Date: <span class="signature-line"></span></p>
  </div>
</body>
</html>
    `.trim();
  };

  // Save MSA to Supabase
  const handleSaveMSA = async () => {
    if (!currentLead) return;

    try {
      const { error } = await supabase
        .from('msas')
        .insert({
          lead_id: currentLead.id,
          json_payload: msaData,
          html_snapshot: generateMSAHtml()
        });

      if (error) throw error;
      toast({ title: "MSA saved to database successfully!" });
    } catch (error) {
      console.error('Error saving MSA:', error);
      toast({ title: "Error saving MSA", variant: "destructive" });
    }
  };

  // Scroll handlers
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-medium text-sm">We earn when you earn. No retainers.</span>
          <Button 
            onClick={() => scrollToSection('pre-qual')}
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Check Fit
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-24">
        
        {/* Hero Section */}
        <section id="hero" className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground leading-tight">
              We earn when you earn.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Performance-first Meta & YouTube ads for ecommerce brands that already sell. 
              No retainers. A per-sale fee from your gross profit, or we don't work together.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => scrollToSection('pre-qual')}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Check Fit
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.open('https://wa.me/', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              WhatsApp Shoaib
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Badge variant="secondary" className="text-xs">Trusted by brands selling daily</Badge>
            <Badge variant="secondary" className="text-xs">Built by operators, not "agencies"</Badge>
            <Badge variant="secondary" className="text-xs">Numbers or nothing</Badge>
          </div>
        </section>

        {/* Proof Section */}
        <section id="proof" className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Numbers we sign our name on</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attar brand, Pakistan.</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <div className="font-medium">30 days</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <div className="font-medium">PKR 5.4M</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenue:</span>
                    <div className="font-medium text-green-600">PKR 22.7M</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ROAS:</span>
                    <div className="font-medium text-green-600">4.2</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  We rebuilt the account, simplified the funnel, fixed creative cadence, and tightened city targeting.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skincare brand, UAE.</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Time:</span>
                    <div className="font-medium">45 days</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <div className="font-medium">AED 120k</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Revenue:</span>
                    <div className="font-medium text-green-600">AED 510k</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">ROAS:</span>
                    <div className="font-medium text-green-600">4.25</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  We aligned offers with AOV, introduced UGC scripts, and killed dead weight.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* The Offer Section */}
        <section id="offer" className="text-center space-y-6 bg-secondary/30 p-8 rounded-lg">
          <h2 className="text-3xl font-bold">The Offer</h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <p>
              You're already selling. You can allocate at least 500,000 per month to ads. 
              If that's you, we'll run your Meta and YouTube with one promise: we make money per sale, from your gross profit.
            </p>
            <p>
              <strong>What you get:</strong> strategy, creative briefs, account rebuild where needed, 
              daily optimization, real reporting, and founder-level attention.
            </p>
            <p className="text-muted-foreground">
              If you want retainers, slides, and excuses—this isn't it. 
              If you want orders at a cost you can live with, click Check fit.
            </p>
          </div>
          <Button 
            size="lg"
            onClick={() => scrollToSection('pre-qual')}
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Check Fit
          </Button>
        </section>

        {/* Live Calculator */}
        <section id="calculator" className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Calculator className="w-12 h-12 text-accent" />
            </div>
            <h2 className="text-3xl font-bold">Live Calculator</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Know your numbers before we talk. Enter your AOV and gross margin. 
              We'll show the per-sale fee, breakeven CPS, and breakeven ROAS. Save your numbers and continue.
            </p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Currency</Label>
                    <Select value={calculatorData.currency} onValueChange={(value) => 
                      setCalculatorData(prev => ({ ...prev, currency: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PKR">PKR (Pakistani Rupee)</SelectItem>
                        <SelectItem value="AED">AED (UAE Dirham)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="aov">Average Order Value (AOV)</Label>
                    <Input 
                      type="number" 
                      value={calculatorData.aov}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, aov: e.target.value }))}
                      placeholder={`Enter AOV in ${calculatorData.currency}`}
                    />
                  </div>

                  <div>
                    <Label htmlFor="margin">Gross Margin %</Label>
                    <Input 
                      type="number" 
                      value={calculatorData.gross_margin_pct}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, gross_margin_pct: e.target.value }))}
                      placeholder="Enter margin percentage"
                    />
                  </div>

                  <div>
                    <Label htmlFor="budget">Monthly Ad Budget</Label>
                    <Input 
                      type="number" 
                      value={calculatorData.monthly_ad_budget}
                      onChange={(e) => setCalculatorData(prev => ({ ...prev, monthly_ad_budget: e.target.value }))}
                      placeholder={`Min ${getMinBudget(calculatorData.currency).toLocaleString()} ${calculatorData.currency}`}
                    />
                  </div>

                  <div>
                    <Label>Fee Share % (Our cut from gross profit)</Label>
                    <div className="px-4 pt-4">
                      <Slider
                        value={[calculatorData.fee_share_pct]}
                        onValueChange={(value) => setCalculatorData(prev => ({ ...prev, fee_share_pct: value[0] }))}
                        min={15}
                        max={30}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>15%</span>
                        <span>{calculatorData.fee_share_pct}%</span>
                        <span>30%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-secondary/50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg">Your Numbers</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Profit/Order:</span>
                      <span className="font-medium">{formatCurrency(calculatorResults.gp_per_order, calculatorData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Our Fee/Order:</span>
                      <span className="font-medium">{formatCurrency(calculatorResults.per_sale_fee, calculatorData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CPS Breakeven:</span>
                      <span className="font-medium">{formatCurrency(calculatorResults.cps_breakeven, calculatorData.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ROAS Breakeven:</span>
                      <span className="font-medium">{calculatorResults.roas_breakeven}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Orders/Month:</span>
                      <span className="font-medium">{calculatorResults.max_monthly_orders}</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button 
                      onClick={handleSaveCalculator} 
                      className="w-full"
                      disabled={!calculatorData.aov || !calculatorData.gross_margin_pct}
                    >
                      Save & Continue
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      This will save your calculations and scroll to the pre-qualification form
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Pre-Qualification Gate */}
        <section id="pre-qual" className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Are we a fit?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We only accept brands with real demand and discipline. 
              Minimum monthly ad budget: 500,000. Must already be generating sales. 
              Share the basics below to unlock the calendar.
            </p>
          </div>

          <Card>
            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="brand_name">Brand Name *</Label>
                  <Input 
                    value={preQualData.brand_name}
                    onChange={(e) => setPreQualData(prev => ({ ...prev, brand_name: e.target.value }))}
                    placeholder="Your brand name"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website *</Label>
                  <Input 
                    value={preQualData.website}
                    onChange={(e) => setPreQualData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourbrand.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_name">Contact Name *</Label>
                  <Input 
                    value={preQualData.contact_name}
                    onChange={(e) => setPreQualData(prev => ({ ...prev, contact_name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    type="email"
                    value={preQualData.email}
                    onChange={(e) => setPreQualData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input 
                    value={preQualData.whatsapp}
                    onChange={(e) => setPreQualData(prev => ({ ...prev, whatsapp: e.target.value }))}
                    placeholder="+92 300 1234567"
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={preQualData.currency} onValueChange={(value) => 
                    setPreQualData(prev => ({ ...prev, currency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PKR">PKR</SelectItem>
                      <SelectItem value="AED">AED</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="monthly_budget">Monthly Ad Budget *</Label>
                  <Input 
                    type="number"
                    value={preQualData.monthly_ad_budget}
                    onChange={(e) => setPreQualData(prev => ({ ...prev, monthly_ad_budget: e.target.value }))}
                    placeholder={`Min ${getMinBudget(preQualData.currency).toLocaleString()}`}
                  />
                </div>

                <div>
                  <Label htmlFor="current_orders">Current Orders/Month *</Label>
                  <Input 
                    type="number"
                    value={preQualData.current_orders_per_month}
                    onChange={(e) => setPreQualData(prev => ({ ...prev, current_orders_per_month: e.target.value }))}
                    placeholder="Must be > 0"
                  />
                </div>

                <div>
                  <Label htmlFor="vertical">Vertical</Label>
                  <Input 
                    value={preQualData.vertical}
                    onChange={(e) => setPreQualData(prev => ({ ...prev, vertical: e.target.value }))}
                    placeholder="e.g. Fashion, Beauty, Tech"
                  />
                </div>

                <div>
                  <Label htmlFor="geo">Geography</Label>
                  <Input 
                    value={preQualData.geo}
                    onChange={(e) => setPreQualData(prev => ({ ...prev, geo: e.target.value }))}
                    placeholder="e.g. Pakistan, UAE, USA"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea 
                  value={preQualData.notes}
                  onChange={(e) => setPreQualData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any additional details you'd like to share"
                />
              </div>

              <Button 
                onClick={handlePreQualSubmit}
                className="w-full"
                disabled={!preQualData.brand_name || !preQualData.email || !preQualData.monthly_ad_budget || !preQualData.current_orders_per_month}
              >
                Submit Pre-Qualification
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Rejection Message */}
        {isQualified === false && currentLead?.status === 'rejected' && (
          <section className="text-center bg-destructive/10 p-8 rounded-lg">
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Not a fit yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're strict because performance demands it. Bookmark this page. 
              When you're spending 500,000/month and selling daily, come back—we'll move fast.
            </p>
          </section>
        )}

        {/* Scheduler - Only show if qualified */}
        {isQualified && !isBooked && (
          <section id="scheduler" className="space-y-8">
            <div className="text-center space-y-4">
              <Calendar className="w-12 h-12 text-accent mx-auto" />
              <h2 className="text-3xl font-bold">Pick a time.</h2>
              <p className="text-muted-foreground">
                Choose any open slot. You'll get a confirmation on-screen with next steps.
              </p>
            </div>

            <div className="grid gap-4">
              {availableSlots.length === 0 ? (
                <p className="text-center text-muted-foreground">No available slots at the moment.</p>
              ) : (
                availableSlots.map(slot => (
                  <Card key={slot.id} className="cursor-pointer hover:bg-secondary/50" onClick={() => handleBookSlot(slot)}>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          {format(parseISO(slot.start_time), 'EEEE, MMMM d, yyyy')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {format(parseISO(slot.start_time), 'h:mm a')} - {format(parseISO(slot.end_time), 'h:mm a')}
                        </div>
                      </div>
                      <Button size="sm">Book This Time</Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>
        )}

        {/* Booking Success */}
        {isBooked && selectedSlot && (
          <section className="text-center bg-green-50 p-8 rounded-lg">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Meeting Confirmed!</h3>
            <div className="space-y-2 mb-6">
              <p><strong>Date:</strong> {format(parseISO(selectedSlot.start_time), 'EEEE, MMMM d, yyyy')}</p>
              <p><strong>Time:</strong> {format(parseISO(selectedSlot.start_time), 'h:mm a')} - {format(parseISO(selectedSlot.end_time), 'h:mm a')}</p>
            </div>
            <Button onClick={() => setShowMSA(true)}>
              <FileText className="w-4 h-4 mr-2" />
              Generate MSA
            </Button>
          </section>
        )}

        {/* MSA Generator - Only show if booked and requested */}
        {showMSA && isBooked && (
          <section id="msa" className="space-y-8">
            <div className="text-center space-y-4">
              <FileText className="w-12 h-12 text-accent mx-auto" />
              <h2 className="text-3xl font-bold">Lightweight, performance-only agreement.</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This contract mirrors what we discussed: a per-sale fee from your gross profit, 
                no lock-ins beyond a short notice period, and clear reporting. Edit the variables and save.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* MSA Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Variables</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Client Legal Name</Label>
                    <Input 
                      value={msaData.client_legal_name}
                      onChange={(e) => setMsaData(prev => ({ ...prev, client_legal_name: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label>Jurisdiction</Label>
                    <Input 
                      value={msaData.jurisdiction}
                      onChange={(e) => setMsaData(prev => ({ ...prev, jurisdiction: e.target.value }))}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>AOV</Label>
                      <Input 
                        value={msaData.aov}
                        onChange={(e) => setMsaData(prev => ({ ...prev, aov: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Gross Margin %</Label>
                      <Input 
                        value={msaData.gross_margin_pct}
                        onChange={(e) => setMsaData(prev => ({ ...prev, gross_margin_pct: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fee Share %</Label>
                      <Input 
                        value={msaData.fee_share_pct}
                        onChange={(e) => setMsaData(prev => ({ ...prev, fee_share_pct: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label>Per-Sale Fee</Label>
                      <Input 
                        value={msaData.per_sale_fee}
                        onChange={(e) => setMsaData(prev => ({ ...prev, per_sale_fee: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Term Length (months)</Label>
                      <Input 
                        type="number"
                        value={msaData.term_length_months}
                        onChange={(e) => setMsaData(prev => ({ ...prev, term_length_months: parseInt(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label>Notice Period (days)</Label>
                      <Input 
                        type="number"
                        value={msaData.notice_days}
                        onChange={(e) => setMsaData(prev => ({ ...prev, notice_days: parseInt(e.target.value) }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Reporting Cadence</Label>
                    <Select value={msaData.reporting_cadence} onValueChange={(value) => 
                      setMsaData(prev => ({ ...prev, reporting_cadence: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="brand_assets"
                      checked={msaData.brand_assets_permission}
                      onCheckedChange={(checked) => setMsaData(prev => ({ ...prev, brand_assets_permission: !!checked }))}
                    />
                    <Label htmlFor="brand_assets" className="text-sm">
                      Grant permission to use brand assets in portfolio (anonymized)
                    </Label>
                  </div>

                  <div className="flex gap-4">
                    <Button onClick={handleSaveMSA} className="flex-1">
                      Save to Supabase
                    </Button>
                    <Button variant="outline" onClick={() => window.print()} className="flex-1">
                      Print to PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Live MSA Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Contract Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="prose prose-sm max-w-none text-xs leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: generateMSAHtml() }}
                  />
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* FAQs */}
        <section id="faqs" className="space-y-8">
          <h2 className="text-3xl font-bold text-center">FAQs</h2>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why the 500,000 minimum?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Below that, data is noisy and learning cycles are slow. We protect both sides' time.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if my margin is low?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The calculator will show you the reality. If breakeven ROAS is unrealistic for your niche, we'll say no.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's your per-sale fee?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  It's a percentage of your gross profit per order—typically 20%—shown live in the calculator before you book.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-muted-foreground border-t pt-8">
          <p>&copy; 2024 Elevate51. Performance-first marketing.</p>
        </footer>
      </div>
    </div>
  );
};

export default HireUs;