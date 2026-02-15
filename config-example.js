// Example configuration for MMM-TriviaQOTD
// Add this to your config/config.js file in the modules array

{
    module: "MMM-TriviaQOTD",
    position: "bottom_bar", // Replaces the compliments module
    config: {
        // Optional: Update check interval (default: 1 hour)
        updateInterval: 3600000,
        
        // Optional: Animation speed (default: 1 second)
        animationSpeed: 1000,
        
        // Optional: Auto-hide answer timeout (default: 10 seconds)
        answerTimeout: 10000,
    }
}

// Don't forget to comment out or remove the compliments module:
/*
{
    module: "compliments",
    position: "bottom_bar"
}
*/
