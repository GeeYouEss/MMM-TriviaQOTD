/* Node Helper for MMM-TriviaQOTD
 * Fetches trivia question from Ivy Tech website
 * Optimized for low resource usage on Pi 3B+
 */

const NodeHelper = require("node_helper");
const axios = require("axios");
const cheerio = require("cheerio");

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-TriviaQOTD: Node helper started");
        this.cache = {
            question: null,
            answer: null,
            timestamp: null
        };
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_TRIVIA") {
            this.fetchTrivia();
        }
    },

    fetchTrivia: function() {
        const self = this;
        const url = "https://sites.google.com/ivytech.edu/cae/home/trivia-questions";

        // Check cache (only fetch once per day)
        const now = new Date();
        const today = now.toDateString();
        
        if (this.cache.timestamp === today && this.cache.question) {
            console.log("MMM-TriviaQOTD: Using cached trivia");
            this.sendSocketNotification("TRIVIA_RESULT", {
                question: this.cache.question,
                answer: this.cache.answer
            });
            return;
        }

        console.log("MMM-TriviaQOTD: Fetching from website...");

        axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MagicMirror/1.0)'
            },
            timeout: 15000 // 15 second timeout
        })
        .then(response => {
            const html = response.data;
            const $ = cheerio.load(html);
            
            // Extract the trivia question and answer
            const content = $('body').text();
            
            // Find the QOTD section - more flexible regex
            const qotdMatch = content.match(/Trivia Question of the Day:\s*([^]*?)(?:Answer:|ANSWER:)\s*([^]*?)(?:Previous|PREVIOUS|$)/i);
            
            if (qotdMatch && qotdMatch[1] && qotdMatch[2]) {
                let question = qotdMatch[1].trim();
                let answer = qotdMatch[2].trim();
                
                // Clean up the question and answer (remove extra whitespace)
                question = question.replace(/\s+/g, ' ').trim();
                answer = answer.replace(/\s+/g, ' ').trim();
                
                // Limit answer length to first few sentences if too long
                if (answer.length > 300) {
                    const sentences = answer.match(/[^.!?]+[.!?]+/g);
                    if (sentences && sentences.length > 0) {
                        answer = sentences.slice(0, 2).join(' ').trim();
                    }
                }
                
                // Cache the result
                self.cache = {
                    question: question,
                    answer: answer,
                    timestamp: today
                };
                
                console.log("MMM-TriviaQOTD: Successfully fetched trivia");
                console.log("MMM-TriviaQOTD: Question: " + question.substring(0, 50) + "...");
                
                self.sendSocketNotification("TRIVIA_RESULT", {
                    question: question,
                    answer: answer
                });
            } else {
                console.error("MMM-TriviaQOTD: Could not parse trivia from page");
                console.log("MMM-TriviaQOTD: Content preview: " + content.substring(0, 500));
                
                // Try to send cached data if available
                if (self.cache.question) {
                    console.log("MMM-TriviaQOTD: Using stale cache");
                    self.sendSocketNotification("TRIVIA_RESULT", {
                        question: self.cache.question,
                        answer: self.cache.answer
                    });
                } else {
                    self.sendSocketNotification("TRIVIA_ERROR", "Could not parse trivia content");
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
                    answer: self.cache.answer
                });
            } else {
                self.sendSocketNotification("TRIVIA_ERROR", error.message);
            }
        });
    }
});
