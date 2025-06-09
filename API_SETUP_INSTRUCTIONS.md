# API Setup Instructions

## How to Add Your API Credentials

1. **Edit the `.env` file** (located in the root directory):
   - Replace `https://your-visa-api-endpoint.com/requirements` with your actual API endpoint
   - Replace `your-api-key-here` with your actual API key

2. **Example for RapidAPI**:
   ```
   EXPO_PUBLIC_VISA_API_ENDPOINT=https://visa-requirements-api.rapidapi.com/check
   EXPO_PUBLIC_VISA_API_KEY=your-rapidapi-key-here
   ```

3. **If you need different headers** (like for RapidAPI), edit `config/api.ts`:
   - Uncomment and modify the header lines in the fetch request
   - For RapidAPI, you might need:
     ```javascript
     'X-RapidAPI-Key': API_CONFIG.API_KEY,
     'X-RapidAPI-Host': 'your-rapidapi-host.com',
     ```

## Files to Edit:
- **`.env`** - Add your actual API endpoint and key
- **`config/api.ts`** - Modify headers if needed for your specific API

## Security Note:
- Never commit your actual API keys to version control
- The `.env` file should contain your real credentials
- The `config/api.ts` file loads from environment variables for security