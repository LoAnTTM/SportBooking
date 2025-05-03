// Mock data for booking statistics

// Daily booking stats
export const mockDailyBookingStats = [
  {
    unitId: '1',
    unitName: 'Tennis Court A',
    bookings: [
      { date: '2023-10-01', count: 5 },
      { date: '2023-10-02', count: 7 },
      { date: '2023-10-03', count: 4 },
      { date: '2023-10-04', count: 8 },
      { date: '2023-10-05', count: 6 },
      { date: '2023-10-06', count: 9 },
      { date: '2023-10-07', count: 12 },
    ]
  },
  {
    unitId: '2',
    unitName: 'Basketball Court',
    bookings: [
      { date: '2023-10-01', count: 3 },
      { date: '2023-10-02', count: 5 },
      { date: '2023-10-03', count: 7 },
      { date: '2023-10-04', count: 4 },
      { date: '2023-10-05', count: 8 },
      { date: '2023-10-06', count: 6 },
      { date: '2023-10-07', count: 10 },
    ]
  }
];

// Weekly booking stats
export const mockWeeklyBookingStats = [
  {
    unitId: '1',
    unitName: 'Tennis Court A',
    bookings: [
      { week: 'Week 1', count: 32 },
      { week: 'Week 2', count: 28 },
      { week: 'Week 3', count: 36 },
      { week: 'Week 4', count: 40 },
    ]
  },
  {
    unitId: '2',
    unitName: 'Basketball Court',
    bookings: [
      { week: 'Week 1', count: 25 },
      { week: 'Week 2', count: 30 },
      { week: 'Week 3', count: 28 },
      { week: 'Week 4', count: 35 },
    ]
  }
];

// Monthly booking stats
export const mockMonthlyBookingStats = [
  {
    unitId: '1',
    unitName: 'Tennis Court A',
    bookings: [
      { month: 'Jan', count: 120 },
      { month: 'Feb', count: 110 },
      { month: 'Mar', count: 130 },
      { month: 'Apr', count: 140 },
      { month: 'May', count: 150 },
      { month: 'Jun', count: 160 },
    ]
  },
  {
    unitId: '2',
    unitName: 'Basketball Court',
    bookings: [
      { month: 'Jan', count: 100 },
      { month: 'Feb', count: 120 },
      { month: 'Mar', count: 110 },
      { month: 'Apr', count: 130 },
      { month: 'May', count: 140 },
      { month: 'Jun', count: 150 },
    ]
  }
];

// Function to get booking stats based on period
export const getBookingStats = (period: 'day' | 'week' | 'month') => {
  switch (period) {
    case 'day':
      return mockDailyBookingStats;
    case 'week':
      return mockWeeklyBookingStats;
    case 'month':
      return mockMonthlyBookingStats;
    default:
      return mockDailyBookingStats;
  }
};
