# VisaFlow Demo Script

This script demonstrates the complete visa automation flow using the Sherpa API integration.

## Prerequisites

Before running the demo:

1. ✅ Supabase database setup complete (see `backend/db/SETUP.md`)
2. ✅ Environment variables configured in `.env`
3. ✅ Sherpa API key obtained and added to `.env`
4. ✅ Backend server running

## Demo Flow

### Step 1: Sync Countries

First, sync the country list from Sherpa API to your database.

```typescript
import { trpc } from '@/lib/trpc';

// Sync countries (run once on setup)
const syncResult = await trpc.admin.syncCountries.mutate();
console.log(`Synced ${syncResult.count} countries`);
```

**Expected Output:**
```
Synced 195 countries
```

### Step 2: Check Visa-Free Requirements (US → Thailand)

Test the simplest case: visa-free travel.

```typescript
const thaiCheck = await trpc.visa.check.useQuery({
  citizenship: 'US',
  destination: 'TH'
});

console.log('=== US → Thailand ===');
console.log('Visa Type:', thaiCheck.data.rule.visa_type);
console.log('Stay Duration:', thaiCheck.data.rule.allowed_stay_days, 'days');
console.log('Passport Validity:', thaiCheck.data.rule.passport_validity_requirement_months, 'months');
console.log('\nSummary:');
console.log(thaiCheck.data.explanation.summary);
console.log('\nChecklist:');
thaiCheck.data.explanation.checklist.forEach(item => {
  console.log(`${item.required ? '✓' : '○'} ${item.item}`);
  if (item.note) console.log(`  Note: ${item.note}`);
});
```

**Expected Output:**
```
=== US → Thailand ===
Visa Type: visa_free
Stay Duration: 30 days
Passport Validity: 6 months

Summary:
U.S. citizens: visa-free entry for up to 30 days. 
Passport must be valid for 6 months from entry. 
No visa application required.

Checklist:
✓ Valid passport
  Note: Must be valid for 6 months from entry
```

### Step 3: Check eVisa Requirements (US → India)

Test a more complex case requiring electronic visa.

```typescript
const indiaCheck = await trpc.visa.check.useQuery({
  citizenship: 'US',
  destination: 'IN'
});

console.log('\n=== US → India ===');
console.log('Visa Type:', indiaCheck.data.rule.visa_type);
console.log('Processing Time:', indiaCheck.data.rule.processing_time_days, 'days');
console.log('Stay Duration:', indiaCheck.data.rule.allowed_stay_days, 'days');
console.log('\nSummary:');
console.log(indiaCheck.data.explanation.summary);
console.log('\nDocuments Required:');
indiaCheck.data.rule.documents.forEach(doc => {
  console.log(`${doc.required ? '✓' : '○'} ${doc.name}`);
});
console.log('\nRecommendations:');
indiaCheck.data.explanation.recommendations.forEach(rec => {
  console.log(`→ ${rec}`);
});
```

**Expected Output:**
```
=== US → India ===
Visa Type: evisa
Processing Time: 4 days
Stay Duration: 30 days

Summary:
U.S. citizens: electronic visa (eVisa) for tourism/business purposes. 
Apply online. Processing typically takes 4 business days. 
Valid for stays up to 30 days.

Documents Required:
✓ Valid passport
✓ Completed visa application
✓ Recent passport photo

Recommendations:
→ Print your eVisa approval before departure
→ Apply at least 2 weeks before travel to avoid delays
```

### Step 4: Check Embassy Visa (US → Russia)

Test the most complex case: embassy-required visa.

```typescript
const russiaCheck = await trpc.visa.check.useQuery({
  citizenship: 'US',
  destination: 'RU'
});

console.log('\n=== US → Russia ===');
console.log('Visa Type:', russiaCheck.data.rule.visa_type);
console.log('Processing Time:', russiaCheck.data.rule.processing_time_days, 'days');
console.log('\nSummary:');
console.log(russiaCheck.data.explanation.summary);
console.log('\nAlerts:');
russiaCheck.data.explanation.alerts.forEach(alert => {
  console.log(`⚠️  ${alert}`);
});
```

**Expected Output:**
```
=== US → Russia ===
Visa Type: embassy_required
Processing Time: 20 days

Summary:
U.S. citizens: embassy visa required. Apply at embassy or consulate. 
Allow 3+ weeks for processing.

Alerts:
⚠️  Long processing time: Apply at least 3 weeks before travel
```

### Step 5: Create Trip with Compliance Check

Create a trip and see automatic compliance checking.

```typescript
// Scenario: Trip to India in 45 days with valid passport
const tripResult = await trpc.trips.create.mutate({
  userId: 'demo-user',
  citizenship: 'US',
  destination: 'IN',
  startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  passportExpiry: '2027-01-01'
});

console.log('\n=== Trip Created ===');
console.log('Trip ID:', tripResult.data.trip.id);
console.log('Status:', tripResult.data.trip.status);
console.log('\nCompliance Check:');
console.log('Passport Valid:', tripResult.data.compliance.passportValid ? 'Yes' : 'No');
console.log('Days to Apply:', tripResult.data.compliance.timeToApply);
console.log('Apply By Date:', tripResult.data.compliance.applyByDate);
console.log('Next Action:', tripResult.data.compliance.nextActionDate);

if (tripResult.data.compliance.warnings.length > 0) {
  console.log('\nWarnings:');
  tripResult.data.compliance.warnings.forEach(w => console.log(`⚠️  ${w}`));
}

console.log('\nReminders Schedule:');
tripResult.data.reminders.reminders.forEach(reminder => {
  console.log(`${reminder.date} (T-${reminder.daysBeforeTrip}): ${reminder.message}`);
});
```

**Expected Output:**
```
=== Trip Created ===
Trip ID: a1b2c3d4-e5f6-7890-abcd-ef1234567890
Status: action_required

Compliance Check:
Passport Valid: Yes
Days to Apply: 34
Apply By Date: 2025-02-15
Next Action: 2025-02-15

Warnings:
⚠️  Apply soon! Recommended deadline: 2025-02-15 (34 days left)

Reminders Schedule:
2025-01-16 (T-60): 30 days until visa application deadline
2025-02-01 (T-45): 14 days until visa application deadline
2025-02-08 (T-38): 7 days until visa application deadline
2025-02-12 (T-34): 3 days until visa application deadline
2025-02-14 (T-32): 1 days until visa application deadline
2025-03-15 (T-3): Trip in 3 days. Verify visa approval and print documents.
```

### Step 6: Create Urgent Trip (Deadline Passed)

Test error handling for a trip that starts too soon.

```typescript
const urgentTrip = await trpc.trips.create.mutate({
  userId: 'demo-user',
  citizenship: 'US',
  destination: 'IN',
  startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  passportExpiry: '2027-01-01'
});

console.log('\n=== Urgent Trip (Too Late) ===');
console.log('Status:', urgentTrip.data.trip.status);
console.log('Time to Apply:', urgentTrip.data.compliance.timeToApply, 'days');

if (urgentTrip.data.compliance.errors.length > 0) {
  console.log('\nErrors:');
  urgentTrip.data.compliance.errors.forEach(e => console.log(`❌ ${e}`));
}
```

**Expected Output:**
```
=== Urgent Trip (Too Late) ===
Status: action_required
Time to Apply: -6 days

Errors:
❌ Application deadline passed! Should have applied by 2025-01-10
```

### Step 7: Test Passport Validity Issue

Test passport expiring before required validity period.

```typescript
const invalidPassport = await trpc.trips.create.mutate({
  userId: 'demo-user',
  citizenship: 'US',
  destination: 'TH',
  startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  passportExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Expires 3 months from now
});

console.log('\n=== Invalid Passport ===');
console.log('Status:', invalidPassport.data.trip.status);
console.log('Passport Valid:', invalidPassport.data.compliance.passportValid ? 'Yes' : 'No');

if (invalidPassport.data.compliance.errors.length > 0) {
  console.log('\nErrors:');
  invalidPassport.data.compliance.errors.forEach(e => console.log(`❌ ${e}`));
}
```

**Expected Output:**
```
=== Invalid Passport ===
Status: action_required
Passport Valid: No

Errors:
❌ Passport must be valid until 2025-09-15 (6 months from entry)
```

### Step 8: List User Trips

Retrieve all trips for a user.

```typescript
const userTrips = await trpc.trips.list.useQuery({
  userId: 'demo-user'
});

console.log('\n=== User Trips ===');
console.log(`Total trips: ${userTrips.data.count}`);
userTrips.data.data.forEach(trip => {
  console.log(`\n${trip.citizenship_iso2} → ${trip.destination_iso2}`);
  console.log(`  Dates: ${trip.start_date} to ${trip.end_date}`);
  console.log(`  Status: ${trip.status}`);
  console.log(`  Next Action: ${trip.next_action_date || 'None'}`);
});
```

**Expected Output:**
```
=== User Trips ===
Total trips: 3

US → IN
  Dates: 2025-03-01 to 2025-03-11
  Status: action_required
  Next Action: 2025-02-15

US → IN
  Dates: 2025-01-21 to 2025-01-26
  Status: action_required
  Next Action: 2025-01-16

US → TH
  Dates: 2025-03-15 to 2025-03-25
  Status: action_required
  Next Action: 2025-01-16
```

## Summary

This demo showcases:

✅ **Country Sync** - Fetching and storing country master data  
✅ **Visa Checking** - Automatic fetching and normalization from Sherpa  
✅ **Plain Language** - Human-readable visa explanations  
✅ **Compliance Checking** - Date-aware validation of requirements  
✅ **Reminder Scheduling** - Automatic deadline tracking  
✅ **Error Handling** - Passport validity and deadline violations  
✅ **Trip Management** - CRUD operations for user trips  

## Next Steps

1. **Frontend Integration** - Build UI components using these tRPC hooks
2. **Notifications** - Implement push notifications for reminders
3. **Change Detection** - Add background job to detect visa rule changes
4. **Analytics** - Track popular country pairs for performance optimization

## Testing in Your App

```typescript
// In your React Native component
import { trpc } from '@/lib/trpc';

function VisaFlowDemo() {
  const checkVisa = trpc.visa.check.useQuery({
    citizenship: 'US',
    destination: 'TH'
  });

  if (checkVisa.isLoading) return <Text>Loading...</Text>;
  
  return (
    <View>
      <Text>{checkVisa.data.explanation.summary}</Text>
      {checkVisa.data.explanation.checklist.map(item => (
        <Text key={item.item}>
          {item.required ? '✓' : '○'} {item.item}
        </Text>
      ))}
    </View>
  );
}
```

## Troubleshooting

**"Failed to fetch countries"**
→ Check Sherpa API key in `.env`

**"Country not found: XX"**
→ Run `trpc.admin.syncCountries()` first

**"Failed to fetch visa rule"**
→ Check Sherpa API rate limits (100ms min interval)

**Database errors**
→ Verify Supabase connection and schema setup
