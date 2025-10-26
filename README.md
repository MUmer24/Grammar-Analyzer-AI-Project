# AI Grammar Checker

## Visit my site at:
[https://grammar-analyzer-ai-project.vercel.app/](https://grammar-analyzer-ai-project.vercel.app/)

A clean, secure, and responsive web application that uses a serverless backend to safely perform grammar and style analysis with a Hugging Face AI model.

<img width="1296" height="664" alt="image" src="https://github.com/user-attachments/assets/6f12a17f-061b-4902-b258-38755413772a" />


## 📝 Overview

This project is a full-stack (front-end + serverless backend) application designed to check text for grammatical correctness. It provides a "Correct" or "Incorrect" analysis along with a confidence score from the AI model.

The front-end is built with clean HTML, Tailwind CSS, and vanilla JavaScript. The backend is a **secure serverless function** (running on Vercel) that acts as a proxy to protect the Hugging Face API key.

## ✨ Features
* **Secure API Key:** The Hugging Face API key is never exposed to the browser. It is stored securely as an environment variable on the server.
* **AI-Powered Analysis:** Connects directly to the Hugging Face Inference API to analyze text using the `abdulmatinomotoso/English_Grammar_Checker` model via a secure backend proxy.
* **Clean & Simple UI:** A minimal, distraction-free interface for users to paste and check their text.
* **Responsive Design:** Looks great on all devices, from mobile phones to desktops.
* **Real-time Word Count:** Provides immediate feedback on the number of words, with a soft limit of 300.
* **Clear Feedback:** Displays results (Correct/Incorrect), a confidence score, and user-friendly messages.
* **Loading & Error States:** Includes a loading spinner and forwards clear error messages from the API (e.g., "Model is loading...").

## 🚀 How to Use

From a user's perspective, the application works just as before:
1.  Open the deployed website.
2.  Type or paste your text (up to 300 words) into the text area.
3.  Click the **"Check Grammar"** button.
4.  Wait for the AI to analyze the text.
5.  View the results below the button, which will indicate if the text is "Correct" or "Incorrect" along with a confidence percentage.

## 🛠️ Deploying Your Own

This project is designed for an easy and secure deployment on platforms like Vercel or Netlify.

**Step 1: Push to GitHub**
1. Make sure your project is a Git repository.
2. Create a new repository on GitHub.
3. Add, commit, and push your code (including the `api/check.js` file) to your GitHub repository.

**Step 2: Deploy on Vercel**
1. **Sign up:** Go to [vercel.com](https://vercel.com/) and sign up using your GitHub account.
2. **Import Project:** On your Vercel dashboard, click "Add New... > Project" and select your new GitHub repository.
3. **Configure Project:** Vercel will automatically detect your static front-end and the `api` folder. You don't need to change any build settings.
4. **Add Environment Variable (Most Important Step):**
    * Before deploying, expand the "Environment Variables" section.
    * Add a new variable:
        * **Name:** `HUGGING_FACE_API_KEY`
        * **Value:** `hf_YOUR_SECRET_KEY_GOES_HERE`
    * Click "Add" to save the variable.
5. **Deploy:** Click the "Deploy" button.

Vercel will build and deploy your site. Your application is now live, and your API key is secure!

## 🛠️ Running Locally

To run this project locally, you can no longer just use a simple Python server because you need to simulate the serverless function environment. The **Vercel CLI** is the best tool for this.

1.  **Install the Vercel CLI:**
    ```bash
    npm install -g vercel
    ```

2.  **Create an Environment File:**
    * In the root of your project, create a new file named `.env`
    * Add your API key to this file:
    ```
    HUGGING_FACE_API_KEY="hf_YOUR_SECRET_KEY_GOES_HERE"
    ```
_(Note: Make sure to add .env to your .gitignore file so you don't accidentally commit your key!)_

3.  **Run a Local Server:**
   * Open your terminal in the project's root folder.
   * Run the following command:

    ```bash
    vercel dev
    ```
    
This command starts a local development server (like `http://localhost:3000`) that runs your front-end and your serverless function in `api/check.js` exactly as it would on Vercel, securely loading your API key from the `.env` file.

## 🔐 Security Model

This project's security relies on a **backend proxy** pattern:
1. **Client:** The browser (running `script.js`) sends the user's text to our own backend endpoint (`/api/check`).
2. **Serverless Function:** The `api/check.js` function (running on Vercel) receives this request. It's the only part of the system that can access the secret `HUGGING_FACE_API_KEY` from its environment variables.
3. **Hugging Face:** The serverless function then makes the call to the Hugging Face API, adding the secret key.
4. **Response:** The function gets the result from Hugging Face and passes it back to the client.

The secret API key never leaves the Vercel server, making it invisible to users.

## 💻 Technologies Used

* **HTML5:** Semantic structure for the application.
* **Tailwind CSS:** For all styling and responsive design, loaded via CDN.
* **Vanilla JavaScript (ES6+):** For all application logic, including DOM manipulation, event handling, and API calls.
* **Node.js / Serverless Functions:** For the secure backend proxy.
* **Hugging Face Inference API:** Powers the AI grammar analysis.
* **Google Fonts:** (Inter) For clean, modern typography.
* **Material Symbols:** For icons.
* **Vercel:** For deployment and local development.

**📂 Project Structure**

```
.
├── api/
│   └── check.js       # The (Node.js) serverless backend function
│
├── index.html       # The main HTML file
├── script.js        # Client-side JavaScript (no API key!)
├── style.css        # Minimal custom CSS
└── README.md        # You are here!
```
