# VisaFlow - Visa Tracking App

A React Native app built with Expo for tracking visa records and travel compliance.

## Features

- Track multiple active visas with expiration dates
- Visual progress indicators for visa utilization
- Alerts for visa deadlines and policy changes
- Visa requirements lookup by country and purpose
- User profile management
- Local data storage with dummy data

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

## Architecture

- **Frontend**: React Native with Expo
- **State Management**: Zustand with AsyncStorage persistence
- **Styling**: React Native StyleSheet with mobile-first design
- **Data**: Local dummy data (no backend required)

## Features

### Tracker Tab
- Circular progress ring showing days remaining
- Color-coded status (green/yellow/red)
- Horizontal scrolling visa cards
- Country flags and visa details
- Extension deadline tracking

### Requirements Tab
- Country-to-country visa requirements lookup
- Trip purpose selection
- Detailed visa type information
- Processing times and fees

### Alerts Tab
- Visa expiration notifications
- Policy change alerts
- Swipe to dismiss functionality

### Profile Tab
- User profile management
- Notification preferences
- Travel mode settings

## Design

The app features a clean, mobile-native design inspired by iOS, Instagram, and modern travel apps. It uses:

- Drop shadows and rounded corners for depth
- Blue primary color with green/yellow/red status indicators
- Clean typography and spacing
- Smooth animations and transitions
- Gen Z-friendly visual design

## Data Storage

All data is stored locally using Zustand with AsyncStorage persistence. The app includes realistic dummy data for demonstration purposes.