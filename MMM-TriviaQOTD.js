/* Magic Mirror Module: MMM-TriviaQOTD
 * Version: 2.5.0
 * Description: Displays trivia questions with configurable refresh, timer, and on-demand fetching
 * Optimized for Raspberry Pi 3B+
 */

Module.register("MMM-TriviaQOTD", {
    defaults: {
        apiKey: "", // API Ninjas API key (REQUIRED)
        questionRefreshMode: "hourly", // "daily", "hourly", or "custom"
        customRefreshMinutes: 60, // Only used if mode is "custom"
        animationSpeed: 1000,
        answerTimeout: 10000, // Auto-hide answer after 10 seconds
        showTimer: true, // Show countdown to next question
        allowManualRefresh: true, // Show "New Question" button
        manualRefreshCooldown: 60000, // Prevent spam (1 minute cooldown)
    },

    start: function() {
        this.trivia = null;
        this.showAnswer = false;
        this.answerTimer = null;
        this.loaded = false;
        this.lastFetchTime = null;
        this.nextFetchTime = null;
        this.lastManualFetch = null;
        this.timerInterval = null;
        this.timeUntilNext = "";
        
        // Validate API key
        if (!this.config.apiKey || this.config.apiKey === "") {
            console.error("MMM-TriviaQOTD: API key is required! Get one at https://api-ninjas.com");
            this.loaded = true;
            return;
        }
        
        // Calculate refresh interval in milliseconds
        this.refreshInterval = this.getRefreshInterval();
        
        // Log API usage estimate
        this.logApiUsage();
        
        this.getTriviaQuestion();
        this.scheduleUpdate();
        this.startTimerUpdate();
    },

    getRefreshInterval: function() {
        switch(this.config.questionRefreshMode) {
            case "daily":
                return 24 * 60 * 60 * 1000; // 24 hours
            case "hourly":
                return 60 * 60 * 1000; // 1 hour
            case "custom":
                return this.config.customRefreshMinutes * 60 * 1000;
            default:
                return 60 * 60 * 1000; // Default to hourly
        }
    },

    logApiUsage: function() {
        const callsPerDay = Math.ceil((24 * 60 * 60 * 1000) / this.refreshInterval);
        const callsPerMonth = callsPerDay * 30;
        const quotaPercent = (callsPerMonth / 3000 * 100).toFixed(1);
        
        console.log("MMM-TriviaQOTD: Refresh mode = " + this.config.questionRefreshMode);
        console.log("MMM-TriviaQOTD: Estimated API usage = " + callsPerMonth + "/month (" + quotaPercent + "% of 3,000 quota)");
        
        if (callsPerMonth > 3000) {
            console.warn("MMM-TriviaQOTD: WARNING! Estimated usage exceeds API quota!");
        }
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "trivia-wrapper";

        // Check for API key
        if (!this.config.apiKey || this.config.apiKey === "") {
            wrapper.innerHTML = "API key required";
            wrapper.className += " dimmed light small";
            const link = document.createElement("div");
            link.style.fontSize = "14px";
            link.style.marginTop = "5px";
            link.innerHTML = "Get free key at api-ninjas.com";
            wrapper.appendChild(link);
            return wrapper;
        }

        if (!this.loaded) {
            wrapper.innerHTML = "Loading trivia...";
            wrapper.className += " dimmed light small";
            return wrapper;
        }

        if (!this.trivia || !this.trivia.question) {
            wrapper.innerHTML = "No trivia available";
            wrapper.className += " dimmed light small";
            return wrapper;
        }

        // Create question/answer container
        const contentDiv = document.createElement("div");
        contentDiv.className = "trivia-content";

        const textDiv = document.createElement("div");
        textDiv.className = "trivia-text";
        textDiv.innerHTML = this.showAnswer ? this.trivia.answer : this.trivia.question;

        contentDiv.appendChild(textDiv);

        // Create button container
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "trivia-buttons";

        // Create toggle answer button
        const toggleButton = document.createElement("div");
        toggleButton.className = "trivia-toggle";
        toggleButton.innerHTML = this.showAnswer ? "Show Question" : "Reveal Answer";
        toggleButton.onclick = () => {
            this.toggleAnswer();
        };
        buttonContainer.appendChild(toggleButton);

        // Create "New Question" button if enabled
        if (this.config.allowManualRefresh) {
            const newQuestionButton = document.createElement("div");
            newQuestionButton.className = "trivia-new-question";
            
            // Check if on cooldown
            const onCooldown = this.isOnCooldown();
            if (onCooldown && this.lastManualFetch) {
                const timeSince = Date.now() - this.lastManualFetch;
                const timeLeft = this.config.manualRefreshCooldown - timeSince;
                const secondsLeft = Math.ceil(timeLeft / 1000);
                
                newQuestionButton.className += " disabled";
                
                if (secondsLeft > 60) {
                    const minsLeft = Math.ceil(secondsLeft / 60);
                    newQuestionButton.innerHTML = "wait " + minsLeft + " min" + (minsLeft > 1 ? "s" : "");
                } else {
                    newQuestionButton.innerHTML = "wait " + secondsLeft + "s";
                }
            } else {
                newQuestionButton.innerHTML = "New Question";
                newQuestionButton.onclick = () => {
                    this.manualRefresh();
                };
            }
            
            buttonContainer.appendChild(newQuestionButton);
        }

        wrapper.appendChild(contentDiv);
        wrapper.appendChild(buttonContainer);

        // Create timer display if enabled
        if (this.config.showTimer && this.timeUntilNext) {
            const timerDiv = document.createElement("div");
            timerDiv.className = "trivia-timer";
            timerDiv.innerHTML = "Next question in " + this.timeUntilNext;
            wrapper.appendChild(timerDiv);
        }

        return wrapper;
    },

    getScripts: function() {
        return [];
    },

    getStyles: function() {
        return ["MMM-TriviaQOTD.css"];
    },

    toggleAnswer: function() {
        this.showAnswer = !this.showAnswer;
        this.updateDom(this.config.animationSpeed);

        // Clear existing timer
        if (this.answerTimer) {
            clearTimeout(this.answerTimer);
            this.answerTimer = null;
        }

        // If showing answer, set timer to auto-hide
        if (this.showAnswer) {
            this.answerTimer = setTimeout(() => {
                this.showAnswer = false;
                this.updateDom(this.config.animationSpeed);
                this.answerTimer = null;
            }, this.config.answerTimeout);
        }
    },

    isOnCooldown: function() {
        if (!this.lastManualFetch) return false;
        const timeSince = Date.now() - this.lastManualFetch;
        return timeSince < this.config.manualRefreshCooldown;
    },

    manualRefresh: function() {
        if (this.isOnCooldown()) {
            console.log("MMM-TriviaQOTD: Manual refresh on cooldown");
            return;
        }
        
        console.log("MMM-TriviaQOTD: Manual refresh triggered");
        this.lastManualFetch = Date.now();
        this.getTriviaQuestion(true); // Force fetch, ignore cache
        this.updateDom(this.config.animationSpeed);
    },

    getTriviaQuestion: function(force = false) {
        this.sendSocketNotification("GET_TRIVIA", {
            apiKey: this.config.apiKey,
            force: force
        });
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getTriviaQuestion();
        }, this.refreshInterval);
    },

    startTimerUpdate: function() {
        // Update timer every second for smooth countdown
        this.updateTimer();
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
        
        // Also update cooldown button every second
        this.cooldownInterval = setInterval(() => {
            this.updateCooldownButton();
        }, 1000);
    },

    updateTimer: function() {
        if (!this.nextFetchTime) return;
        
        const now = Date.now();
        const timeLeft = this.nextFetchTime - now;
        
        if (timeLeft <= 0) {
            this.timeUntilNext = "refreshing...";
        } else {
            const totalMinutes = Math.floor(timeLeft / 60000);
            const hours = Math.floor(totalMinutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) {
                this.timeUntilNext = days + " day" + (days > 1 ? "s" : "");
            } else if (hours >= 2) {
                // Only show hours if 2 or more
                const remainingMins = totalMinutes % 60;
                this.timeUntilNext = hours + "h " + remainingMins + "m";
            } else {
                // Show total minutes if less than 2 hours
                this.timeUntilNext = totalMinutes + " minute" + (totalMinutes !== 1 ? "s" : "");
            }
        }
        
        // Update just the timer element, not the whole DOM
        this.updateTimerElement();
    },

    updateTimerElement: function() {
        if (!this.config.showTimer) return;
        
        const timerElement = document.querySelector(".MMM-TriviaQOTD .trivia-timer");
        if (timerElement && this.timeUntilNext) {
            timerElement.innerHTML = "Next question in " + this.timeUntilNext;
        }
    },

    updateCooldownButton: function() {
        if (!this.config.allowManualRefresh) return;
        
        const button = document.querySelector(".MMM-TriviaQOTD .trivia-new-question");
        if (!button) return;
        
        const onCooldown = this.isOnCooldown();
        
        if (onCooldown && this.lastManualFetch) {
            const timeSince = Date.now() - this.lastManualFetch;
            const timeLeft = this.config.manualRefreshCooldown - timeSince;
            const secondsLeft = Math.ceil(timeLeft / 1000);
            
            button.className = "trivia-new-question disabled";
            
            if (secondsLeft > 60) {
                const minsLeft = Math.ceil(secondsLeft / 60);
                button.innerHTML = "wait " + minsLeft + " min" + (minsLeft > 1 ? "s" : "");
            } else {
                button.innerHTML = "wait " + secondsLeft + "s";
            }
        } else if (!onCooldown && button.classList.contains("disabled")) {
            // Cooldown just finished, re-enable button
            button.className = "trivia-new-question";
            button.innerHTML = "New Question";
            button.onclick = () => {
                this.manualRefresh();
            };
        }
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "TRIVIA_RESULT") {
            this.loaded = true;
            if (payload && payload.question) {
                this.trivia = payload;
                this.showAnswer = false;
                this.lastFetchTime = Date.now();
                this.nextFetchTime = this.lastFetchTime + this.refreshInterval;
                
                // Clear answer timer when new question arrives
                if (this.answerTimer) {
                    clearTimeout(this.answerTimer);
                    this.answerTimer = null;
                }
                
                this.updateTimer();
                this.updateDom(this.config.animationSpeed);
            }
        } else if (notification === "TRIVIA_ERROR") {
            this.loaded = true;
            this.updateDom(this.config.animationSpeed);
        }
    },

    suspend: function() {
        // Clean up intervals when module is hidden
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        if (this.cooldownInterval) {
            clearInterval(this.cooldownInterval);
        }
    },

    resume: function() {
        // Restart intervals when module is shown again
        this.startTimerUpdate();
    },
});
