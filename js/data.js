/**
 * ==========================================================================
 * LuxeStay Atithi Niwas - Core Data Models
 * Gram Panchayat Community Hospitality Project
 * ==========================================================================
 * 
 * CORE PROPERTY SPECIFICATION:
 * Exactly 5 cottages on this property.
 * All pricing is in Indian Rupees (₹).
 * 
 * Availability is now DYNAMICALLY calculated per date range based on
 * active booking records (using standard date-overlap verification).
 */

export const propertyInfo = {
  name: "FARM RESORT. AKILI",
  governingBody: "Gram Panchayat Tourism & Hospitality Committee",
  tagline: "Community-Managed 5-Cottage Hospitality Project",
  totalCottages: 5,
  currency: "₹",
  address: "Gram Panchayat Tourism Complex, Near Main Block Office, State Highway 14",
  district: "Sample District, Maharashtra (Demonstration Placeholder)",
  helpline: "+91 98220 XXXXX",
  officePhone: "+91 2140 XXXXX",
  email: "panchayat.stay@demo.gov.in",
  checkInTime: "12:00 PM (Noon)",
  checkOutTime: "11:00 AM",
  cancellationPolicy: "Advance cancellation notice of 48 hours required for full refund."
};

// ==========================================================================
// The 5 Cottages Data Model (No static permanent "Booked" lock)
// ==========================================================================
export const initialCottages = [
  {
    id: "cottage-1",
    number: 1,
    name: "Cottage 1 — Sahyadri Niwas",
    tagline: "Air-conditioned double cottage with front garden verandah",
    maxGuests: 3,
    bedInfo: "1 Queen Bed + 1 Single Diwan Bed",
    pricePerNight: 1800,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    facilities: [
      "Split Air Conditioner & Fan",
      "Attached Western Bathroom with Geyser",
      "Private Covered Verandah with Cane Chairs",
      "RO Drinking Water Dispenser Flask",
      "32-inch LED TV with DTH",
      "Daily Housekeeping"
    ],
    description: "Cottage 1 is located near the main entrance grove. Features cool stone flooring, quiet garden facing seating, and hot water supply 24/7."
  },
  {
    id: "cottage-2",
    number: 2,
    name: "Cottage 2 — Godavari Niwas",
    tagline: "Comfortable air-conditioned cottage overlooking flowering lawns",
    maxGuests: 3,
    bedInfo: "1 Queen Bed + 1 Single Diwan Bed",
    pricePerNight: 1800,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    facilities: [
      "Split Air Conditioner & Fan",
      "Attached Western Bathroom with Geyser",
      "Private Sit-Out Verandah",
      "RO Drinking Water Jug & Kettle",
      "Clean Bed Linen & Towels",
      "Wardrobe & Luggage Stand"
    ],
    description: "Cottage 2 offers peaceful natural ventilation and cross-breeze. Ideal for small families or official visitors."
  },
  {
    id: "cottage-3",
    number: 3,
    name: "Cottage 3 — Krishna Niwas (Family Unit)",
    tagline: "Spacious multi-bed family cottage with living area",
    maxGuests: 5,
    bedInfo: "2 Double Beds + Extra Rollaway Mattress",
    pricePerNight: 2400,
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
    facilities: [
      "2 Split Air Conditioners",
      "Large Attached Bathroom with Solar/Electric Geyser",
      "Spacious Living Hall with Sofa Seating",
      "Separate Dining Table",
      "RO Water & Electric Kettle",
      "Secure Wardrobe with Lock"
    ],
    description: "Our largest family cottage. Comfortably accommodates up to 5 family members or pilgrims traveling together."
  },
  {
    id: "cottage-4",
    number: 4,
    name: "Cottage 4 — Kaveri Niwas",
    tagline: "Standard non-AC eco cottage with natural stone cooling",
    maxGuests: 2,
    bedInfo: "1 Queen Bed",
    pricePerNight: 1400,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
    facilities: [
      "High-Speed Ceiling Fans & Mesh Windows",
      "Attached Bathroom with Hot Water Geyser",
      "Front Verandah Facing Orchard",
      "Purified Drinking Water",
      "Writing Desk & Chair",
      "Daily Sanitization"
    ],
    description: "Designed for budget-conscious solo travelers and couples. Built with high ceilings and shaded verandah to stay naturally cool."
  },
  {
    id: "cottage-5",
    number: 5,
    name: "Cottage 5 — Narmada Niwas (Executive Unit)",
    tagline: "Premium executive cottage with meeting desk and quiet corner setting",
    maxGuests: 4,
    bedInfo: "1 King Bed + 1 Queen Bed (Two Rooms)",
    pricePerNight: 2600,
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    facilities: [
      "Air Conditioning in Both Rooms",
      "Modern Attached Bathroom with Shower & Geyser",
      "Executive Meeting Table Seating 4",
      "Smart LED TV & High-Speed Wi-Fi",
      "Mini Refrigerator for Medicines/Water",
      "Private Covered Parking Space"
    ],
    description: "Specially appointed for visiting district officials, consultants, and executive guests needing a calm work environment."
  }
];

// ==========================================================================
// Seed Bookings with Exact Date Ranges for Overlap Testing
// ==========================================================================
export const initialBookingRequests = [
  {
    id: "BK-2026-101",
    createdAt: "2026-09-26 14:30",
    guestName: "Anil K. Shinde",
    phone: "9822198765",
    email: "anil.shinde@sample.com",
    cottageId: "cottage-2",
    cottageName: "Cottage 2 — Godavari Niwas",
    checkIn: "2026-10-01",
    checkOut: "2026-10-04",
    guestsCount: 2,
    cottageCount: 1,
    meals: "Breakfast + Dinner",
    specialRequest: "Late check-in expected around 8:00 PM due to bus arrival.",
    status: "Confirmed" // "Pending" | "Confirmed" | "Cancelled"
  },
  {
    id: "BK-2026-102",
    createdAt: "2026-09-27 09:15",
    guestName: "Dr. Meenakshi Joshi",
    phone: "9422054321",
    email: "dr.m.joshi@health-dept.demo",
    cottageId: "cottage-5",
    cottageName: "Cottage 5 — Narmada Niwas",
    checkIn: "2026-10-05",
    checkOut: "2026-10-08",
    guestsCount: 3,
    cottageCount: 1,
    meals: "All Meals (Bhojanalaya Full Board)",
    specialRequest: "Official visit for district health camp. Need quiet work desk.",
    status: "Confirmed"
  },
  {
    id: "BK-2026-103",
    createdAt: "2026-09-27 10:00",
    guestName: "Sunita & Arvind Sharma",
    phone: "9823011223",
    email: "sharma.family@sample.com",
    cottageId: "cottage-3",
    cottageName: "Cottage 3 — Krishna Niwas",
    checkIn: "2026-10-12",
    checkOut: "2026-10-15",
    guestsCount: 4,
    cottageCount: 1,
    meals: "Breakfast Only",
    specialRequest: "Need ground floor accessibility for elderly parents.",
    status: "Confirmed"
  }
];

// ==========================================================================
// Menu Data Models (Today & Tomorrow)
// ==========================================================================
export const initialMenuData = {
  today: {
    dayLabel: "Today's Menu",
    dateText: "Fresh Vegetarian Community Dining",
    breakfast: [
      "Kanda Poha with Sev, Fresh Coriander & Lemon",
      "Steamed Idli with Sambar & Coconut Chutney",
      "Freshly Brewed Ginger Tea / Filter Coffee"
    ],
    lunch: [
      "Fresh Wheat Chapatis / Jowar Bhakri (Unlimited)",
      "Maharashtrian Style Dal Tadka & Jeera Rice",
      "Seasonal Mixed Vegetable Sabzi (Aloo Matar Gobi)",
      "Cool Spiced Buttermilk (Chaas / Taas)",
      "Cucumber-Tomato Salad & Roasted Papad"
    ],
    snacks: [
      "Hot Batata Vada / Kanda Bhajji (Pakoda)",
      "Green Mint & Tamarind Chutneys",
      "Special Masala Chai"
    ],
    dinner: [
      "Hot Phulkas / Chapatis with Pure Ghee",
      "Paneer Bhurji / Sev Tamatar Curry",
      "Moong Dal Khichdi with Kadhi",
      "Hot Gulab Jamun (1 pc per thali)",
      "Pickle, Papad & Onion Salad"
    ]
  },
  tomorrow: {
    dayLabel: "Tomorrow's Menu",
    dateText: "Advance Dining Schedule (Pure Veg)",
    breakfast: [
      "Traditional Misal Pav with Sprouted Matki & Farsan",
      "Rava Upma with Roasted Peanuts",
      "Fresh Morning Tea / Coffee"
    ],
    lunch: [
      "Jowar Bhakri / Chapatis",
      "Authentic Pithla (Gram Flour Curry)",
      "Steamed White Rice with Waran & Ghee",
      "Dry Potato Sukka Bhaji",
      "Thecha (Spicy Green Chili Relish) & Fresh Buttermilk"
    ],
    snacks: [
      "Sabudana Khichdi with Roasted Peanut Powder",
      "Sweet Curd / Dahi",
      "Hot Cardamom Chai"
    ],
    dinner: [
      "Fresh Chapati / Soft Paratha",
      "Home-Style Rajma Masala & Steamed Basmati Rice",
      "Crisp Bhindi Masala (Okra)",
      "Traditional Rice Kheer with Almonds",
      "Papad, Pickle & Green Salad"
    ]
  }
};

export const propertyFacilities = [
  {
    id: "fac-water",
    title: "RO Purified Drinking Water",
    desc: "Commercial RO plant providing safe drinking water 24/7 on tap.",
    icon: "💧"
  },
  {
    id: "fac-canteen",
    title: "In-House Bhojanalaya",
    desc: "Hygienic vegetarian dining hall serving fresh breakfast, lunch, and dinner.",
    icon: "🍲"
  },
  {
    id: "fac-generator",
    title: "24/7 Generator Power Backup",
    desc: "Automatic diesel generator ensures lights, fans, and sockets always function.",
    icon: "⚡"
  },
  {
    id: "fac-parking",
    title: "Gated Vehicle Parking",
    desc: "Enclosed compound with space for two-wheelers, cars, and minibuses.",
    icon: "🚗"
  },
  {
    id: "fac-geyser",
    title: "Hot Water Geysers",
    desc: "Solar water heaters backed by individual electrical geysers in each cottage.",
    icon: "🚿"
  },
  {
    id: "fac-cctv",
    title: "CCTV Security & Caretaker",
    desc: "24/7 on-campus resident caretaker and perimeter security cameras.",
    icon: "🛡️"
  }
];

export const galleryItems = [
  {
    id: "g-1",
    title: "Cottage 1 & 2 Garden Frontage",
    category: "Campus View",
    thumb: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85",
    caption: "The landscaped lawn and paved pathways connecting the cottages."
  },
  {
    id: "g-2",
    title: "Clean Air-Conditioned Bedroom",
    category: "Interior",
    thumb: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85",
    caption: "Hygienic cotton bedding and ample ventilation inside Cottage 2."
  },
  {
    id: "g-3",
    title: "Community Bhojanalaya Dining Hall",
    category: "Dining",
    thumb: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85",
    caption: "Clean, spacious dining area where freshly cooked meals are served."
  },
  {
    id: "g-4",
    title: "Family Cottage 3 Living Area",
    category: "Cottages",
    thumb: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1600&q=85",
    caption: "Generous layout with space for extra bedding in Cottage 3."
  },
  {
    id: "g-5",
    title: "Clean Attached Western Bathrooms",
    category: "Sanitation",
    thumb: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80",
    full: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=85",
    caption: "Daily sanitized western toilets with 24-hour hot water geysers."
  }
];
