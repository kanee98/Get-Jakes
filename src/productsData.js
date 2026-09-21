export const BANK_DETAILS = {
  bankName: "Artisanal Commerce Bank",
  accountName: "Velvet & Tier Props Studio LLC",
  accountNumber: "9876 5432 1098 4421",
  ifscCode: "ACTB0009841",
  swiftCode: "ACTBUS33XXX",
  branch: "5th Avenue Craft District, NY 10001",
  supportEmail: "payments@velvettierprops.com",
  phone: "+1 (800) 555-PROP"
};

export const PRODUCTS = [
  {
    id: "prop-01",
    name: "Aurelia 4-Tier Luxury Wedding Cake Dummy",
    category: "wedding",
    price: 389.00,
    originalPrice: 449.00,
    rating: 4.9,
    reviewsCount: 38,
    image: "/images/wedding_tier_prop.png",
    tag: "Bestseller",
    description: "Hand-finished 4-tier wedding dummy cake with durable faux fondant coating, pearl trim, and sugar rose replicas. Perfect for venue showcases and bakeries.",
    specs: {
      height: "28 inches (71 cm)",
      tiers: "4 Tiers (6\", 8\", 10\", 12\")",
      material: "High-Density EPS Foam + Polymer Fondant Coating",
      weight: "4.2 lbs (Lightweight & Portable)"
    }
  },
  {
    id: "prop-02",
    name: "Ophelia Gold Leaf Textured Statement Prop",
    category: "wedding",
    price: 279.00,
    rating: 5.0,
    reviewsCount: 24,
    image: "/images/hero_cake_prop.png",
    tag: "Handcrafted",
    description: "Minimalist 3-tier organic textured white cake with authentic 24k champagne gold leaf gilding. Reusable & washable.",
    specs: {
      height: "22 inches (56 cm)",
      tiers: "3 Tiers (6\", 8\", 10\")",
      material: "Ultra-Hard Resin Compound Core",
      weight: "3.8 lbs"
    }
  },
  {
    id: "prop-03",
    name: "Pastel Studio Food Photography Kit",
    category: "photography",
    price: 145.00,
    originalPrice: 175.00,
    rating: 4.8,
    reviewsCount: 52,
    image: "/images/photo_prop_set.png",
    tag: "Studio Special",
    description: "Set of 6 realistic faux cake slices, geometric acrylic blocks, and pastel dummy mini cakes. Engineered for studio light capture without melting.",
    specs: {
      pieces: "6-Piece Modular Props",
      material: "Matte Non-Reflective Foam & Polymer",
      washable: "100% Water Resistant",
      weight: "2.1 lbs"
    }
  },
  {
    id: "prop-04",
    name: "Imperial Fluted Pedestal Display Set",
    category: "pedestal",
    price: 215.00,
    rating: 4.9,
    reviewsCount: 19,
    image: "/images/pedestal_prop_set.png",
    tag: "Trending",
    description: "Pair of ribbed architectural cylinder pedestals in warm plaster white and vintage brushed brass. Engineered for weight capacities up to 60 lbs.",
    specs: {
      heights: "12\" and 18\" Elevated Risers",
      diameter: "10\" Top Surface",
      material: "Reinforced Fiber Composite",
      maxLoad: "60 lbs (27 kg)"
    }
  },
  {
    id: "prop-05",
    name: "Botanical Cascading Floral Dummy Cake",
    category: "wedding",
    price: 320.00,
    rating: 4.7,
    reviewsCount: 15,
    image: "/images/wedding_tier_prop.png",
    tag: "New",
    description: "3-tier romantic dummy cake pre-decorated with artificial cascading sugar eucalyptus and garden roses. Zero maintenance required.",
    specs: {
      height: "24 inches",
      tiers: "3 Tiers",
      material: "Polymer Coated Core + Silk Floral Trim",
      weight: "3.5 lbs"
    }
  },
  {
    id: "prop-06",
    name: "Commercial Bakery Window Display Dummy",
    category: "custom",
    price: 495.00,
    originalPrice: 550.00,
    rating: 5.0,
    reviewsCount: 29,
    image: "/images/hero_cake_prop.png",
    tag: "Commercial Grade",
    description: "5-Tier grand display dummy designed specifically for bakery shop windows. UV-resistant color protective coating to prevent yellowing in sunlight.",
    specs: {
      height: "36 inches",
      tiers: "5 Tiers (6\", 8\", 10\", 12\", 14\")",
      material: "UV-Shield Polymer Compound",
      weight: "7.0 lbs"
    }
  }
];

export const GALLERY_ITEMS = [
  {
    id: "g-01",
    title: "Grand Ballroom Wedding Showcase",
    client: "Chateau Luxe Events",
    category: "wedding",
    image: "/images/wedding_tier_prop.png",
    desc: "4-tier Aurelia prop utilized as a center table display for an 800-guest gala wedding in Chicago."
  },
  {
    id: "g-02",
    title: "Vogue Gourmet Magazine Shoot",
    client: "Studio 404 Photography",
    category: "photography",
    image: "/images/photo_prop_set.png",
    desc: "Pastel photography props featured in high-fashion editorial dessert lighting shoots."
  },
  {
    id: "g-03",
    title: "Luxury Bakery Window Installation",
    client: "Maison de Sucre, Paris",
    category: "commercial",
    image: "/images/hero_cake_prop.png",
    desc: "Custom UV-resistant multi-tier cake dummies displayed outdoors in summer sun with zero fading."
  },
  {
    id: "g-04",
    title: "Minimalist Pedestal Dessert Lounge",
    client: "Aura Event Styling",
    category: "pedestals",
    image: "/images/pedestal_prop_set.png",
    desc: "Fluted cylinder pedestals holding high-end luxury cakes at a celebrity birthday reception."
  }
];

export const INITIAL_CHAT_FAQS = [
  {
    q: "How do I make payment via Bank Transfer?",
    a: "Select your items and proceed to checkout. Choose 'Direct Bank Transfer' as your payment option. You will receive our bank details and a unique Order Reference ID (e.g., VT-9842-PAY). Transfer the amount using your banking app and submit your transaction reference number!"
  },
  {
    q: "Are the cake props waterproof and reusable?",
    a: "Yes! All Velvet & Tier props are coated with our signature hard-shell polymer fondant finish. They can be wiped down with a damp cloth, sanitized, and reused indefinitely."
  },
  {
    q: "Can I request custom heights or tier counts?",
    a: "Absolutely! You can use our interactive Custom Quote builder on the website or message us here with your dimensions (e.g. 6-tier, 40\" height) for an instant quotation."
  },
  {
    q: "What is the dispatch turnaround time?",
    a: "Standard in-stock props ship within 1-2 business days. Custom sculpted orders take 5-7 business days for handcrafted coating and curing."
  }
];
