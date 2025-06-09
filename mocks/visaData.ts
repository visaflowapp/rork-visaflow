import { VisaRecord, Alert, UserProfile } from '@/store/types';

// Updated dummy data with Indonesia B211A Visa
export const dummyVisas: VisaRecord[] = [
  {
    id: '1',
    country: 'Indonesia',
    visa_type: 'B211A Visa',
    entry_date: '2025-03-13',
    duration: 60,
    exit_date: '2025-05-12',
    extensions_available: 2,
    is_active: true,
    daysLeft: 34,
  }
];

export const dummyAlerts: Alert[] = [
  {
    id: '1',
    type: 'deadline',
    title: 'Visa Expiring Soon',
    description: 'Your Indonesia B211A Visa expires in 34 days',
    timestamp: new Date().toISOString(),
    is_read: false,
    icon: 'clock',
  },
  {
    id: '2',
    type: 'deadline',
    title: 'Upcoming Extension Deadline',
    description: 'Your Indonesia B211A visa extension deadline is in 7 days. Submit required documents to avoid penalties.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    is_read: false,
    icon: 'calendar',
  },
  {
    id: '3',
    type: 'embassy',
    title: 'Embassy Closure Notice',
    description: 'Indonesian immigration offices will be closed August 17th for Independence Day.',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    is_read: false,
    icon: 'building',
  },
  {
    id: '4',
    type: 'policy',
    title: 'Policy Change Update',
    description: 'Indonesia has updated its re-entry rules for B211A holders. You must now wait 60 days before reapplying.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    is_read: true,
    icon: 'file-text',
  }
];

export const dummyProfile: UserProfile = {
  id: 'demo-user',
  name: 'Alex Johnson',
  nationality: 'United States',
  email: 'alex@example.com',
  preferred_regions: ['Europe', 'Asia'],
  notifications: true,
  travel_mode: false,
};