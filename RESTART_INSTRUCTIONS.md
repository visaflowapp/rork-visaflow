# Restart Development Server

To load your updated .env file with the new API credentials, restart the development server:

## Stop the current server:
Press `Ctrl+C` (or `Cmd+C` on Mac) in your terminal to stop the current development server.

## Start the server again:
```bash
npm start
```

Or if you're using the specific start command:
```bash
bunx rork start -p jqi6ca3rcwl7yd6askueg --tunnel
```

## Verify Environment Variables:
After restarting, the app should now use your actual API credentials from the .env file. Test the "Check Requirements" function to confirm it's working with your real API.

## If you're still having issues:
1. Make sure your .env file is in the root directory (same level as package.json)
2. Verify the variable names match exactly: `EXPO_PUBLIC_VISA_API_ENDPOINT` and `EXPO_PUBLIC_VISA_API_KEY`
3. Ensure there are no extra spaces or quotes around the values
4. Try clearing the cache: `npx expo start --clear`