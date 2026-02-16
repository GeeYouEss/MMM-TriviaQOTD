# Testing MMM-TriviaQOTD v2.5 - The Full Experience! 🎯

## What's New in v2.5

✨ **User-Configurable Refresh** - Choose daily, hourly, or custom intervals
⏰ **Smooth Countdown Timer** - Updates every second without flashing
🔄 **Manual Refresh Button** - Get a new question on demand with cooldown timer
🎨 **Better Button Labels** - "Reveal Answer" instead of arrows
📊 **API Usage Calculator** - Automatically estimates your monthly usage

## Quick Test (5 Minutes)

### Step 1: Update Your Files

Replace these files in your `MMM-TriviaQOTD` folder:
- `MMM-TriviaQOTD.js`
- `node_helper.js`
- `MMM-TriviaQOTD.css`

### Step 2: Update config.js

```javascript
{
    module: "MMM-TriviaQOTD",
    position: "bottom_center",
    config: {
        apiKey: "YOUR_ACTUAL_KEY_HERE",
        questionRefreshMode: "hourly",    // Start with hourly
        showTimer: true,
        allowManualRefresh: true,
    }
},
```

### Step 3: Restart and Check Logs

```bash
pm2 restart MagicMirror
pm2 logs MagicMirror --lines 30 | grep Trivia
```

**You should see:**
```
MMM-TriviaQOTD: Refresh mode = hourly
MMM-TriviaQOTD: Estimated API usage = 720/month (24.0% of 3,000 quota)
MMM-TriviaQOTD: Fetching from API Ninjas...
MMM-TriviaQOTD: Successfully fetched trivia
```

### Step 4: Test All Features!

**On your Magic Mirror, you should see:**

1. **The Question** - Big text at the top
2. **"Reveal Answer" button** - Click it!
3. **"New Question" button** - Click it to get a fresh question
4. **Timer** - "Next question in 58 minutes" (smoothly counts down without flashing)

**Test the features:**

✅ Click "Reveal Answer" → Answer appears, button changes to "Show Question"
✅ Wait 10 seconds → Answer auto-hides, question returns
✅ Click "New Question" → New trivia instantly appears
✅ Try clicking "New Question" again → Button shows "wait 59s" counting down
✅ Watch the timer → Updates every second smoothly (no flashing!)
✅ Wait for cooldown → Button changes back to "New Question"

## Different Configuration Tests

### Test 1: Daily Mode (Ultra Conservative)

```javascript
config: {
    apiKey: "YOUR_KEY",
    questionRefreshMode: "daily",
}
```

**Expected:**
- Timer shows "Next question in 23h 45m" (or similar)
- Only 1 new question per day
- Logs show: "Estimated API usage = 30/month (1.0% of 3,000 quota)"

### Test 2: Custom 2-Hour Refresh

```javascript
config: {
    apiKey: "YOUR_KEY",
    questionRefreshMode: "custom",
    customRefreshMinutes: 120,
}
```

**Expected:**
- Timer shows "Next question in 1h 58m"
- New question every 2 hours
- Logs show: "Estimated API usage = 360/month (12.0% of 3,000 quota)"

### Test 3: Minimal UI (No Buttons or Timer)

```javascript
config: {
    apiKey: "YOUR_KEY",
    questionRefreshMode: "hourly",
    showTimer: false,
    allowManualRefresh: false,
}
```

**Expected:**
- Only question text and "Reveal Answer" button visible
- No timer, no "New Question" button
- Clean, minimal interface

## Troubleshooting

### Timer Flashing/Flickering

**This should be fixed!** Timer now updates smoothly every second without refreshing the entire module.

### Timer Shows "1h 0m" Instead of "60 minutes"

**This should be fixed!** Now shows total minutes until it reaches 2 hours or more.
- 119 minutes → "119 minutes"
- 120 minutes → "2h 0m"

### "New Question" Button Shows "wait..." Without Time

**This should be fixed!** Button now shows actual cooldown:
- "wait 59s" (under 1 minute)
- "wait 2 mins" (over 1 minute)

### "New Question" Button Always Disabled

- You're clicking too fast - there's a 1-minute cooldown
- Wait 60 seconds between manual refreshes

### API Usage Warning in Logs

```
WARNING! Estimated usage exceeds API quota!
```

**Solution:** Your refresh interval is too aggressive. Options:
- Change to "hourly" mode (720/month)
- Use custom mode with higher minutes
- Keep "daily" mode (30/month)

### Same Question After Manual Refresh

- First manual click within 5 minutes uses cache
- Wait 5 minutes or restart MagicMirror to force new fetch

### Timer Says "Refreshing..." But No New Question

- Check logs for errors: `pm2 logs MagicMirror | grep Trivia`
- Could be API issue - module will use cached question
- Try manual refresh button

## Performance Check

Monitor your API usage in real-time:

```bash
# Watch logs for API calls
pm2 logs MagicMirror --lines 100 | grep "Fetching from API"
```

**Healthy output:**
- Hourly mode: 1 fetch per hour
- Daily mode: 1 fetch per day
- Manual clicks show: "Fetching from API Ninjas (forced)"

## What's Next?

Once everything works:
1. Choose your preferred refresh mode
2. I'll create an awesome README
3. Push to GitHub
4. Celebrate! 🎉

## Quick Reference: Refresh Modes

| Mode | Interval | Calls/Month | % of Quota | Best For |
|------|----------|-------------|------------|----------|
| Daily | 24 hours | 30 | 1% | Ultra conservative |
| Hourly | 60 minutes | 720 | 24% | **Recommended** |
| Custom (2h) | 120 minutes | 360 | 12% | Good balance |
| Custom (30m) | 30 minutes | 1,440 | 48% | Very active |

**The "New Question" button doesn't count toward these totals** (it has its own 1-minute cooldown).

---

Tell me when it's working and which mode you like best! 🚀
