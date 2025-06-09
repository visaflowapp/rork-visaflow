# Environment Variables Setup Guide

## Current Issue
The API configuration test is showing "API Key: Missing" which means the environment variables are not being loaded correctly at runtime.

## Steps to Fix

### 1. Check Your Rork Project Dashboard
1. Go to your Rork project dashboard
2. Navigate to Environment Variables section
3. Verify these variables are set:
   - `EXPO_PUBLIC_VISA_API_ENDPOINT` = `https://visa-requirement.p.rapidapi.com/`
   - `EXPO_PUBLIC_VISA_API_KEY` = `[your actual RapidAPI key]`

### 2. Verify Variable Names
Make sure the variable names in your dashboard match exactly:
- ✅ `EXPO_PUBLIC_VISA_API_ENDPOINT` (not `VISA_API_ENDPOINT`)
- ✅ `EXPO_PUBLIC_VISA_API_KEY` (not `VISA_API_KEY`)

The `EXPO_PUBLIC_` prefix is required for Expo to make these variables available at runtime.

### 3. Restart Your Development Server
After updating environment variables:
1. Stop the current development server (Ctrl+C)
2. Restart with: `npm start` or `bunx rork start -p jqi6ca3rcwl7yd6askueg --tunnel`

### 4. Test the Configuration
1. Open the Requirements tab in your app
2. Click "Test API Configuration" button
3. Check if the environment variables are now loaded correctly

## Expected Results
After fixing the environment variables, you should see:
- ✅ Endpoint: Set
- ✅ API Key: Set  
- ✅ Ready: Yes

## Troubleshooting
If the variables are still not loading:
1. Double-check the variable names in your Rork dashboard
2. Ensure there are no extra spaces or quotes around the values
3. Try redeploying your project in the Rork dashboard
4. Clear your app cache and restart

## Security Note
- Never commit your actual API keys to version control
- The environment variables should only contain your real credentials
- The `.env` file in this project is just a template