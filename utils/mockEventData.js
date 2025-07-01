// utils/mockEventData.js
export const mockSessions = [
  {
    id: "session_1",
    name: "Opening Ceremony",
    date: "2024-07-22",
    start_time: "09:00",
    end_time: "10:30",
    description: "Welcome and introduction",
    location: "Main Hall",
    is_attendance_required: true,
  },
  {
    id: "session_2",
    name: "Lunch Break",
    date: "2024-07-22",
    start_time: "12:00",
    end_time: "13:00",
    description: "Networking lunch",
    location: "Restaurant Area",
    is_attendance_required: false,
  },
  {
    id: "session_3",
    name: "Closing Remarks",
    date: "2024-07-23",
    start_time: "16:00",
    end_time: "17:00",
    description: "Final thoughts and next steps",
    location: "Main Hall",
    is_attendance_required: true,
  },
];

export const mockRegistrationForms = [
  {
    id: "form_1",
    name: "General Registration",
    description: "Please fill out this form to complete your registration",
    is_required: true,
    fields: [
      {
        id: "field_1",
        type: "text",
        label: "Dietary Requirements",
        placeholder: "Any food allergies or preferences?",
        required: false,
        options: [],
        validation: { min_length: null, max_length: 200, pattern: null },
      },
      {
        id: "field_2",
        type: "select",
        label: "T-Shirt Size",
        placeholder: "Select your size",
        required: true,
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        validation: {},
      },
      {
        id: "field_3",
        type: "checkbox",
        label: "I agree to receive event updates",
        required: false,
        options: [],
        validation: {},
      },
    ],
  },
];

export const mockTickets = [
  {
    id: "ticket_1",
    name: "Early Bird",
    description: "Limited time offer with 20% discount",
    price: 80,
    currency: "USD",
    quantity_available: 100,
    quantity_sold: 45,
    is_available: true,
    sale_start_date: "2024-06-01",
    sale_end_date: "2024-07-01",
    features: ["Full access", "Welcome kit", "Lunch included"],
    form_id: "form_1",
  },
  {
    id: "ticket_2",
    name: "VIP Pass",
    description: "Premium experience with exclusive benefits",
    price: 150,
    currency: "USD",
    quantity_available: 50,
    quantity_sold: 20,
    is_available: true,
    sale_start_date: "2024-06-01",
    sale_end_date: "2024-07-20",
    features: [
      "Premium seating",
      "VIP lounge access",
      "Meet & greet",
      "Gift bag",
    ],
    form_id: null,
  },
];

export const mockVendors = [
  {
    id: "vendor_1",
    name: "Catering Plus",
    service_type: "catering",
    contact_person: "Jane Smith",
    phone: "+1234567890",
    email: "jane@cateringplus.com",
    description: "Premium catering services for events",
    website: "https://cateringplus.com",
    is_public: true,
  },
  {
    id: "vendor_2",
    name: "Sound & Vision",
    service_type: "av_equipment",
    contact_person: "Mike Johnson",
    phone: "+1234567891",
    email: "mike@soundvision.com",
    description: "Audio visual equipment rental and setup",
    website: "https://soundvision.com",
    is_public: true,
  },
];

export const mockProgram = {
  enabled: true,
  is_public: true,
  schedule: [
    {
      id: "program_day_1",
      date: "2024-07-22",
      items: [
        {
          id: "item_1",
          start_time: "09:00",
          end_time: "10:30",
          title: "Opening Ceremony",
          description: "Welcome address and keynote presentation",
          location: "Main Hall",
          speakers: ["speaker_1"],
          session_id: "session_1",
        },
        {
          id: "item_2",
          start_time: "11:00",
          end_time: "12:00",
          title: "Panel Discussion",
          description: "Industry trends and future outlook",
          location: "Conference Room A",
          speakers: ["speaker_2", "speaker_3"],
          session_id: null,
        },
      ],
    },
  ],
  speakers: [
    {
      id: "speaker_1",
      name: "Dr. Sarah Johnson",
      title: "Keynote Speaker",
      bio: "Renowned expert in technology innovation",
      image: "",
      company: "Innovation Labs",
    },
    {
      id: "speaker_2",
      name: "Mark Wilson",
      title: "Industry Expert",
      bio: "20+ years experience in digital transformation",
      image: "",
      company: "Tech Solutions Inc",
    },
  ],
};

export const mockStakeholders = {
  hosts: [
    {
      id: "host_1",
      name: "John Doe",
      title: "Event Director",
      bio: "Experienced event organizer with 15+ years in the industry",
      image: "",
      social_links: {
        linkedin: "https://linkedin.com/in/johndoe",
        twitter: "https://twitter.com/johndoe",
        website: "https://johndoe.com",
      },
    },
  ],
  sponsors: [
    {
      id: "sponsor_1",
      name: "TechCorp Inc",
      logo: "",
      website: "https://techcorp.com",
      tier: "platinum",
      description: "Leading technology company sponsoring innovation",
    },
    {
      id: "sponsor_2",
      name: "StartupHub",
      logo: "",
      website: "https://startuphub.com",
      tier: "gold",
      description: "Supporting the next generation of entrepreneurs",
    },
  ],
  partners: [
    {
      id: "partner_1",
      name: "Media Partners Ltd",
      logo: "",
      website: "https://mediapartners.com",
      type: "media_partner",
    },
  ],
};

export const mockResources = [
  {
    id: "resource_1",
    name: "Event Program",
    description: "Detailed schedule and speaker information",
    file_url: "",
    file_type: "pdf",
    is_public: true,
    download_count: 0,
  },
  {
    id: "resource_2",
    name: "Venue Map",
    description: "Interactive map of the event venue",
    file_url: "",
    file_type: "pdf",
    is_public: true,
    download_count: 0,
  },
];

// Enhanced mock data generator for public event website sections
// This ensures all sections display content even when real data is missing

export const generateMockEventData = (existingEvent) => {
  // Return enhanced event object with mock data for missing sections
  const mockData = {
    ...existingEvent,
    
    // Mock Program/Schedule data
    program: existingEvent.program?.schedule?.length > 0 ? existingEvent.program : {
      enabled: true,
      is_public: true,
      schedule: [
        {
          title: "Welcome & Registration",
          description: "Check-in and networking with refreshments",
          date: existingEvent.date,
          start_time: "08:00",
          end_time: "09:00",
          location: "Main Lobby",
          session_type: "Registration",
          is_public: true,
          speaker: {
            name: "Event Team",
            title: "Organizers"
          },
          tags: ["networking", "check-in"]
        },
        {
          title: "Opening Ceremony",
          description: "Welcome address and event overview",
          date: existingEvent.date,
          start_time: "09:00",
          end_time: "09:30",
          location: "Main Hall",
          session_type: "Ceremony",
          is_public: true,
          speaker: {
            name: existingEvent.host || "Event Host",
            title: "Host"
          },
          tags: ["opening", "welcome"]
        },
        {
          title: "Main Program",
          description: "Core event activities and presentations",
          date: existingEvent.date,
          start_time: "09:30",
          end_time: "12:00",
          location: "Main Hall",
          session_type: "Main Event",
          is_public: true,
          speaker: {
            name: "Featured Speakers",
            title: "Presenters"
          },
          tags: ["main-event", "presentations"]
        },
        {
          title: "Networking Lunch",
          description: "Lunch break with networking opportunities",
          date: existingEvent.date,
          start_time: "12:00",
          end_time: "13:30",
          location: "Dining Area",
          session_type: "Break",
          is_public: true,
          tags: ["lunch", "networking"]
        },
        {
          title: "Closing Remarks",
          description: "Thank you message and event wrap-up",
          date: existingEvent.date,
          start_time: "16:30",
          end_time: "17:00",
          location: "Main Hall",
          session_type: "Ceremony",
          is_public: true,
          speaker: {
            name: existingEvent.host || "Event Host",
            title: "Host"
          },
          tags: ["closing", "thanks"]
        }
      ]
    },

    // Mock Speakers data
    speakers: existingEvent.speakers?.length > 0 ? existingEvent.speakers : [
      {
        name: "Dr. Sarah Johnson",
        designation: "Keynote Speaker",
        bio: "Renowned expert with 15+ years of experience",
        image: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: "Michael Chen",
        designation: "Industry Expert", 
        bio: "Leading professional in the field",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
      },
      {
        name: "Emily Rodriguez",
        designation: "Special Guest",
        bio: "Award-winning specialist and thought leader",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
      }
    ],

    // Mock Resources data
    resources: existingEvent.resources?.length > 0 ? existingEvent.resources : [
      {
        name: "Event Program Guide",
        description: "Complete schedule and speaker information",
        type: "document",
        category: "Program",
        url: "#",
        visibility: "public"
      },
      {
        name: "Venue Map",
        description: "Detailed layout of the event location",
        type: "image",
        category: "Location",
        url: "#",
        visibility: "public"
      },
      {
        name: "Welcome Video",
        description: "Special message from the event organizers",
        type: "video",
        category: "Welcome",
        url: "#",
        visibility: "public"
      },
      {
        name: "Networking Guide",
        description: "Tips for making the most of networking opportunities",
        type: "document",
        category: "Networking",
        url: "#",
        visibility: "public"
      },
      {
        name: "Event Highlights",
        description: "Key moments and important information",
        type: "link",
        category: "Highlights",
        url: "#",
        visibility: "public"
      },
      {
        name: "Contact Information",
        description: "Emergency contacts and support details",
        type: "document",
        category: "Support",
        url: "#",
        visibility: "public"
      }
    ],

    // Mock Vendors data
    vendors: existingEvent.vendors?.length > 0 ? existingEvent.vendors : [
      {
        company: "Premium Catering Co.",
        service_type: "Catering",
        contact_person: "Chef Maria Lopez",
        status: "confirmed",
        website: "#",
        services_provided: ["Gourmet Dining", "Special Dietary Options", "Event Service"]
      },
      {
        company: "SoundWave Audio",
        service_type: "Audio/Visual",
        contact_person: "Tech Director James Wilson",
        status: "confirmed",
        website: "#",
        services_provided: ["Sound System", "Microphones", "Visual Equipment"]
      },
      {
        company: "Elegant Decor Solutions",
        service_type: "Decoration",
        contact_person: "Design Lead Anna Kim",
        status: "confirmed",
        website: "#",
        services_provided: ["Floral Arrangements", "Lighting", "Table Settings"]
      },
      {
        company: "Swift Transportation",
        service_type: "Logistics",
        contact_person: "Operations Manager Tom Davis",
        status: "confirmed",
        website: "#",
        services_provided: ["Guest Transport", "Equipment Moving", "Parking Management"]
      },
      {
        company: "Moment Photography",
        service_type: "Photography",
        contact_person: "Lead Photographer Lisa Chang",
        status: "confirmed",
        website: "#",
        services_provided: ["Event Coverage", "Portrait Sessions", "Digital Gallery"]
      },
      {
        company: "Secure Events Inc.",
        service_type: "Security",
        contact_person: "Security Chief Robert Martinez",
        status: "confirmed",
        website: "#",
        services_provided: ["Venue Security", "Crowd Control", "VIP Protection"]
      }
    ],

    // Mock Stakeholders data
    stakeholders: existingEvent.stakeholders?.length > 0 ? existingEvent.stakeholders : [
      {
        name: "Alexandra Thompson",
        title: "Event Director",
        organization: "Smart Events Group",
        role: "organizer",
        status: "active",
        expertise_areas: ["Event Management", "Logistics"]
      },
      {
        name: "David Park",
        title: "Marketing Lead",
        organization: "Brand Solutions Inc.",
        role: "sponsor",
        status: "active",
        expertise_areas: ["Digital Marketing", "Brand Strategy"]
      },
      {
        name: "Dr. Rachel Green",
        title: "Industry Consultant",
        organization: "Expert Advisory Group",
        role: "speaker",
        status: "active",
        expertise_areas: ["Industry Trends", "Best Practices"]
      },
      {
        name: "Mark Stevens",
        title: "Technology Partner",
        organization: "Tech Innovations Ltd.",
        role: "sponsor",
        status: "active",
        expertise_areas: ["Technology", "Innovation"]
      },
      {
        name: "Jennifer Walsh",
        title: "Community Relations",
        organization: "Local Community Board",
        role: "organizer",
        status: "active",
        expertise_areas: ["Community Outreach", "Public Relations"]
      },
      {
        name: "Carlos Rodriguez",
        title: "Financial Advisor",
        organization: "Finance Experts Group",
        role: "speaker",
        status: "active",
        expertise_areas: ["Financial Planning", "Investment Strategy"]
      },
      {
        name: "Nicole Foster",
        title: "Operations Manager",
        organization: "Event Operations Co.",
        role: "organizer",
        status: "active",
        expertise_areas: ["Operations", "Vendor Management"]
      },
      {
        name: "Brian Cooper",
        title: "Strategic Partner",
        organization: "Partnership Solutions",
        role: "sponsor",
        status: "active",
        expertise_areas: ["Strategic Planning", "Business Development"]
      }
    ],

    // Enhance gallery with more images if it's sparse
    gallery: existingEvent.gallery?.length >= 6 ? existingEvent.gallery : [
      ...(existingEvent.gallery || []),
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1497911270199-1c552ee64aa4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop"
    ].slice(0, 8), // Limit to 8 images max

    // Enhanced gift registry if minimal
    items: existingEvent.items?.length >= 3 ? existingEvent.items : [
      ...(existingEvent.items || []),
      {
        name: "Premium Gift Set",
        link: "#"
      },
      {
        name: "Experience Package", 
        link: "#"
      },
      {
        name: "Commemorative Collection",
        link: "#"
      }
    ].slice(0, 6), // Limit to 6 items max

    // Enhanced sponsors and partners data
    sponsors: existingEvent.sponsors?.length > 0 ? existingEvent.sponsors : [
      {
        name: "TechCorp Solutions",
        website: "#",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop"
      },
      {
        name: "Innovation Partners",
        website: "#",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop"
      }
    ],

    partners: existingEvent.partners?.length > 0 ? existingEvent.partners : [
      {
        name: "Strategic Alliance Group",
        website: "#",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop"
      },
      {
        name: "Community Partners Network",
        website: "#",
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200&h=100&fit=crop"
      }
    ],

    hosts: existingEvent.hosts?.length > 0 ? existingEvent.hosts : [
      {
        name: existingEvent.host || "Event Host",
        title: "Lead Organizer",
        bio: "Passionate about creating memorable experiences and bringing people together.",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
      }
    ]
  };

  return mockData;
};

// Utility function to check if an event section should show mock data
export const shouldUseMockData = (eventData, sectionName) => {
  switch (sectionName) {
    case 'program':
      return !eventData.program?.schedule?.length;
    case 'speakers':
      return !eventData.speakers?.length;
    case 'resources':
      return !eventData.resources?.length;
    case 'vendors':
      return !eventData.vendors?.length;
    case 'stakeholders':
      return !eventData.stakeholders?.length;
    case 'gallery':
      return !eventData.gallery?.length || eventData.gallery.length < 3;
    case 'sponsors':
      return !eventData.sponsors?.length;
    case 'partners':
      return !eventData.partners?.length;
    case 'hosts':
      return !eventData.hosts?.length;
    default:
      return false;
  }
};
