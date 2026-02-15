/* Magic Mirror Module: MMM-TriviaQOTD
 * Version: 1.0.0
 * Description: Displays daily trivia question with toggle answer
 * Optimized for Raspberry Pi 3B+
 */

Module.register("MMM-TriviaQOTD", {
    defaults: {
        updateInterval: 20000000, // Update every ~5.5 hours (in milliseconds)
        animationSpeed: 1000,
        answerTimeout: 10000, // Auto-hide answer after 10 seconds
        retryDelay: 60000, // Retry after 1 minute if fetch fails
    },

    start: function() {
        this.trivia = null;
        this.showAnswer = false;
        this.answerTimer = null;
        this.loaded = false;
        this.getTriviaQuestion();
        this.scheduleUpdate();
    },

    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "trivia-wrapper";

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

        // Create toggle button
        const toggleButton = document.createElement("div");
        toggleButton.className = "trivia-toggle";
        toggleButton.innerHTML = this.showAnswer ? "↑ Question" : "↓ Answer";
        toggleButton.onclick = () => {
            this.toggleAnswer();
        };

        wrapper.appendChild(contentDiv);
        wrapper.appendChild(toggleButton);

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

    getTriviaQuestion: function() {
        this.sendSocketNotification("GET_TRIVIA");
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getTriviaQuestion();
        }, this.config.updateInterval);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "TRIVIA_RESULT") {
            this.loaded = true;
            if (payload && payload.question) {
                this.trivia = payload;
                this.showAnswer = false;
                
                // Clear answer timer when new question arrives
                if (this.answerTimer) {
                    clearTimeout(this.answerTimer);
                    this.answerTimer = null;
                }
                
                this.updateDom(this.config.animationSpeed);
            }
        } else if (notification === "TRIVIA_ERROR") {
            this.loaded = true;
            this.updateDom(this.config.animationSpeed);
        }
    },
});
