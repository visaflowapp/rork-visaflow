# Database Setup Instructions

## Supabase Database Schema

Run these SQL commands in your Supabase SQL editor to create the required tables:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries table
CREATE TABLE countries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  iso2 VARCHAR(2) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  citizenship_label VARCHAR(255),
  region VARCHAR(100),
  aliases TEXT[],
  last_synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_countries_iso2 ON countries(iso2);
CREATE INDEX idx_countries_name ON countries(name);

-- Visa rules table
CREATE TABLE visa_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  citizenship_iso2 VARCHAR(2) NOT NULL REFERENCES countries(iso2),
  destination_iso2 VARCHAR(2) NOT NULL REFERENCES countries(iso2),
  visa_type VARCHAR(50) NOT NULL CHECK (visa_type IN ('visa_free', 'evisa', 'visa_on_arrival', 'embassy_required', 'transit', 'other')),
  allowed_stay_days INTEGER,
  stay_period_description TEXT,
  documents JSONB DEFAULT '[]'::jsonb,
  processing_time_days INTEGER,
  passport_validity_requirement_months INTEGER,
  restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes_structured TEXT[] DEFAULT ARRAY[]::TEXT[],
  raw_payload JSONB NOT NULL,
  source_version VARCHAR(50) NOT NULL,
  payload_hash VARCHAR(64) NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(citizenship_iso2, destination_iso2)
);

CREATE INDEX idx_visa_rules_citizenship ON visa_rules(citizenship_iso2);
CREATE INDEX idx_visa_rules_destination ON visa_rules(destination_iso2);
CREATE INDEX idx_visa_rules_pair ON visa_rules(citizenship_iso2, destination_iso2);
CREATE INDEX idx_visa_rules_payload_hash ON visa_rules(payload_hash);

-- Visa rule changes table
CREATE TABLE visa_rule_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visa_rule_id UUID NOT NULL REFERENCES visa_rules(id) ON DELETE CASCADE,
  old_payload_hash VARCHAR(64) NOT NULL,
  new_payload_hash VARCHAR(64) NOT NULL,
  diff_summary TEXT NOT NULL,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_visa_rule_changes_rule_id ON visa_rule_changes(visa_rule_id);
CREATE INDEX idx_visa_rule_changes_detected_at ON visa_rule_changes(detected_at);

-- User trips table
CREATE TABLE user_trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  citizenship_iso2 VARCHAR(2) NOT NULL REFERENCES countries(iso2),
  destination_iso2 VARCHAR(2) NOT NULL REFERENCES countries(iso2),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  visa_rule_id UUID REFERENCES visa_rules(id),
  passport_expiry_date DATE,
  status VARCHAR(20) NOT NULL DEFAULT 'unknown' CHECK (status IN ('ok', 'action_required', 'unknown')),
  next_action_date DATE,
  compliance_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_trips_user_id ON user_trips(user_id);
CREATE INDEX idx_user_trips_status ON user_trips(status);
CREATE INDEX idx_user_trips_next_action_date ON user_trips(next_action_date);
CREATE INDEX idx_user_trips_start_date ON user_trips(start_date);

-- Update triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visa_rules_updated_at BEFORE UPDATE ON visa_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_trips_updated_at BEFORE UPDATE ON user_trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Environment Variables

Update your `.env` file with your Supabase credentials:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Sherpa API

Get your Sherpa API key from https://www.joinsherpa.com and add it to `.env`:

```
SHERPA_API_KEY=your_sherpa_api_key_here
```
