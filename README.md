# MMM-TriviaQOTD

A MagicMirror² module that displays trivia questions with interactive answer reveals, configurable refresh intervals, and a smooth countdown timer. Perfect for adding educational entertainment to your smart mirror!

![Question View](Screenshot_question.png)

![Answer View](Screenshot_answer.png)

![Question with Cooldown](Screenshot_question_cooldown.png)

![New Question Button](Screenshot_new_question.png)

## Features

- **Fresh Trivia Questions** - Powered by API Ninjas with thousands of questions
- **Configurable Refresh** - Choose daily, hourly, or custom intervals
- **Smart Countdown Timer** - Shows when the next question arrives (updates smoothly every second)
- **Manual Refresh Button** - Get a new question on demand with cooldown protection
- **Interactive Toggle** - Reveal and hide answers with a single click
- **Auto-Hide Answer** - Answer automatically returns to question after 10 seconds
- **Clean, Minimalist Design** - Fits seamlessly into any MagicMirror theme
- **API Usage Calculator** - Automatically estimates your monthly API usage
- **Highly Configurable** - Customize every aspect to your preferences
- **Raspberry Pi Optimized** - Efficient caching and resource usage

## Requirements

- MagicMirror² instance
- API Ninjas API key (free tier: 3,000 calls/month)
- Node.js and npm

## Installation

### 1. Clone the Repository

```bash
cd ~/MagicMirror/modules
git clone https://github.com/GeeYouEss/MMM-TriviaQOTD.git
```

### 2. Install Dependencies

```bash
cd MMM-TriviaQOTD
npm install
```

### 3. Get Your Free API Key

1. Visit [api-ninjas.com](https://api-ninjas.com)
2. Sign up for a free account
3. Navigate to your dashboard and copy your API key
4. Free tier includes **3,000 API calls per month** (more than enough!)

### 4. Configure the Module

Add the module to your `config/config.js` file:

```javascript
{
    module: "MMM-TriviaQOTD",
    position: "bottom_center",
    config: {
        apiKey: "YOUR_API_KEY_HERE",  // REQUIRED - Get free key at api-ninjas.com
        questionRefreshMode: "hourly", // Options: "daily", "hourly", "custom"
        showTimer: true,               // Show countdown to next question
        allowManualRefresh: true,      // Show "New Question" button
    }
}
```

**Important:** Replace `YOUR_API_KEY_HERE` with your actual API Ninjas key!

### 5. Restart MagicMirror

```bash
pm2 restart MagicMirror
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `apiKey` | String | **REQUIRED** | Your API Ninjas API key ([get one free](https://api-ninjas.com)) |
| `questionRefreshMode` | String | `"hourly"` | When to fetch new questions: `"daily"`, `"hourly"`, or `"custom"` |
| `customRefreshMinutes` | Number | `60` | Minutes between refreshes (only used when mode is `"custom"`) |
| `animationSpeed` | Number | `1000` | Transition speed in milliseconds |
| `answerTimeout` | Number | `10000` | How long answer stays visible before auto-hiding (ms). Set to `0` to disable |
| `showTimer` | Boolean | `true` | Display countdown timer to next question |
| `allowManualRefresh` | Boolean | `true` | Show "New Question" button for on-demand trivia |
| `manualRefreshCooldown` | Number | `60000` | Cooldown period for manual refresh button (ms) |

## API Usage Guide

The module automatically calculates your estimated monthly API usage based on your refresh mode. Free tier provides **3,000 calls per month**.

### Refresh Mode Estimates

| Mode | Interval | Calls/Day | Calls/Month | % of Quota | Best For |
|------|----------|-----------|-------------|------------|----------|
| `daily` | 24 hours | 1 | ~30 | 1% | Ultra conservative |
| `hourly` | 60 minutes | 24 | ~720 | 24% | **Recommended** |
| `custom` (2h) | 120 minutes | 12 | ~360 | 12% | Good balance |
| `custom` (30m) | 30 minutes | 48 | ~1,440 | 48% | Very active |

**Note:** The "New Question" button has its own 1-minute cooldown and doesn't count toward scheduled refreshes.

### Check Your Usage

When you start MagicMirror, check the logs to see your estimated usage:

```bash
pm2 logs MagicMirror | grep "Estimated API usage"
```

Example output:
```
MMM-TriviaQOTD: Estimated API usage = 720/month (24.0% of 3,000 quota)
```

## Configuration Examples

### Example 1: Hourly Refresh (Recommended)

Fresh trivia every hour with all features enabled.

```javascript
{
    module: "MMM-TriviaQOTD",
    position: "bottom_center",
    config: {
        apiKey: "your_api_key_here",
        questionRefreshMode: "hourly",
        showTimer: true,
        allowManualRefresh: true,
        answerTimeout: 10000,
    }
}
```

**Usage:** ~720 calls/month (24% of quota)

### Example 2: Daily Refresh (Ultra Conservative)

One question per day, perfect for minimal API usage.

```javascript
{
    module: "MMM-TriviaQOTD",
    position: "bottom_center",
    config: {
        apiKey: "your_api_key_here",
        questionRefreshMode: "daily",
        showTimer: true,
        allowManualRefresh: true,
    }
}
```

**Usage:** ~30 calls/month (1% of quota)

### Example 3: Custom Interval

New question every 2 hours for a balanced approach.

```javascript
{
    module: "MMM-TriviaQOTD",
    position: "bottom_center",
    config: {
        apiKey: "your_api_key_here",
        questionRefreshMode: "custom",
        customRefreshMinutes: 120,  // Every 2 hours
        showTimer: true,
        allowManualRefresh: true,
    }
}
```

**Usage:** ~360 calls/month (12% of quota)

### Example 4: Minimal UI

Clean interface with just question/answer toggle, no timer or manual refresh.

```javascript
{
    module: "MMM-TriviaQOTD",
    position: "bottom_center",
    config: {
        apiKey: "your_api_key_here",
        questionRefreshMode: "hourly",
        showTimer: false,            // Hide countdown timer
        allowManualRefresh: false,   // Hide "New Question" button
        answerTimeout: 0,            // Disable auto-hide
    }
}
```

## Usage

### Interactive Features

**Reveal Answer:**
- Click the "Reveal Answer" button to see the answer
- Answer automatically hides after 10 seconds (configurable)
- Click "Show Question" to manually return to the question

**Get New Question:**
- Click "New Question" to instantly fetch fresh trivia
- Button shows cooldown timer: "wait 59s" → "wait 1s" → "New Question"
- Prevents API spam with configurable cooldown (default: 1 minute)

**Countdown Timer:**
- Shows time until next automatic question refresh
- Updates smoothly every second
- Format examples:
  - "Next question in 58 minutes"
  - "Next question in 2h 15m"
  - "Next question in 1 day"

## Troubleshooting

### Module shows "API key required"

**Solution:** You forgot to add your API key or left it as the placeholder.
- Get a free key at [api-ninjas.com](https://api-ninjas.com)
- Add it to your `config.js`

### Module shows "Loading trivia..." forever

**Check:**
1. Verify your API key is correct
2. Check MagicMirror logs: `pm2 logs MagicMirror | grep Trivia`
3. Test your API key manually:
```bash
curl -X GET "https://api.api-ninjas.com/v1/trivia" -H "X-Api-Key: YOUR_KEY"
```

### "New Question" button stays disabled

The button has a cooldown to prevent API spam. It shows the remaining time:
- "wait 45s" means 45 seconds remaining
- Wait for it to change to "New Question"
- Default cooldown: 60 seconds (configurable)

### API usage warning in logs

```
WARNING! Estimated usage exceeds API quota!
```

**Solution:** Your refresh interval is too aggressive for the free tier.
- Change to `"hourly"` mode (720/month = 24% quota)
- Use `"daily"` mode (30/month = 1% quota)
- Increase `customRefreshMinutes` value

### Timer shows "1h 0m" instead of "60 minutes"

This should be fixed in v2.5+. Update to the latest version if you see this.

### Module flashes/flickers when timer updates

This should be fixed in v2.5+. The timer now updates smoothly without refreshing the entire module.

## Changelog

### v2.5 (Latest)
- Added configurable refresh modes (daily/hourly/custom)
- Added smooth countdown timer with per-second updates
- Added manual "New Question" button with cooldown timer
- Improved button labels ("Reveal Answer" instead of arrows)
- Added automatic API usage calculator
- Fixed timer flashing by updating only text elements
- Fixed time formatting (shows "60 minutes" not "1h 0m")

### v2.0
- Switched from web scraping to API Ninjas API
- Reliable daily trivia updates
- Better error handling and caching

### v1.0
- Initial release
- Web scraping implementation
- Basic question/answer toggle

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror) - The amazing smart mirror platform
- [API Ninjas](https://api-ninjas.com) - For providing the free trivia API
- The MagicMirror community for inspiration and support

## Support

If you encounter any issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [Configuration Examples](#configuration-examples)
3. Open an issue on [GitHub](https://github.com/GeeYouEss/MMM-TriviaQOTD/issues)
4. Check MagicMirror logs: `pm2 logs MagicMirror | grep Trivia`

---

**Made with love for the MagicMirror community**

*If you find this module useful, consider giving it a star on GitHub!*
