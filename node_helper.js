/* Node Helper for MMM-TriviaQOTD
 * Fetches trivia questions from API Ninjas
 * Optimized for low resource usage on Pi 3B+
 */

const NodeHelper = require("node_helper");
const axios = require("axios");

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-TriviaQOTD: Node helper started (API Ninjas v2.5)");
        this.cache = {
            question: null,
            answer: null,
            category: null,
            timestamp: null
        };
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_TRIVIA") {
            this.fetchTrivia(payload.apiKey, payload.force || false);
        }
    },

    fetchTrivia: function(apiKey, forceRefresh = false) {
        const self = this;

        // Check cache unless force refresh
        if (!forceRefresh && this.cache.question && this.cache.timestamp) {
            const cacheAge = Date.now() - this.cache.timestamp;
            // If cache is less than 5 minutes old, use it (prevents duplicate calls)
            if (cacheAge < 300000) {
                console.log("MMM-TriviaQOTD: Using recent cache (" + Math.floor(cacheAge/1000) + "s old)");
                this.sendSocketNotification("TRIVIA_RESULT", {
                    question: this.cache.question,
                    answer: this.cache.answer,
                    category: this.cache.category
                });
                return;
            }
        }

        console.log("MMM-TriviaQOTD: Fetching from API Ninjas" + (forceRefresh ? " (forced)" : "") + "...");

        // API Ninjas endpoint for trivia
        const url = "https://api.api-ninjas.com/v1/trivia";

        axios.get(url, {
            headers: {
                'X-Api-Key': apiKey
            },
            timeout: 10000
        })
        .then(response => {
            const data = response.data;
            
            // API returns an array of questions, we'll use the first one
            if (data && data.length > 0) {
                const triviaItem = data[0];
                const question = triviaItem.question;
                const answer = triviaItem.answer;
                const category = triviaItem.category || "General Knowledge";
                
                // Cache the result
                self.cache = {
                    question: question,
                    answer: answer,
                    category: category,
                    timestamp: Date.now()
                };
                
                console.log("MMM-TriviaQOTD: Successfully fetched trivia");
                console.log("MMM-TriviaQOTD: Category: " + category);
                
                self.sendSocketNotification("TRIVIA_RESULT", {
                    question: question,
                    answer: answer,
                    category: category
                });
            } else {
                console.error("MMM-TriviaQOTD: No trivia data in response");
                
                // Use cached data if available
                if (self.cache.question) {
                    console.log("MMM-TriviaQOTD: Using stale cache");
                    self.sendSocketNotification("TRIVIA_RESULT", {
                        question: self.cache.question,
                        answer: self.cache.answer,
                        category: self.cache.category
                    });
                } else {
                    self.sendSocketNotification("TRIVIA_ERROR", "No trivia data available");
                }
            }
        })
        .catch(error => {
            console.error("MMM-TriviaQOTD: Fetch error - " + error.message);
            
            // If we have cached data, send it even if it's old
            if (self.cache.question) {
                console.log("MMM-TriviaQOTD: Using stale cache due to error");
                self.sendSocketNotification("TRIVIA_RESULT", {
                    question: self.cache.question,
                    answer: self.cache.answer,
                    category: self.cache.category
                });
            } else {
                self.sendSocketNotification("TRIVIA_ERROR", error.message);
            }
        });
    }
});
