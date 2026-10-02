/**
 * ==========================================================================
 * Gram Swaraj Resorts & Banquets - Core Data Models
 * Chandiput GP Community Hospitality Project
 * ==========================================================================
 * 
 * CORE PROPERTY SPECIFICATION:
 * 4 accommodation cottages + 1 open-air pavilion + 1 function hall.
 * All pricing is in Indian Rupees (₹).
 * 
 * Availability is DYNAMICALLY calculated per date range based on
 * active booking records (using standard date-overlap verification).
 */

export const propertyInfo = {
  name: "Gram Swaraj Resorts & Banquets",
  governingBody: "Chandiput GP",
  tagline: "Community-Managed Hospitality Project",
  totalAccommodations: 5,
  currency: "₹",
  address: "Akili, NH 326-A, Block - Mohana, District - Gajapati",
  district: "District - Gajapati",
  helpline: "06816256550",
  officePhone: "06816256550",
  email: "chandiputgp2025@gmail.com",
  checkInTime: "12:00 PM (Noon)",
  checkOutTime: "11:00 AM",
  cancellationPolicy: "Advance cancellation notice of 48 hours required for full refund."
};

// ==========================================================================
// Accommodation Units (4 Cottages + 1 Open-Air Pavilion)
// type: 'cottage' for enclosed units, 'pavilion' for open-air unit
// ==========================================================================
export const initialCottages = [
  {
    id: "cottage-1",
    number: 1,
    type: "cottage",
    name: "Akili Cottage A1",
    tagline: "Air-conditioned double cottage with front garden verandah",
    maxGuests: 3,
    bedInfo: "1 Queen Bed + 1 Single Diwan Bed",
    pricePerNight: 1800,
    image: "a1.jpeg",
    facilities: [
      "Split Air Conditioner & Fan",
      "Attached Western Bathroom with Geyser",
      "Private Covered Verandah with Cane Chairs",
      "RO Drinking Water Dispenser Flask",
      "32-inch LED TV with DTH",
      "Daily Housekeeping"
    ],
    description: "Akili Cottage A1 is located near the main entrance grove. Features cool stone flooring, quiet garden facing seating, and hot water supply 24/7."
  },
  {
    id: "cottage-2",
    number: 2,
    type: "cottage",
    name: "Akili Cottage A2",
    tagline: "Comfortable air-conditioned cottage overlooking flowering lawns",
    maxGuests: 3,
    bedInfo: "1 Queen Bed + 1 Single Diwan Bed",
    pricePerNight: 1800,
    image: "a1.jpeg",
    facilities: [
      "Split Air Conditioner & Fan",
      "Attached Western Bathroom with Geyser",
      "Private Sit-Out Verandah",
      "RO Drinking Water Jug & Kettle",
      "Clean Bed Linen & Towels",
      "Wardrobe & Luggage Stand"
    ],
    description: "Akili Cottage A2 offers peaceful natural ventilation and cross-breeze. Ideal for small families or official visitors."
  },
  {
    id: "cottage-3",
    number: 3,
    type: "cottage",
    name: "Akili Cottage A3",
    tagline: "Spacious multi-bed family cottage with living area",
    maxGuests: 5,
    bedInfo: "2 Double Beds + Extra Rollaway Mattress",
    pricePerNight: 2400,
    image: "a1.jpeg",
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
    type: "cottage",
    name: "Akili Cottage A4",
    tagline: "Standard non-AC eco cottage with natural stone cooling",
    maxGuests: 2,
    bedInfo: "1 Queen Bed",
    pricePerNight: 1400,
    image: "a1.jpeg",
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
    type: "pavilion",
    name: "Open-Air Pavilion",
    tagline: "Premium open-air pavilion with meeting desk and quiet corner setting",
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
    description: "An open-air pavilion accommodation specially appointed for visiting district officials, consultants, and executive guests needing a calm work environment."
  }
];

// ==========================================================================
// Function Hall Data Model
// type: 'hall' — booked per day (not per night)
// ==========================================================================
export const initialHalls = [
  {
    id: "hall-1",
    number: 1,
    type: "hall",
    name: "Suva Mandap (Function Hall), Chandiput",
    tagline: "2,000 sq ft function hall in Chandiput for events, ceremonies, and gatherings",
    maxGuests: 200,
    area: "2,000 sq ft",
    pricePerDay: 5000,
    image: "suva mandap.jpeg",
   facilities: [
  "Spacious and Elegant Hall",
  "Engagements & Marriage Functions",
  "Birthday Parties",
  "Cultural Events",
  "Community Events",
  "Toilets",
  "Lamps & Lighting",
  "Dining Area",
  "Spacious Parking",
  "Clean & Comfortable Environment"
],
description: "Suva Mandap is a spacious and comfortable 2,000 sq ft function hall in Chandiput, suitable for engagements, marriage functions, birthday parties, cultural events, community events, and other gatherings."                                                                                                            
   
  }
];

// ==========================================================================
// Seed Bookings with Exact Date Ranges for Overlap Testing
// ==========================================================================
export const initialBookingRequests = [
  {
    id: "BK-2026-101",
    createdAt: "2026-09-26 14:30",
    bookingType: "accommodation",
    guestName: "Anil K. Shinde",
    guestAge: 42,
    phone: "9822198765",
    altPhone: "9822012345",
    address: "123 Main Road, Pune, Maharashtra 411001",
    email: "anil.shinde@sample.com",
    otherGuests: [
      { name: "Sunita Shinde", age: 38 }
    ],
    cottageId: "cottage-2",
    cottageName: "Akili Cottage A2",
    checkIn: "2026-10-01",
    checkOut: "2026-10-04",
    guestsCount: 2,
    cottageCount: 1,
    meals: "Breakfast + Dinner",
    specialRequest: "Late check-in expected around 8:00 PM due to bus arrival.",
    status: "Confirmed",
    payment: {
      totalAmount: 5400,
      advanceAmount: 2000,
      remainingAmount: 3400,
      status: "Advance Paid (Demo)",
      method: "UPI (Demo Integration)",
      referenceId: "DEMO-UPI-101001"
    }
  },
  {
    id: "BK-2026-102",
    createdAt: "2026-09-27 09:15",
    bookingType: "accommodation",
    guestName: "Dr. Meenakshi Joshi",
    guestAge: 35,
    phone: "9422054321",
    altPhone: "9422087654",
    address: "45 Health Quarters, Mumbai, Maharashtra 400001",
    email: "dr.m.joshi@health-dept.demo",
    otherGuests: [
      { name: "Dr. Rajesh Joshi", age: 37 },
      { name: "Priya Joshi", age: 8 }
    ],
    cottageId: "cottage-5",
    cottageName: "Open-Air Pavilion",
    checkIn: "2026-10-05",
    checkOut: "2026-10-08",
    guestsCount: 3,
    cottageCount: 1,
    meals: "All Meals (Bhojanalaya Full Board)",
    specialRequest: "Official visit for district health camp. Need quiet work desk.",
    status: "Confirmed",
    payment: {
      totalAmount: 7800,
      advanceAmount: 3000,
      remainingAmount: 4800,
      status: "Advance Paid (Demo)",
      method: "UPI (Demo Integration)",
      referenceId: "DEMO-UPI-102002"
    }
  },
  {
    id: "BK-2026-103",
    createdAt: "2026-09-27 10:00",
    bookingType: "accommodation",
    guestName: "Sunita & Arvind Sharma",
    guestAge: 45,
    phone: "9823011223",
    altPhone: "9823044556",
    address: "78 Station Road, Nashik, Maharashtra 422001",
    email: "sharma.family@sample.com",
    otherGuests: [
      { name: "Arvind Sharma", age: 47 },
      { name: "Rohit Sharma", age: 12 },
      { name: "Anita Sharma", age: 70 }
    ],
    cottageId: "cottage-3",
    cottageName: "Akili Cottage A3",
    checkIn: "2026-10-12",
    checkOut: "2026-10-15",
    guestsCount: 4,
    cottageCount: 1,
    meals: "Breakfast Only",
    specialRequest: "Need ground floor accessibility for elderly parents.",
    status: "Confirmed",
    payment: {
      totalAmount: 7200,
      advanceAmount: 2000,
      remainingAmount: 5200,
      status: "Advance Paid (Demo)",
      method: "Card (Demo Integration)",
      referenceId: "DEMO-CARD-103003"
    }
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
    title: "Akili Cottage A1 & A2 Garden Frontage",
    category: "Campus View",
    thumb: "a1-a2-garden.jpg",
full: "a1-a2-garden.jpg",
    caption: "The landscaped lawn and paved pathways connecting the cottages."
  },
  {
    id: "g-2",
    title: "Clean Air-Conditioned Bedroom",
    category: "Interior",
   thumb: "clean-ac-bedroom.jpg",
full: "clean-ac-bedroom.jpg",
    caption: "Hygienic cotton bedding and ample ventilation inside Akili Cottage A2."
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
    title: "Family Cottage A3 Living Area",
    category: "Cottages",
    thumb: "a3-living-area.jpg",
full: "a3-living-area.jpg",
    caption: "Generous layout with space for extra bedding in Akili Cottage A3."
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
