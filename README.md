# MMM-TriviaQOTD

A Magic Mirror² module that displays the daily trivia question from Ivy Tech's website with an interactive toggle to reveal the answer.

## Features

- 📚 Displays daily trivia question from https://sites.google.com/ivytech.edu/cae/home/trivia-questions
- 🔄 Interactive toggle button to reveal/hide answer
- ⏱️ Auto-hides answer after 10 seconds (configurable)
- 💾 Caches trivia to reduce server load (updates daily)
- 🚀 Optimized for Raspberry Pi 3B+
- 🎨 Clean, minimalist design

## Installation

1. Navigate to your MagicMirror's modules folder:
```bash
cd ~/MagicMirror/modules
```

2. Clone or copy this module:
```bash
# If using git
git clone https://github.com/GeeYouEss/MMM-TriviaQOTD.git

# Or manually copy the folder to ~/MagicMirror/modules/
```

3. Install dependencies:
```bash
cd MMM-TriviaQOTD
npm install
```

## Configuration

Add the module to your `config/config.js` file:

```javascript
{
    module: "MMM-TriviaQOTD",
    position: "bottom_bar", // or any position you prefer
    config: {
        updateInterval: 3600000,  // Update every hour (optional)
        animationSpeed: 1000,     // Animation speed in ms (optional)
        answerTimeout: 10000,     // Auto-hide answer after 10 seconds (optional)
    }
}
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `updateInterval` | How often to check for new trivia (in ms) | `3600000` (1 hour) |
| `animationSpeed` | Animation speed when toggling question/answer (in ms) | `1000` |
| `answerTimeout` | Time before answer auto-hides and shows question again (in ms) | `10000` (10 seconds) |

## Usage

- The module displays the question of the day
- Click the "↓ Answer" button to reveal the answer
- The answer will automatically hide after 10 seconds, or click "↑ Question" to hide it manually
- The trivia updates automatically once per day

## Replacing the Compliments Module

To replace the default "compliments" module in bottom_bar position:

1. Find the compliments module in your `config.js`:
```javascript
{
    module: "compliments",
    position: "bottom_bar"
}
```

2. Comment it out or remove it:
```javascript
// {
//     module: "compliments",
//     position: "bottom_bar"
// }
```

3. Add the MMM-TriviaQOTD module in the same position as shown above

## Troubleshooting

**Module shows "Loading trivia..." forever:**
- Check your internet connection
- Make sure you ran `npm install` in the module directory
- Check the MagicMirror logs: `pm2 logs MagicMirror`

**Module shows "No trivia available":**
- The website might be temporarily unavailable
- Check the MagicMirror logs for error messages

**Answer doesn't auto-hide:**
- Check that `answerTimeout` is set in your config
- Try refreshing your browser or restarting MagicMirror

## License

MIT License

## Credits

Created for the Magic Mirror² platform
Trivia questions sourced from Ivy Tech Community College
