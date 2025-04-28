// Mock data for the application

export const clubsData = [
  {
    id: "1",
    name: "Fitness First",
    phone: "+84 123 456 789",
    owner_id: "78574593-757c-49bc-aad1-3a8dd5c03970",
    description: "A premium fitness club with state-of-the-art equipment and professional trainers.",
    created_at: "2023-12-19T00:00:00Z",
    updated_at: "2023-12-19T00:00:00Z",
    address: {
      id: "101",
      address: "123 Main Street, District 1, Ho Chi Minh City",
      ward_id: "w101",
      location_geography: {
        longitude: 106.6297,
        latitude: 10.8231
      }
    },
    media: [
      {
        id: "m101",
        file_path: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
        file_type: "image/jpeg",
        hash: "hash1"
      }
    ],
    sport_types: [
      {
        id: "st101",
        name: "Fitness",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      },
      {
        id: "st102",
        name: "Yoga",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    ]
  },
  {
    id: "2",
    name: "Tennis Club Saigon",
    phone: "+84 987 654 321",
    owner_id: "78574593-757c-49bc-aad1-3a8dd5c03970",
    description: "Professional tennis courts with coaching services for all levels.",
    created_at: "2023-11-08T00:00:00Z",
    updated_at: "2023-11-08T00:00:00Z",
    address: {
      id: "102",
      address: "456 Park Avenue, District 2, Ho Chi Minh City",
      ward_id: "w102",
      location_geography: {
        longitude: 106.7513,
        latitude: 10.7769
      }
    },
    media: [
      {
        id: "m102",
        file_path: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0",
        file_type: "image/jpeg",
        hash: "hash2"
      }
    ],
    sport_types: [
      {
        id: "st103",
        name: "Tennis",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    ]
  },
  {
    id: "3",
    name: "Aqua Swimming Center",
    phone: "+84 909 123 456",
    owner_id: "78574593-757c-49bc-aad1-3a8dd5c03970",
    description: "Olympic-sized swimming pool with professional coaching for all ages.",
    created_at: "2023-11-01T00:00:00Z",
    updated_at: "2023-11-01T00:00:00Z",
    address: {
      id: "103",
      address: "789 Water Street, District 7, Ho Chi Minh City",
      ward_id: "w103",
      location_geography: {
        longitude: 106.7018,
        latitude: 10.7284
      }
    },
    media: [
      {
        id: "m103",
        file_path: "https://images.unsplash.com/photo-1575429198097-0414ec08e8cd",
        file_type: "image/jpeg",
        hash: "hash3"
      }
    ],
    sport_types: [
      {
        id: "st104",
        name: "Swimming",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    ]
  },
  {
    id: "4",
    name: "Saigon Basketball Club",
    phone: "+84 918 765 432",
    owner_id: "78574593-757c-49bc-aad1-3a8dd5c03970",
    description: "Indoor basketball courts with leagues and training programs.",
    created_at: "2023-03-06T00:00:00Z",
    updated_at: "2023-03-06T00:00:00Z",
    address: {
      id: "104",
      address: "101 Sports Avenue, District 3, Ho Chi Minh City",
      ward_id: "w104",
      location_geography: {
        longitude: 106.6822,
        latitude: 10.7731
      }
    },
    media: [
      {
        id: "m104",
        file_path: "https://images.unsplash.com/photo-1546519638-68e109acd27d",
        file_type: "image/jpeg",
        hash: "hash4"
      }
    ],
    sport_types: [
      {
        id: "st105",
        name: "Basketball",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    ]
  },
  {
    id: "5",
    name: "Martial Arts Dojo",
    phone: "+84 901 234 567",
    owner_id: "78574593-757c-49bc-aad1-3a8dd5c03970",
    description: "Traditional martial arts training center with experienced instructors.",
    created_at: "2023-02-18T00:00:00Z",
    updated_at: "2023-02-18T00:00:00Z",
    address: {
      id: "105",
      address: "202 Dragon Street, District 5, Ho Chi Minh City",
      ward_id: "w105",
      location_geography: {
        longitude: 106.6633,
        latitude: 10.7539
      }
    },
    media: [
      {
        id: "m105",
        file_path: "https://images.unsplash.com/photo-1555597673-b21d5c935865",
        file_type: "image/jpeg",
        hash: "hash5"
      }
    ],
    sport_types: [
      {
        id: "st106",
        name: "Karate",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      },
      {
        id: "st107",
        name: "Judo",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    ]
  }
];

export const usersData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    type: "product",
    dateAdded: "Dec 19, 2023",
    role: "Admin",
    status: "Active",
    lastLogin: "2 hours ago",
  },
  {
    id: 2,
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    type: "website",
    dateAdded: "Nov 8, 2023",
    role: "User",
    status: "Active",
    lastLogin: "1 day ago",
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael.brown@example.com",
    type: "icon",
    dateAdded: "Nov 1, 2023",
    role: "Manager",
    status: "Inactive",
    lastLogin: "5 days ago",
  },
  {
    id: 4,
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    type: "ecommerce",
    dateAdded: "Mar 6, 2023",
    role: "User",
    status: "Active",
    lastLogin: "3 hours ago",
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@example.com",
    type: "wireframing",
    dateAdded: "Feb 18, 2023",
    role: "User",
    status: "Active",
    lastLogin: "1 week ago",
  },
];



export const overviewStats = {
  clients: {
    count: "50k",
    change: {
      value: "10k",
      positive: true,
    },
  },
  clubs: {
    count: "10",
    change: {
      value: "5",
      positive: false,
    },
  },
  lastUpdated: "1 hour ago",
};

export const analyzeStats = {
  pendingOrders: {
    count: 10,
    label: "Total Pending Orders",
    today: "Today",
  },
  bestSellingProduct: {
    percentage: 71,
    label: "Best Selling Product sales Contribution",
  },
  rating: {
    value: 1.3,
    label: "Your Rating",
  },
  newProductCreation: {
    count: 1549,
    label: "New Product Creation",
  },
  salesSummary: {
    value: "3K",
    change: {
      value: "2.1%",
      positive: false,
      label: "vs Last Week",
    },
  },
  orderVolume: {
    value: "5.51K",
    change: {
      value: "2.1%",
      positive: true,
      label: "vs Last Week",
    },
  },
};

export const salesChartData = [
  { day: "Mon", thisWeek: 20, lastWeek: 30 },
  { day: "Tue", thisWeek: 30, lastWeek: 20 },
  { day: "Wed", thisWeek: 25, lastWeek: 40 },
  { day: "Thu", thisWeek: 40, lastWeek: 25 },
  { day: "Fri", thisWeek: 35, lastWeek: 30 },
  { day: "Sat", thisWeek: 45, lastWeek: 35 },
  { day: "Sun", thisWeek: 30, lastWeek: 40 },
];

export const orderVolumeData = [
  { day: "Mon", thisWeek: 400, lastWeek: 300 },
  { day: "Tue", thisWeek: 300, lastWeek: 400 },
  { day: "Wed", thisWeek: 500, lastWeek: 350 },
  { day: "Thu", thisWeek: 350, lastWeek: 450 },
  { day: "Fri", thisWeek: 450, lastWeek: 400 },
  { day: "Sat", thisWeek: 400, lastWeek: 350 },
  { day: "Sun", thisWeek: 550, lastWeek: 500 },
];

export const promotions = [
  {
    id: 1,
    title: "Lifestyle: 3.3 PAYDAY 2022",
    discount: "15% off min spend SGD 100 HOME123",
    endDate: "28 Feb - 07 Mar 22",
    details: [
      { label: "Voucher discount", value: "10%" },
      { label: "Registration until", value: "27 Feb 22" },
      { label: "Seller funded portion", value: "100%" },
      { label: "out of the discount", value: "" },
    ],
    stats: {
      sellers: 0,
      products: 0,
    },
    timeRemaining: {
      hours: "05",
      minutes: "16",
      seconds: "21",
    },
  },
  {
    id: 2,
    title: "Lifestyle: 3.3 PAYDAY 2022",
    discount: "15% off min spend SGD 100 HOME123",
    endDate: "28 Feb - 07 Mar 22",
    details: [
      { label: "Voucher discount", value: "10%" },
      { label: "Registration until", value: "27 Feb 22" },
      { label: "Seller funded portion", value: "100%" },
      { label: "out of the discount", value: "" },
    ],
    stats: {
      sellers: 0,
      products: 0,
    },
    timeRemaining: {
      hours: "17",
      minutes: "21",
      seconds: "47",
    },
  },
];

export const announcements = [
  {
    id: 1,
    title: "Zelora: Seller Communication Prioritization",
    date: "2023-06-15",
  },
  {
    id: 2,
    title: "New Feature: Enhanced Analytics Dashboard",
    date: "2023-06-10",
  },
  {
    id: 3,
    title: "System Maintenance: Scheduled Downtime",
    date: "2023-06-05",
  },
];
