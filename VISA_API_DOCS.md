# VisaFlow API Documentation

Complete visa rules automation system built on Sherpa API v2.

## Quick Start

### 1. Environment Setup

```bash
# .env configuration
SHERPA_API_BASE_URL=https://public.sherpa.joinsherpa.io/v2
SHERPA_API_KEY=your_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

### 2. Database Setup

Run SQL schema in `backend/db/SETUP.md` on your Supabase project.

### 3. Initialize Countries

```typescript
// Sync countries from Sherpa (run once)
await trpc.admin.syncCountries.mutate();
```

## API Endpoints

### Countries

**`trpc.countries.list()`** - Get all countries
**`trpc.countries.search({ query })`** - Search countries
**`trpc.countries.get({ iso2 })`** - Get country by code

### Visa Requirements

**`trpc.visa.check({ citizenship, destination })`** - Check visa requirements

Returns normalized visa rules + plain-language explanation.

Example:
```typescript
const { data } = await trpc.visa.check.useQuery({
  citizenship: 'US',
  destination: 'TH'
});

// data.explanation.summary:
// "U.S. citizens: visa-free entry for up to 30 days.
//  Passport must be valid for 6 months from entry."
```

### Trips

**`trpc.trips.create({ userId, citizenship, destination, startDate, endDate, passportExpiry? })`**

Creates trip + performs compliance check + generates reminders.

**`trpc.trips.list({ userId })`** - Get user trips
**`trpc.trips.get({ tripId })`** - Get single trip
**`trpc.trips.delete({ tripId })`** - Delete trip

### Admin

**`trpc.admin.syncCountries()`** - Sync country list from Sherpa
**`trpc.admin.ingestVisaRule({ citizenship, destination })`** - Manually ingest rule
**`trpc.admin.ingestMultiple({ pairs })`** - Batch ingest rules

## Visa Types

- `visa_free` - No visa required
- `evisa` - Electronic visa (apply online)
- `visa_on_arrival` - Visa at border
- `embassy_required` - Embassy/consulate application
- `transit` - Transit visa
- `other` - Special arrangements

## Compliance Checking

The system calculates:
- Passport validity against trip dates
- Visa application deadlines
- Processing time sufficiency
- Required documents checklist

Status levels:
- `ok` - All requirements met
- `action_required` - Action needed (deadline approaching, passport issue)
- `unknown` - Insufficient data

## Reminder Scheduling

Automated reminders for:
- Visa application deadlines (T-30, T-14, T-7, T-3, T-1 days)
- Pre-departure checks (T-7, T-3, T-1 days)
- Passport validity alerts (immediate if invalid)

## Example Flows

### Visa-Free Travel (US → Thailand)
```typescript
// 1. Check requirements
const check = await trpc.visa.check.useQuery({
  citizenship: 'US',
  destination: 'TH'
});

// Result: visa_free, 30 days, 6 months passport validity

// 2. Create trip
const trip = await trpc.trips.create.mutate({
  userId: 'user123',
  citizenship: 'US',
  destination: 'TH',
  startDate: '2025-06-01',
  endDate: '2025-06-15',
  passportExpiry: '2026-12-31'
});

// Result: status='ok', reminders at T-7 and T-1 days
```

### eVisa Required (US → India)
```typescript
const trip = await trpc.trips.create.mutate({
  userId: 'user123',
  citizenship: 'US',
  destination: 'IN',
  startDate: '2025-04-01',
  endDate: '2025-04-15',
  passportExpiry: '2027-01-01'
});

// Result: 
// - processing_time_days: 4
// - apply_by_date: '2025-03-21' (11 days before travel)
// - reminders: T-30, T-14, T-7, T-3, T-1 before apply-by date
// - status: 'action_required' if within 30 days
```

### Embassy Visa (US → Russia)
```typescript
const check = await trpc.visa.check.useQuery({
  citizenship: 'US',
  destination: 'RU'
});

// Result:
// - visa_type: 'embassy_required'
// - processing_time_days: 20
// - apply_by_date: 27 days before travel (20 + 7 buffer)
// - documents: visa form, invitation letter, insurance, etc.
```

## Architecture

```
Frontend (tRPC React Client)
    ↓
Backend (Hono + tRPC Router)
    ↓
Services (Sherpa Client, Ingestion, Explainer, Checker)
    ↓
Models (Country, VisaRule, UserTrip)
    ↓
Supabase Database
```

## Data Normalization

Sherpa responses are normalized into:

```typescript
VisaRule {
  citizenship_iso2: string
  destination_iso2: string
  visa_type: 'visa_free' | 'evisa' | 'visa_on_arrival' | 'embassy_required' | 'transit' | 'other'
  allowed_stay_days: number | null
  processing_time_days: number | null
  passport_validity_requirement_months: number | null
  documents: { name, required, note }[]
  restrictions: string[]
  notes_structured: string[]
  raw_payload: json
  source_version: string
  payload_hash: string
}
```

## Rate Limiting

- Minimum 100ms between Sherpa API requests
- Circuit breaker for repeated failures
- Database caching (fetch once, use forever until manually refreshed)

## Change Detection

The system stores:
- `payload_hash` - SHA256 of raw Sherpa response
- `source_version` - Sherpa API version
- `fetched_at` - Last fetch timestamp

Future enhancement: Background job to detect rule changes and notify affected users.

## Frontend Integration

Use tRPC React hooks:

```typescript
// In React Native component
import { trpc } from '@/lib/trpc';

function VisaChecker() {
  const checkVisa = trpc.visa.check.useQuery({
    citizenship: 'US',
    destination: 'TH'
  });

  if (checkVisa.isLoading) return <Loading />;
  
  return (
    <View>
      <Text>{checkVisa.data?.explanation.summary}</Text>
      {checkVisa.data?.explanation.checklist.map(item => (
        <ChecklistItem key={item.item} {...item} />
      ))}
    </View>
  );
}
```

## Deployment

1. Set up Supabase project and run migrations
2. Configure environment variables
3. Obtain Sherpa API key
4. Deploy backend (Hono server)
5. Run `trpc.admin.syncCountries()`
6. Test with sample country pairs

## Monitoring

Track:
- Sherpa API success rate
- Ingestion failures
- Average processing time
- Most-queried country pairs (for cache warming)

## Support

For issues or questions, refer to:
- Sherpa API Docs: https://docs.joinsherpa.com/
- Project README: `/backend/db/SETUP.md`
