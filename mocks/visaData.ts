export interface Visa {
  id: string;
  country: string;
  visa_type: string;
  entry_date: string;
  exit_date: string;
  duration: number;
  extensions_available: number;
  is_active: boolean;
  daysLeft: number;
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  date: string;
  is_read: boolean;
  visa_id?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  nationality: string;
  preferred_regions: string[];
  notifications: boolean;
  travel_mode: boolean;
}

// Calculate days left from exit date
const calculateDaysLeft = (exitDate: string): number => {
  const today = new Date();
  const exit = new Date(exitDate);
  const diffTime = exit.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const dummyVisas: Visa[] = [
  {
    id: '1',
    country: 'Indonesia',
    visa_type: 'B211A Visa',
    entry_date: '2025-03-12',
    exit_date: '2025-05-11',
    duration: 60,
    extensions_available: 2,
    is_active: true,
    daysLeft: calculateDaysLeft('2025-05-11'),
    notes: 'Can be extended twice for 30 days each'
  }
];

export const dummyAlerts: Alert[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Visa Expiring Soon',
    message: 'Your Indonesia B211A Visa expires in 34 days. Consider extending or planning your exit.',
    date: '2025-01-11',
    is_read: false,
    visa_id: '1'
  },
  {
    id: '2',
    type: 'info',
    title: 'Extension Deadline Approaching',
    message: 'You have 7 days left to apply for your visa extension.',
    date: '2025-01-10',
    is_read: false,
    visa_id: '1'
  }
];

export const dummyProfile: UserProfile = {
  id: 'demo-user',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  nationality: 'United States',
  preferred_regions: ['Southeast Asia', 'Europe', 'Latin America'],
  notifications: true,
  travel_mode: false,
};