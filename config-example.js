// MMM-TriviaQOTD v2.5 Configuration Examples
// Choose the refresh mode that fits your needs!

// ===========================================================
// OPTION 1: HOURLY REFRESH (Recommended for most users)
// ===========================================================
// - New question every hour
// - ~720 API calls per month (24% of quota)
// - Great balance of freshness and API usage

{
    module: "MMM-TriviaQOTD",
    position: "bottom_center",
    config: {
        apiKey: "YOUR_API_KEY_HERE",      // REQUIRED - Get free key at api-ninjas.com
        questionRefreshMode: "hourly",     // New question every hour
        animationSpeed: 1000,
        answerTimeout: 10000,              // Answer auto-hides after 10 seconds
        showTimer: true,                   // Show "Next question in X minutes"
        allowManualRefresh: true,          // Show "New Question" button
        manualRefreshCooldown: 60000,      // 1 minute cooldown on manual refresh
    }
},

// ===========================================================
// OPTION 2: DAILY REFRESH (Most conservative)
// ===========================================================
// - One question per day
// - ~30 API calls per month (1% of quota)
// - Perfect if you want to save API calls

{
    module: "MMM-TriviaQOTD",
    position: "bottom_center",
    config: {
        apiKey: "YOUR_API_KEY_HERE",
        questionRefreshMode: "daily",      // New question once per day
        showTimer: true,
        allowManualRefresh: true,
    }
},

// ===========================================================
// OPTION 3: CUSTOM REFRESH INTERVAL
// ===========================================================
// - You choose how many minutes between questions
// - Calculate your usage: (1440 / minutes) × 30 = calls/month
// - Examples:
//   - Every 30 min = 1,440 calls/month (48% of quota)
//   - Every 2 hours = 360 calls/month (12% of quota)
//   - Every 4 hours = 180 calls/month (6% of quota)

{
    module: "MMM-TriviaQOTD",
    position: "bottom_center",
    config: {
        apiKey: "YOUR_API_KEY_HERE",
        questionRefreshMode: "custom",     // Use custom interval
        customRefreshMinutes: 120,         // New question every 2 hours
        showTimer: true,
        allowManualRefresh: true,
    }
},

// ===========================================================
// OPTION 4: MINIMAL UI (Clean & Simple)
// ===========================================================
// - Hide timer and manual refresh button
// - Just question/answer toggle

{
    module: "MMM-TriviaQOTD",
    position: "bottom_center",
    config: {
        apiKey: "YOUR_API_KEY_HERE",
        questionRefreshMode: "hourly",
        showTimer: false,                  // Hide countdown timer
        allowManualRefresh: false,         // Hide "New Question" button
        answerTimeout: 10000,
    }
},

// ===========================================================
// CONFIGURATION REFERENCE
// ===========================================================

/*
ALL AVAILABLE OPTIONS:

apiKey: string (REQUIRED)
  - Your API Ninjas API key
  - Get free key at https://api-ninjas.com
  - Free tier: 3,000 calls/month

questionRefreshMode: "daily" | "hourly" | "custom"
  - "daily": One question per day (~30 calls/month)
  - "hourly": New question every hour (~720 calls/month)
  - "custom": Use customRefreshMinutes value

customRefreshMinutes: number
  - Only used when questionRefreshMode is "custom"
  - How many minutes between automatic question changes
  - Default: 60

animationSpeed: number
  - Transition speed in milliseconds
  - Default: 1000

answerTimeout: number
  - How long answer stays visible before auto-hiding (ms)
  - Set to 0 to disable auto-hide
  - Default: 10000 (10 seconds)

showTimer: boolean
  - Show countdown to next question
  - Default: true

allowManualRefresh: boolean
  - Show "New Question" button
  - Default: true

manualRefreshCooldown: number
  - Cooldown period for manual refresh button (ms)
  - Prevents accidental API quota usage
  - Default: 60000 (1 minute)
*/

// ===========================================================
// API USAGE CALCULATOR
// ===========================================================

/*
The module will automatically calculate and log your estimated usage.
Check your MagicMirror logs to see:

pm2 logs MagicMirror | grep "Estimated API usage"

Example output:
"Estimated API usage = 720/month (24.0% of 3,000 quota)"

Your API key gives you 3,000 calls per month for free.

REFRESH MODE ESTIMATES:
- Daily (24 hours):     30 calls/month   (1% of quota)
- Hourly (60 minutes):  720 calls/month  (24% of quota)
- Every 30 minutes:     1,440 calls/month (48% of quota)
- Every 15 minutes:     2,880 calls/month (96% of quota) ⚠️

The "New Question" button does NOT count toward scheduled calls,
but has a 1-minute cooldown to prevent excessive usage.
*/
