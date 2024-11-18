// Toggle the visibility of the chatbot window
document.getElementById("chatbot-toggle").addEventListener("click", () => {
  const chatWindow = document.getElementById("chatbot-window");
  chatWindow.style.display = chatWindow.style.display === "none" ? "block" : "none";
});

// Handle user input and fetch bot response when Enter is pressed
document.getElementById("chatbot-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter" && e.target.value.trim() !== "") {
      const userInput = e.target.value.trim(); // Get user input
      addMessage("user", userInput); // Display user message in the chat
      fetchBotResponse(userInput); // Fetch bot's response from the server
      e.target.value = ""; // Clear input field after sending
  }
});

// Add a message to the chat window (user or bot)
function addMessage(sender, message) {
  const chatMessages = document.getElementById("chatbot-messages");
  const messageDiv = document.createElement("div");
  messageDiv.className = sender; // Set class for user or bot
  messageDiv.textContent = message; // Set the message text
  chatMessages.appendChild(messageDiv); // Append message to chat
  chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
}

// Fetch bot's response from the Flask backend
function fetchBotResponse(userInput) {
  fetch("/get_response", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userInput }) // Send user input to server
  })
      .then((response) => response.json()) // Parse JSON response
      .then((data) => {
          if (data.response) {
              addMessage("bot", data.response); // Display bot's response
          } else if (data.error) {
              addMessage("bot", data.error); // Display error message
          }
      })
      .catch((error) => {
          // In case of an error (e.g., network issue), show a fallback message
          addMessage("bot", "Oops! Something went wrong. Please try again later.");
          console.error("Error fetching bot response:", error); // Log the error in the console
      });
}
