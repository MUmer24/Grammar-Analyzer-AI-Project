# AI Grammar Checker

## Visit my site at:
https://mumer24.github.io/Grammar-Analyzer-AI-Project/

A clean, simple, and responsive web application that uses a Hugging Face AI model to perform basic grammar and style analysis on user-provided text.

<img width="1296" height="664" alt="image" src="https://github.com/user-attachments/assets/6f12a17f-061b-4902-b258-38755413772a" />


## 📝 Overview

This project is a lightweight, front-end-only application designed to check text for grammatical correctness. It provides a "Correct" or "Incorrect" analysis along with a confidence score from the AI model. It's built with modern, CDN-driven tools (Tailwind CSS, Google Fonts) and vanilla JavaScript, making it incredibly easy to deploy and maintain.

## ✨ Features

* **AI-Powered Analysis:** Connects directly to the Hugging Face Inference API to analyze text using the `abdulmatinomotoso/English_Grammar_Checker` model.
* **Clean & Simple UI:** A minimal, distraction-free interface for users to paste and check their text.
* **Responsive Design:** Looks great on all devices, from mobile phones to desktops.
* **Dark Mode:** Includes a pre-configured dark mode that respects system preferences (or can be toggled).
* **Real-time Word Count:** Provides immediate feedback on the number of words, with a soft limit of 300.
* **Clear Feedback:** Displays results (Correct/Incorrect), a confidence score, and user-friendly messages.
* **Loading & Error States:** Includes a loading spinner during analysis and provides clear, actionable error messages (e.g., if the AI model is loading or an API error occurs).

## 🚀 How to Use

1.  Open the deployed website.
2.  Type or paste your text (up to 300 words) into the text area.
3.  Click the **"Check Grammar"** button.
4.  Wait for the AI to analyze the text.
5.  View the results below the button, which will indicate if the text is "Correct" or "Incorrect" along with a confidence percentage.

## 🛠️ Running Locally

Because this project uses the `fetch` API to communicate with an external service (Hugging Face), you cannot run it by simply opening the `index.html` file in your browser due to **CORS (Cross-Origin Resource Sharing) policies**.

You must run it from a local web server. Here's the easiest way:

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/MUmer24/Grammar-Analyzer-AI-Project.git](https://github.com/MUmer24/Grammar-Analyzer-AI-Project.git)
    cd YOUR_REPOSITORY
    ```

2.  **Configure Your API Key:**
    * Sign up for a [Hugging Face](https://huggingface.co/) account.
    * Go to your profile settings and create an **API Key** (Access Token) with `read` permissions.
    * Open the `script.js` file.
    * Find the line `const API_KEY = "hf_...";` and replace the placeholder key with your own.

    ```javascript
    // ❗️❗️ PASTE YOUR HUGGING FACE KEY HERE ❗️❗️
    const API_KEY = "hf_YOUR_ACTUAL_API_KEY_GOES_HERE"; 
    ```

3.  **Start a Local Server:**
    If you have Python installed, this is the simplest method:

    ```bash
    # For Python 3
    python -m http.server
    
    # For Python 2
    python -m SimpleHTTPServer
    ```
    
    Alternatively, you can use the **Live Server** extension in VS Code, which will handle this for you with a single click.

4.  **View the App:**
    Open your browser and navigate to `http://localhost:8000` (or the port specified by your server).

## 🔐 A Note on Security: API Key Exposure

This project is designed as a simple demo and places the Hugging Face API key directly in the client-side JavaScript file (`script.js`).

**⚠️ IMPORTANT:** This is **not secure** for a public-facing, production application. Anyone can view your browser's network requests or the source code to find and steal your API key.

For a real-world application, you should **never** expose your API key on the client side. The proper solution is to create a simple backend (e.g., a serverless function on Vercel, Netlify, or AWS Lambda) that acts as a proxy:

1.  The client (your `script.js`) sends the text to your backend endpoint.
2.  Your backend (where your API key is securely stored as an environment variable) receives the text.
3.  Your backend makes the request to the Hugging Face API.
4.  Your backend receives the response from Hugging Face and forwards it back to your client.

## 💻 Technologies Used

* **HTML5:** Semantic structure for the application.
* **Tailwind CSS:** For all styling and responsive design, loaded via CDN.
* **Vanilla JavaScript (ES6+):** For all application logic, including DOM manipulation, event handling, and API calls.
* **Hugging Face Inference API:** Powers the AI grammar analysis.
* **Google Fonts:** (Inter) For clean, modern typography.
* **Material Symbols:** For icons.

## 📂 Project Structure
