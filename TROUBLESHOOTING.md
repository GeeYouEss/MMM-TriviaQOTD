# MMM-TriviaQOTD Troubleshooting Guide

## Step 1: Install Dependencies (MOST COMMON ISSUE!)
SSH into your Pi and run:
```bash
cd ~/MagicMirror/modules/MMM-TriviaQOTD
npm install
```

If you see errors, try:
```bash
npm install --legacy-peer-deps
```

## Step 2: Check the Logs
View MagicMirror logs:
```bash
pm2 logs MagicMirror --lines 100
```

Look for messages like:
- "MMM-TriviaQOTD: Node helper started" (good!)
- "MMM-TriviaQOTD: Fetching from website..." (good!)
- "MMM-TriviaQOTD: Successfully fetched trivia" (perfect!)
- "MMM-TriviaQOTD: Fetch error" (problem - check internet)
- "Cannot find module" (run npm install!)

## Step 3: Test Manually
SSH into your Pi and test the fetch:
```bash
cd ~/MagicMirror/modules/MMM-TriviaQOTD
node -e "
const axios = require('axios');
axios.get('https://sites.google.com/ivytech.edu/cae/home/trivia-questions')
  .then(r => console.log('SUCCESS - fetched', r.data.length, 'bytes'))
  .catch(e => console.log('ERROR:', e.message));
"
```

## Step 4: Verify Config
Make sure your config.js has:
1. Removed or commented out the compliments module
2. Added the MMM-TriviaQOTD module in bottom_center position
3. No syntax errors (extra commas, missing brackets)

## Step 5: Restart MagicMirror
After making any changes:
```bash
pm2 restart MagicMirror
```

Or if that doesn't work:
```bash
pm2 stop MagicMirror
pm2 start MagicMirror
```

## Common Error Messages and Fixes

### "Loading trivia..." forever
- Dependencies not installed → Run `npm install`
- Internet connection issue → Check Pi's internet
- Module config incorrect → Verify config.js syntax

### "No trivia available"
- Website might be temporarily down
- Parse error → Check logs for details
- Old cached data → Module will retry automatically

### Module doesn't appear at all
- Not in config.js → Add the module config
- Syntax error in config.js → Check for typos
- Wrong position → Try "middle_center" to test

### "Cannot find module 'axios'" or "Cannot find module 'cheerio'"
- Dependencies not installed → Run `npm install` in module directory

## Quick Fix Commands

Reinstall everything:
```bash
cd ~/MagicMirror/modules/MMM-TriviaQOTD
rm -rf node_modules package-lock.json
npm install
pm2 restart MagicMirror
```

Force refresh:
```bash
pm2 restart MagicMirror
# Then in your browser press Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

## Still Not Working?

Check the browser console:
1. Open MagicMirror in your browser
2. Press F12 to open developer tools
3. Look at the Console tab
4. Look for red error messages related to MMM-TriviaQOTD

The logs will tell you exactly what's wrong!
