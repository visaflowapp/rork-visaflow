# VisaFlow - Visa Tracking App

A React Native app built with Expo for tracking visa records and travel compliance, with Supabase backend integration.

## Features

- Track multiple active visas with expiration dates
- Visual progress indicators for visa utilization
- Alerts for visa deadlines and policy changes
- Visa requirements lookup by country and purpose
- User profile management
- Supabase backend integration for data persistence

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_RORK_API_BASE_URL=your-api-base-url
```

3. Your Supabase database should have these tables:

### `users` table:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  nationality TEXT NOT NULL,
  email TEXT NOT NULL,
  preferred_regions TEXT[] DEFAULT '{}',
  notifications BOOLEAN DEFAULT true,
  travel_mode BOOLEAN DEFAULT false
);
```

### `visas` table:
```sql
CREATE TABLE visas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  visa_type TEXT NOT NULL,
  entry_date DATE NOT NULL,
  duration INTEGER NOT NULL,
  exit_date DATE NOT NULL,
  extensions_available INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);
```

### `alerts` table:
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('deadline', 'policy', 'embassy')) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false
);
```

4. Start the development server:
```bash
npm start
```

## Architecture

- **Frontend**: React Native with Expo
- **Backend**: tRPC with Hono + Supabase
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Styling**: React Native StyleSheet

## Supabase Integration

The app connects to your existing Supabase database using the table structure you've already created. Make sure to:

1. Set your Supabase URL and anon key in environment variables
2. Enable Row Level Security (RLS) on your tables if needed
3. Configure proper policies for data access

## Database Schema

- `users`: User profile information
- `visas`: Individual visa entries with dates and details
- `alerts`: Notifications for deadlines and policy changes

The app automatically syncs with your Supabase database and displays all visa records in a clean, organized interface.