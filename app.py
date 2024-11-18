import openai
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Set OpenAI API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

# Serve the main page (index.html)
@app.route("/")
def index():
    return render_template("index.html")

# Define route for handling chatbot responses
@app.route("/get_response", methods=["POST"])
def get_response():
    user_message = request.json.get("message")
    
    try:
        # Make a call to the OpenAI API
        response = openai.Completion.create(
            engine="text-davinci-003",  # You can change to another engine if needed
            prompt=user_message,
            max_tokens=150
        )
        # Return response to frontend
        return jsonify({"response": response.choices[0].text.strip()})
    
    except openai.error.AuthenticationError:
        print("Authentication error: Please check your API key.")
        return jsonify({"error": "Authentication failed. Please check your API key."}), 401
    except openai.error.RateLimitError:
        print("Rate limit exceeded. Try again later.")
        return jsonify({"error": "Rate limit exceeded. Please try again later."}), 429
    except openai.error.OpenAIError as e:
        print(f"OpenAI API error: {str(e)}")
        return jsonify({"error": f"OpenAI API error: {str(e)}"}), 500
    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
