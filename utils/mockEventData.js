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
