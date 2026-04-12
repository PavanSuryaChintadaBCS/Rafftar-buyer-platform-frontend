import { Product, Supplier, Address } from "./types";

export const categories = [
  { id: "cement", name: "Cement", icon: "🏗️" },
  { id: "steel", name: "Steel & TMT", icon: "🔩" },
  { id: "bricks", name: "Bricks & Blocks", icon: "🧱" },
  { id: "tiles", name: "Tiles & Flooring", icon: "🪟" },
  { id: "sand", name: "Sand & Aggregates", icon: "⛰️" },
  { id: "electrical", name: "Electricals", icon: "⚡" },
  { id: "plumbing", name: "Plumbing", icon: "🚿" },
];

export const mockAddresses: Address[] = [
  { id: "a1", label: "Site Office – Andheri", line1: "Plot 45, MIDC Industrial Area", line2: "Andheri East", city: "Mumbai", state: "Maharashtra", pin: "400093" },
  { id: "a2", label: "Warehouse – Bhiwandi", line1: "Godown #12, Kalyan Road", line2: "Near Toll Naka", city: "Bhiwandi", state: "Maharashtra", pin: "421302" },
  { id: "a3", label: "Project Site – Powai", line1: "Tower B, Hiranandani Complex", line2: "Powai Lake Road", city: "Mumbai", state: "Maharashtra", pin: "400076" },
];

export const suppliers: Supplier[] = [
  { id: "s1", name: "BuildRight Industries", logo: "/placeholder.svg", location: "Mumbai, MH", rating: 4.7, reviewCount: 342, description: "Leading manufacturer of cement and building materials since 1998. ISO 9001 certified with pan-India distribution.", established: 1998, productCount: 5, rafftarPricing: true, tags: ["cement", "waterproofing", "construction"] },
  { id: "s2", name: "SteelCore Trading Co.", logo: "/placeholder.svg", location: "Jamshedpur, JH", rating: 4.5, reviewCount: 218, description: "Premium steel and TMT bar supplier with direct mill partnerships across India.", established: 2005, productCount: 4, rafftarPricing: true, tags: ["steel", "tmt", "wire", "fabrication"] },
  { id: "s3", name: "GreenBrick Pvt Ltd", logo: "/placeholder.svg", location: "Bangalore, KA", rating: 4.3, reviewCount: 156, description: "Eco-friendly brick and block manufacturer. Specializing in fly ash and AAC blocks.", established: 2010, productCount: 4, rafftarPricing: false, tags: ["bricks", "blocks", "aac", "eco-friendly"] },
  { id: "s4", name: "TileWorld Ceramics", logo: "/placeholder.svg", location: "Morbi, GJ", rating: 4.6, reviewCount: 289, description: "Premium ceramic and vitrified tile manufacturer with modern Italian technology.", established: 2003, productCount: 4, rafftarPricing: true, tags: ["tiles", "ceramic", "flooring", "vitrified"] },
  { id: "s5", name: "RiverSand Suppliers", logo: "/placeholder.svg", location: "Chennai, TN", rating: 4.1, reviewCount: 97, description: "Reliable supplier of construction-grade sand, gravel, and aggregates.", established: 2012, productCount: 3, rafftarPricing: false, tags: ["sand", "aggregate", "gravel"] },
  { id: "s6", name: "VoltEdge Electricals", logo: "/placeholder.svg", location: "Delhi, DL", rating: 4.4, reviewCount: 203, description: "Comprehensive electrical supplies for residential and commercial projects.", established: 2008, productCount: 4, rafftarPricing: true, tags: ["electrical", "wiring", "switches", "led"] },
  { id: "s7", name: "AquaFlow Plumbing", logo: "/placeholder.svg", location: "Pune, MH", rating: 4.2, reviewCount: 134, description: "Full-range plumbing solutions from pipes to fixtures. ISI marked products.", established: 2007, productCount: 3, rafftarPricing: false, tags: ["plumbing", "pipes", "fixtures"] },
  { id: "s8", name: "MegaBuild Supplies", logo: "/placeholder.svg", location: "Hyderabad, TS", rating: 4.8, reviewCount: 412, description: "One-stop shop for all construction materials. Trusted by 500+ builders.", established: 1995, productCount: 5, rafftarPricing: true, tags: ["cement", "tiles", "electrical", "plumbing"] },
  { id: "s9", name: "Concrete Kings", logo: "/placeholder.svg", location: "Ahmedabad, GJ", rating: 4.0, reviewCount: 88, description: "Specialized in ready-mix concrete, cement, and aggregates.", established: 2015, productCount: 3, rafftarPricing: false, tags: ["cement", "concrete", "aggregate"] },
  { id: "s10", name: "PrimeSteel Traders", logo: "/placeholder.svg", location: "Kolkata, WB", rating: 4.3, reviewCount: 167, description: "Wholesale steel distributor with competitive bulk pricing.", established: 2001, productCount: 3, rafftarPricing: true, tags: ["steel", "tmt", "wholesale"] },
];

export const products: Product[] = [
  // Cement
  { id: "p1", name: "UltraTech OPC 53 Grade Cement", image: "/placeholder.svg", category: "cement", price: 380, unit: "bag (50kg)", supplierId: "s1", supplierName: "BuildRight Industries", rating: 4.7, reviewCount: 89, description: "Premium OPC 53 grade cement ideal for high-strength concrete, RCC structures, and pre-stressed concrete elements.", specifications: { Grade: "OPC 53", Weight: "50 kg", "Setting Time": "30 min initial", Strength: "53 MPa at 28 days" }, bulkPricing: [{ minQty: 1, maxQty: 99, price: 380 }, { minQty: 100, maxQty: 499, price: 365 }, { minQty: 500, maxQty: null, price: 350 }], inStock: true, moq: 10, tags: ["opc", "53 grade", "high strength", "rcc"], rafftarDiscount: 5 },
  { id: "p2", name: "ACC PPC Cement", image: "/placeholder.svg", category: "cement", price: 350, unit: "bag (50kg)", supplierId: "s8", supplierName: "MegaBuild Supplies", rating: 4.5, reviewCount: 67, description: "Portland Pozzolana Cement suitable for all general construction purposes.", specifications: { Grade: "PPC", Weight: "50 kg", "Setting Time": "30 min initial", Type: "Pozzolana" }, bulkPricing: [{ minQty: 1, maxQty: 99, price: 350 }, { minQty: 100, maxQty: 499, price: 335 }, { minQty: 500, maxQty: null, price: 320 }], inStock: true, moq: 10, tags: ["ppc", "pozzolana", "general construction"], rafftarDiscount: 4 },
  { id: "p3", name: "Ambuja Plus Cement", image: "/placeholder.svg", category: "cement", price: 370, unit: "bag (50kg)", supplierId: "s9", supplierName: "Concrete Kings", rating: 4.3, reviewCount: 45, description: "High-performance cement with superior strength and durability for modern construction.", specifications: { Grade: "OPC 43", Weight: "50 kg", "Setting Time": "35 min initial", Strength: "43 MPa at 28 days" }, bulkPricing: [{ minQty: 1, maxQty: 99, price: 370 }, { minQty: 100, maxQty: 499, price: 355 }, { minQty: 500, maxQty: null, price: 340 }], inStock: true, moq: 10, tags: ["opc", "43 grade", "durable"], rafftarDiscount: 3 },
  { id: "p4", name: "White Cement (Birla)", image: "/placeholder.svg", category: "cement", price: 520, unit: "bag (25kg)", supplierId: "s1", supplierName: "BuildRight Industries", rating: 4.6, reviewCount: 34, description: "Premium white cement for decorative applications, tile joints, and textured finishes.", specifications: { Grade: "White OPC", Weight: "25 kg", Color: "White", Application: "Decorative" }, bulkPricing: [{ minQty: 1, maxQty: 49, price: 520 }, { minQty: 50, maxQty: 199, price: 495 }, { minQty: 200, maxQty: null, price: 475 }], inStock: true, moq: 5, tags: ["white cement", "decorative", "tile joints"], rafftarDiscount: 4 },

  // Steel
  { id: "p5", name: "Tata Tiscon TMT Bar Fe500D", image: "/placeholder.svg", category: "steel", price: 62, unit: "kg", supplierId: "s2", supplierName: "SteelCore Trading Co.", rating: 4.8, reviewCount: 156, description: "High-strength TMT reinforcement bar with superior ductility and weldability.", specifications: { Grade: "Fe500D", Diameter: "8mm-32mm", Length: "12m", Standard: "IS 1786" }, bulkPricing: [{ minQty: 1, maxQty: 999, price: 62 }, { minQty: 1000, maxQty: 4999, price: 59 }, { minQty: 5000, maxQty: null, price: 56 }], inStock: true, moq: 100, tags: ["tmt", "fe500d", "reinforcement", "tata"], rafftarDiscount: 6 },
  { id: "p6", name: "JSW NeoSteel TMT Bar", image: "/placeholder.svg", category: "steel", price: 60, unit: "kg", supplierId: "s10", supplierName: "PrimeSteel Traders", rating: 4.4, reviewCount: 98, description: "CRM technology TMT bars for earthquake-resistant structures.", specifications: { Grade: "Fe500D", Diameter: "8mm-25mm", Length: "12m", Technology: "CRM" }, bulkPricing: [{ minQty: 1, maxQty: 999, price: 60 }, { minQty: 1000, maxQty: 4999, price: 57 }, { minQty: 5000, maxQty: null, price: 54 }], inStock: true, moq: 100, tags: ["tmt", "jsw", "earthquake resistant", "crm"], rafftarDiscount: 5 },
  { id: "p7", name: "Steel Binding Wire", image: "/placeholder.svg", category: "steel", price: 85, unit: "kg", supplierId: "s2", supplierName: "SteelCore Trading Co.", rating: 4.2, reviewCount: 43, description: "Annealed binding wire for tying reinforcement bars.", specifications: { Gauge: "18-20", Material: "Mild Steel", Finish: "Annealed", Coil: "25 kg" }, bulkPricing: [{ minQty: 1, maxQty: 99, price: 85 }, { minQty: 100, maxQty: 499, price: 80 }, { minQty: 500, maxQty: null, price: 76 }], inStock: true, moq: 25, tags: ["binding wire", "annealed", "reinforcement"], rafftarDiscount: 3 },
  { id: "p8", name: "MS Angle Iron 50x50x6mm", image: "/placeholder.svg", category: "steel", price: 55, unit: "kg", supplierId: "s10", supplierName: "PrimeSteel Traders", rating: 4.1, reviewCount: 29, description: "Structural mild steel angle for fabrication and construction.", specifications: { Size: "50x50x6mm", Length: "6m", Material: "MS", Standard: "IS 2062" }, bulkPricing: [{ minQty: 1, maxQty: 499, price: 55 }, { minQty: 500, maxQty: 1999, price: 52 }, { minQty: 2000, maxQty: null, price: 49 }], inStock: true, moq: 50, tags: ["angle iron", "structural", "fabrication"], rafftarDiscount: 4 },

  // Bricks
  { id: "p9", name: "Red Clay Bricks (First Class)", image: "/placeholder.svg", category: "bricks", price: 8, unit: "piece", supplierId: "s3", supplierName: "GreenBrick Pvt Ltd", rating: 4.3, reviewCount: 78, description: "First-class red clay bricks with uniform shape, sharp edges, and copper-red color.", specifications: { Size: "230x110x75mm", Weight: "3.2 kg", Strength: ">10 N/mm²", Class: "First" }, bulkPricing: [{ minQty: 1, maxQty: 4999, price: 8 }, { minQty: 5000, maxQty: 19999, price: 7.2 }, { minQty: 20000, maxQty: null, price: 6.5 }], inStock: true, moq: 500, tags: ["red brick", "clay", "first class"], rafftarDiscount: 0 },
  { id: "p10", name: "AAC Blocks 600x200x200mm", image: "/placeholder.svg", category: "bricks", price: 55, unit: "piece", supplierId: "s3", supplierName: "GreenBrick Pvt Ltd", rating: 4.5, reviewCount: 112, description: "Autoclaved Aerated Concrete blocks — lightweight, thermally insulating, and eco-friendly.", specifications: { Size: "600x200x200mm", Density: "550-650 kg/m³", Strength: "3-4 N/mm²", Type: "AAC" }, bulkPricing: [{ minQty: 1, maxQty: 499, price: 55 }, { minQty: 500, maxQty: 1999, price: 50 }, { minQty: 2000, maxQty: null, price: 46 }], inStock: true, moq: 100, tags: ["aac", "lightweight", "eco-friendly", "insulating"], rafftarDiscount: 0 },
  { id: "p11", name: "Fly Ash Bricks", image: "/placeholder.svg", category: "bricks", price: 6, unit: "piece", supplierId: "s8", supplierName: "MegaBuild Supplies", rating: 4.0, reviewCount: 56, description: "Eco-friendly bricks made from fly ash. Uniform in shape with smooth finish.", specifications: { Size: "230x110x75mm", Weight: "2.8 kg", Strength: ">7.5 N/mm²", Material: "Fly Ash" }, bulkPricing: [{ minQty: 1, maxQty: 4999, price: 6 }, { minQty: 5000, maxQty: 19999, price: 5.4 }, { minQty: 20000, maxQty: null, price: 5 }], inStock: true, moq: 500, tags: ["fly ash", "eco-friendly", "smooth"], rafftarDiscount: 3 },
  { id: "p12", name: "Solid Concrete Blocks", image: "/placeholder.svg", category: "bricks", price: 42, unit: "piece", supplierId: "s9", supplierName: "Concrete Kings", rating: 4.2, reviewCount: 38, description: "Heavy-duty solid concrete blocks for load-bearing walls and foundations.", specifications: { Size: "400x200x200mm", Weight: "17 kg", Strength: ">5 N/mm²", Type: "Solid" }, bulkPricing: [{ minQty: 1, maxQty: 499, price: 42 }, { minQty: 500, maxQty: 1999, price: 38 }, { minQty: 2000, maxQty: null, price: 35 }], inStock: true, moq: 50, tags: ["concrete block", "solid", "load bearing"], rafftarDiscount: 0 },

  // Tiles
  { id: "p13", name: "Vitrified Floor Tiles 600x600mm", image: "/placeholder.svg", category: "tiles", price: 45, unit: "sq ft", supplierId: "s4", supplierName: "TileWorld Ceramics", rating: 4.7, reviewCount: 201, description: "Glossy vitrified floor tiles with nano-polished finish. Scratch and stain resistant.", specifications: { Size: "600x600mm", Finish: "Glossy", Thickness: "9mm", "Water Absorption": "<0.5%" }, bulkPricing: [{ minQty: 1, maxQty: 499, price: 45 }, { minQty: 500, maxQty: 1999, price: 41 }, { minQty: 2000, maxQty: null, price: 38 }], inStock: true, moq: 50, tags: ["vitrified", "glossy", "floor", "nano polished"], rafftarDiscount: 5 },
  { id: "p14", name: "Ceramic Wall Tiles 300x450mm", image: "/placeholder.svg", category: "tiles", price: 28, unit: "sq ft", supplierId: "s4", supplierName: "TileWorld Ceramics", rating: 4.4, reviewCount: 134, description: "Digital printed ceramic wall tiles for kitchen and bathroom applications.", specifications: { Size: "300x450mm", Finish: "Matt", Thickness: "7mm", Application: "Wall" }, bulkPricing: [{ minQty: 1, maxQty: 499, price: 28 }, { minQty: 500, maxQty: 1999, price: 25 }, { minQty: 2000, maxQty: null, price: 23 }], inStock: true, moq: 50, tags: ["ceramic", "wall", "kitchen", "bathroom"], rafftarDiscount: 4 },
  { id: "p15", name: "Outdoor Parking Tiles", image: "/placeholder.svg", category: "tiles", price: 35, unit: "sq ft", supplierId: "s4", supplierName: "TileWorld Ceramics", rating: 4.3, reviewCount: 76, description: "Heavy-duty anti-skid parking tiles with high abrasion resistance.", specifications: { Size: "300x300mm", Finish: "Anti-skid", Thickness: "12mm", Application: "Outdoor" }, bulkPricing: [{ minQty: 1, maxQty: 499, price: 35 }, { minQty: 500, maxQty: 1999, price: 32 }, { minQty: 2000, maxQty: null, price: 29 }], inStock: true, moq: 50, tags: ["parking", "anti-skid", "outdoor", "heavy duty"], rafftarDiscount: 4 },
  { id: "p16", name: "Marble Look Porcelain Slab", image: "/placeholder.svg", category: "tiles", price: 85, unit: "sq ft", supplierId: "s8", supplierName: "MegaBuild Supplies", rating: 4.8, reviewCount: 92, description: "Large-format porcelain slabs with Italian marble finish. Book-match available.", specifications: { Size: "1200x2400mm", Finish: "Polished", Thickness: "9mm", Look: "Marble" }, bulkPricing: [{ minQty: 1, maxQty: 199, price: 85 }, { minQty: 200, maxQty: 999, price: 78 }, { minQty: 1000, maxQty: null, price: 72 }], inStock: true, moq: 20, tags: ["marble", "porcelain", "large format", "italian"], rafftarDiscount: 6 },

  // Sand
  { id: "p17", name: "River Sand (Fine)", image: "/placeholder.svg", category: "sand", price: 65, unit: "cu ft", supplierId: "s5", supplierName: "RiverSand Suppliers", rating: 4.1, reviewCount: 67, description: "Fine-grade natural river sand for plastering and masonry work.", specifications: { Grade: "Zone II", Type: "Natural River", "Silt Content": "<4%", Application: "Plastering" }, bulkPricing: [{ minQty: 1, maxQty: 99, price: 65 }, { minQty: 100, maxQty: 499, price: 58 }, { minQty: 500, maxQty: null, price: 52 }], inStock: true, moq: 10, tags: ["river sand", "fine", "plastering", "masonry"], rafftarDiscount: 0 },
  { id: "p18", name: "M-Sand (Manufactured Sand)", image: "/placeholder.svg", category: "sand", price: 50, unit: "cu ft", supplierId: "s5", supplierName: "RiverSand Suppliers", rating: 4.3, reviewCount: 89, description: "Machine-crushed manufactured sand, eco-friendly alternative to river sand.", specifications: { Grade: "Zone II", Type: "Manufactured", "Silt Content": "<2%", Application: "Concrete" }, bulkPricing: [{ minQty: 1, maxQty: 99, price: 50 }, { minQty: 100, maxQty: 499, price: 45 }, { minQty: 500, maxQty: null, price: 41 }], inStock: true, moq: 10, tags: ["m-sand", "manufactured", "eco-friendly", "concrete"], rafftarDiscount: 0 },
  { id: "p19", name: "20mm Crushed Stone Aggregate", image: "/placeholder.svg", category: "sand", price: 38, unit: "cu ft", supplierId: "s5", supplierName: "RiverSand Suppliers", rating: 4.0, reviewCount: 42, description: "20mm nominal size crushed stone aggregate for concrete work.", specifications: { Size: "20mm", Type: "Crushed Stone", Shape: "Angular", Application: "Concrete" }, bulkPricing: [{ minQty: 1, maxQty: 99, price: 38 }, { minQty: 100, maxQty: 499, price: 34 }, { minQty: 500, maxQty: null, price: 30 }], inStock: true, moq: 10, tags: ["aggregate", "crushed stone", "20mm", "concrete"], rafftarDiscount: 0 },
  { id: "p20", name: "Coarse Sand for Concrete", image: "/placeholder.svg", category: "sand", price: 55, unit: "cu ft", supplierId: "s9", supplierName: "Concrete Kings", rating: 4.1, reviewCount: 33, description: "Coarse-grade sand ideal for concrete mixing and foundation work.", specifications: { Grade: "Zone I", Type: "Natural", "Silt Content": "<5%", Application: "Concrete" }, bulkPricing: [{ minQty: 1, maxQty: 99, price: 55 }, { minQty: 100, maxQty: 499, price: 50 }, { minQty: 500, maxQty: null, price: 46 }], inStock: true, moq: 10, tags: ["coarse sand", "concrete", "foundation"], rafftarDiscount: 0 },

  // Electrical
  { id: "p21", name: "Havells HRFR Cable 1.5 sq mm", image: "/placeholder.svg", category: "electrical", price: 18, unit: "meter", supplierId: "s6", supplierName: "VoltEdge Electricals", rating: 4.5, reviewCount: 145, description: "Heat-resistant flame-retardant single-core copper cable for house wiring.", specifications: { "Cross Section": "1.5 sq mm", Type: "HRFR", Conductor: "Copper", Voltage: "1100V" }, bulkPricing: [{ minQty: 1, maxQty: 499, price: 18 }, { minQty: 500, maxQty: 1999, price: 16.5 }, { minQty: 2000, maxQty: null, price: 15 }], inStock: true, moq: 90, tags: ["cable", "hrfr", "copper", "havells", "wiring"], rafftarDiscount: 5 },
  { id: "p22", name: "Anchor Modular Switch 6A", image: "/placeholder.svg", category: "electrical", price: 45, unit: "piece", supplierId: "s6", supplierName: "VoltEdge Electricals", rating: 4.3, reviewCount: 87, description: "Premium modular switch with silver alloy contacts for reliable switching.", specifications: { Rating: "6A/240V", Type: "1-Way", Module: "1M", Color: "White" }, bulkPricing: [{ minQty: 1, maxQty: 99, price: 45 }, { minQty: 100, maxQty: 499, price: 40 }, { minQty: 500, maxQty: null, price: 36 }], inStock: true, moq: 10, tags: ["switch", "modular", "anchor", "6a"], rafftarDiscount: 4 },
  { id: "p23", name: "MCB 32A Single Pole", image: "/placeholder.svg", category: "electrical", price: 185, unit: "piece", supplierId: "s6", supplierName: "VoltEdge Electricals", rating: 4.6, reviewCount: 62, description: "Miniature circuit breaker for overload and short-circuit protection.", specifications: { Rating: "32A", Poles: "Single", Type: "C-Curve", Breaking: "10kA" }, bulkPricing: [{ minQty: 1, maxQty: 49, price: 185 }, { minQty: 50, maxQty: 199, price: 170 }, { minQty: 200, maxQty: null, price: 155 }], inStock: true, moq: 5, tags: ["mcb", "circuit breaker", "32a", "protection"], rafftarDiscount: 5 },
  { id: "p24", name: "LED Panel Light 18W", image: "/placeholder.svg", category: "electrical", price: 320, unit: "piece", supplierId: "s8", supplierName: "MegaBuild Supplies", rating: 4.4, reviewCount: 108, description: "Slim round LED panel light with uniform illumination and energy efficiency.", specifications: { Wattage: "18W", Shape: "Round", Color: "Cool White", Size: "8 inch" }, bulkPricing: [{ minQty: 1, maxQty: 49, price: 320 }, { minQty: 50, maxQty: 199, price: 290 }, { minQty: 200, maxQty: null, price: 265 }], inStock: true, moq: 10, tags: ["led", "panel light", "18w", "energy efficient"], rafftarDiscount: 4 },

  // Plumbing
  { id: "p25", name: "CPVC Pipe 1 inch (3m)", image: "/placeholder.svg", category: "plumbing", price: 280, unit: "piece", supplierId: "s7", supplierName: "AquaFlow Plumbing", rating: 4.3, reviewCount: 76, description: "Chlorinated PVC pipe for hot and cold water supply systems.", specifications: { Size: "1 inch", Length: "3m", Pressure: "SDR 11", Standard: "IS 15778" }, bulkPricing: [{ minQty: 1, maxQty: 49, price: 280 }, { minQty: 50, maxQty: 199, price: 260 }, { minQty: 200, maxQty: null, price: 240 }], inStock: true, moq: 10, tags: ["cpvc", "pipe", "water supply", "hot water"], rafftarDiscount: 0 },
  { id: "p26", name: "PVC SWR Pipe 110mm (3m)", image: "/placeholder.svg", category: "plumbing", price: 450, unit: "piece", supplierId: "s7", supplierName: "AquaFlow Plumbing", rating: 4.2, reviewCount: 54, description: "Soil, waste, and rainwater PVC pipe for drainage systems.", specifications: { Size: "110mm", Length: "3m", Type: "SWR", Standard: "IS 13592" }, bulkPricing: [{ minQty: 1, maxQty: 49, price: 450 }, { minQty: 50, maxQty: 199, price: 415 }, { minQty: 200, maxQty: null, price: 385 }], inStock: true, moq: 10, tags: ["pvc", "swr", "drainage", "pipe"], rafftarDiscount: 0 },
  { id: "p27", name: "SS Kitchen Sink Double Bowl", image: "/placeholder.svg", category: "plumbing", price: 3200, unit: "piece", supplierId: "s7", supplierName: "AquaFlow Plumbing", rating: 4.5, reviewCount: 43, description: "304 grade stainless steel double bowl kitchen sink with satin finish.", specifications: { Size: "37x18x8 inch", Material: "SS 304", Bowls: "Double", Finish: "Satin" }, bulkPricing: [{ minQty: 1, maxQty: 9, price: 3200 }, { minQty: 10, maxQty: 49, price: 2950 }, { minQty: 50, maxQty: null, price: 2750 }], inStock: true, moq: 1, tags: ["sink", "stainless steel", "kitchen", "double bowl"], rafftarDiscount: 0 },
  { id: "p28", name: "Bathroom CP Faucet", image: "/placeholder.svg", category: "plumbing", price: 1450, unit: "piece", supplierId: "s8", supplierName: "MegaBuild Supplies", rating: 4.6, reviewCount: 87, description: "Chrome-plated brass bathroom faucet with ceramic disc cartridge.", specifications: { Material: "Brass", Finish: "Chrome", Type: "Pillar Cock", Cartridge: "Ceramic Disc" }, bulkPricing: [{ minQty: 1, maxQty: 9, price: 1450 }, { minQty: 10, maxQty: 49, price: 1320 }, { minQty: 50, maxQty: null, price: 1200 }], inStock: true, moq: 1, tags: ["faucet", "chrome", "brass", "bathroom"], rafftarDiscount: 4 },

  // Extra
  { id: "p29", name: "Waterproofing Compound 20L", image: "/placeholder.svg", category: "cement", price: 2800, unit: "bucket", supplierId: "s1", supplierName: "BuildRight Industries", rating: 4.4, reviewCount: 56, description: "Integral waterproofing compound for concrete and plaster. Prevents seepage and dampness.", specifications: { Volume: "20L", Type: "Integral", Coverage: "200 sq ft", Application: "Concrete/Plaster" }, bulkPricing: [{ minQty: 1, maxQty: 9, price: 2800 }, { minQty: 10, maxQty: 49, price: 2600 }, { minQty: 50, maxQty: null, price: 2400 }], inStock: true, moq: 2, tags: ["waterproofing", "seepage", "dampness"], rafftarDiscount: 3 },
  { id: "p30", name: "GI Wire Mesh 4x8 ft", image: "/placeholder.svg", category: "steel", price: 350, unit: "sheet", supplierId: "s2", supplierName: "SteelCore Trading Co.", rating: 4.1, reviewCount: 31, description: "Galvanized iron wire mesh for plastering reinforcement and fencing.", specifications: { Size: "4x8 ft", Mesh: "1 inch", Gauge: "20", Material: "GI" }, bulkPricing: [{ minQty: 1, maxQty: 49, price: 350 }, { minQty: 50, maxQty: 199, price: 320 }, { minQty: 200, maxQty: null, price: 295 }], inStock: true, moq: 5, tags: ["wire mesh", "gi", "plastering", "fencing"], rafftarDiscount: 3 },
];

// --- Search helpers ---

function fuzzyMatch(text: string, query: string): boolean {
  const t = text.toLowerCase();
  const q = query.toLowerCase();
  if (t.includes(q)) return true;
  // simple token match
  const tokens = q.split(/\s+/);
  return tokens.every((tok) => t.includes(tok));
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return products.filter(
    (p) =>
      fuzzyMatch(p.name, q) ||
      fuzzyMatch(p.category, q) ||
      fuzzyMatch(p.supplierName, q) ||
      fuzzyMatch(p.description, q) ||
      p.tags.some((t) => fuzzyMatch(t, q))
  );
}

export function searchSuppliers(query: string): Supplier[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  const matchedSupplierIds = new Set<string>();
  suppliers.forEach((s) => {
    if (
      fuzzyMatch(s.name, q) ||
      fuzzyMatch(s.location, q) ||
      fuzzyMatch(s.description, q) ||
      s.tags.some((t) => fuzzyMatch(t, q))
    ) {
      matchedSupplierIds.add(s.id);
    }
  });
  products.forEach((p) => {
    if (fuzzyMatch(p.name, q) || fuzzyMatch(p.category, q) || p.tags.some((t) => fuzzyMatch(t, q))) {
      matchedSupplierIds.add(p.supplierId);
    }
  });
  return suppliers.filter((s) => matchedSupplierIds.has(s.id));
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.category === categoryId);
}

export function getProductsBySupplier(supplierId: string): Product[] {
  return products.filter((p) => p.supplierId === supplierId);
}

export function getSupplierById(id: string): Supplier | undefined {
  return suppliers.find((s) => s.id === id);
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getPriceForQuantity(product: Product, quantity: number): number {
  const tier = [...product.bulkPricing].reverse().find((t) => quantity >= t.minQty);
  return tier ? tier.price : product.price;
}

export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.replace(new RegExp(`(${escaped})`, "gi"), "<mark>$1</mark>");
}
