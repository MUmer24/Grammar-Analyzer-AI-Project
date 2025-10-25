
// const API_KEY = "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";
// ------------------------------------------------------------------
// 1. TAILWIND CONFIG (Your existing code)
// ------------------------------------------------------------------
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#137fec",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "success": "#28a745", // Green for positive/correct
        "warning": "#dc3545", // Red for negative/incorrect
        "suggestion": "#ffc107", // Yellow for neutral/suggestion
      },
      fontFamily: {
        "display": ["Inter", "sans-serif"]
      },
      borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px" },
    },
  },
};

// ------------------------------------------------------------------
// 2. HUGGING FACE API CONFIG (TWO MODELS)
// ------------------------------------------------------------------

// ❗️❗️ PASTE YOUR HUGGING FACE KEY HERE ❗️❗️
const API_KEY = "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";

// Model 1: Grammar Checker
const GRAMMAR_MODEL_URL = "https://api-inference.huggingface.co/models/abdulmatinomotoso/English_Grammar_Checker";

// Model 2: Sentiment Analysis (from your screenshot)
const SENTIMENT_MODEL_URL = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";


// ------------------------------------------------------------------
// 3. MAIN SCRIPT
// ------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {

  // --- Get UI Elements ---
  const textInput = document.getElementById('text-input');
  const wordCountDisplay = document.getElementById('word-count');
  const clearButton = document.getElementById('clear-button');
  const checkButton = document.getElementById('check-button'); 
  const loadingSpinner = document.querySelector('.flex.w-full.flex-col.items-center.gap-4.py-8');
  const resultsSection = document.getElementById('results-section');


  // --- Word Count & Clear Functions (Your existing code) ---
  function updateWordCount() {
    const text = textInput.value;
    let wordCount = 0;
    const trimmedText = text.trim();
    if (trimmedText.length > 0) {
      wordCount = trimmedText.split(/\s+/).length;
    }
    wordCountDisplay.textContent = `${wordCount}/300 words`;
  }

  function clearText() {
    textInput.value = '';
    updateWordCount();
    resultsSection.innerHTML = ''; // Clear results
    if (loadingSpinner) {
      loadingSpinner.classList.add('hidden');
    }
  }

  // --- Add Event Listeners ---
  if (textInput) {
    textInput.addEventListener('input', updateWordCount);
  }
  if (clearButton) {
    clearButton.addEventListener('click', clearText);
  }

  // --- Main Button Event Listener ---
  if (checkButton) {
    checkButton.addEventListener('click', () => {
      const text = textInput.value;
      if (text.trim() === "") {
        showError("Please enter some text to check.");
        return;
      }
      // This new function will call both models
      runFullAnalysis(text); 
    });
  }

  // --- NEW: Helper function to call a single model ---
  // This helps avoid repeating the fetch logic
  async function queryModel(modelUrl, text) {
    const response = await fetch(
      modelUrl,
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`, 
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: text }), 
      }
    );

    if (!response.ok) {
      let errorBody;
      try {
          errorBody = await response.json();
      } catch (e) {
          throw new Error(`API request failed: ${response.statusText}`);
      }
      
      if (errorBody.error && errorBody.estimated_time) {
        throw new Error(`Model (${modelUrl.split("/").pop()}) is loading. Please try again in ${Math.ceil(errorBody.estimated_time)} seconds.`);
      } else if (errorBody.error) {
        throw new Error(`API Error: ${errorBody.error}`);
      } else {
        throw new Error(`API request failed: ${response.statusText}`);
      }
    }

    const result = await response.json();

    // Check for valid result structure
    if (result && result.length > 0 && result[0].length > 0) {
      return result[0]; // This is the array of scores
    } else {
      throw new Error("Invalid response structure from API.");
    }
  }


  // --- UPDATED: Main analysis function ---
  async function runFullAnalysis(text) {
    // 1. Show loading spinner and disable button
    if (loadingSpinner) {
        loadingSpinner.classList.remove('hidden');
    }
    resultsSection.innerHTML = ''; // Clear old results
    checkButton.disabled = true;

    try {
      // 2. Call both models at the same time
      // Promise.all waits for both to finish
      const [grammarResult, sentimentResult] = await Promise.all([
        queryModel(GRAMMAR_MODEL_URL, text),
        queryModel(SENTIMENT_MODEL_URL, text)
      ]);
      
      console.log("Grammar Result:", grammarResult);
      console.log("Sentiment Result:", sentimentResult);

      // 3. Show both results
      displayFullResults(grammarResult, sentimentResult);

    } catch (error) {
      // 4. Show any errors
      console.error("Full error object:", error);
      showError(error.message);
    } finally {
      // 5. Hide loading spinner and re-enable button
      if (loadingSpinner) {
        loadingSpinner.classList.add('hidden');
      }
      checkButton.disabled = false;
    }
  }

  // --- NEW: Function to display BOTH results ---
  function displayFullResults(grammarScores, sentimentScores) {
    resultsSection.innerHTML = `
      <!-- Title for the whole section -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 class="text-2xl font-bold tracking-[-0.015em] text-[#111418] dark:text-white">Analysis Results</h2>
      </div>

      <!-- Grid layout for the two cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        ${buildGrammarCard(grammarScores)}
        ${buildSentimentCard(sentimentScores)}
      </div>
    `;
  }

  // --- NEW: Helper function to build the Grammar Card ---
  function buildGrammarCard(scores) {
    let bestResult = scores.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    const label = bestResult.label;
    const confidence = (bestResult.score * 100).toFixed(0);

    let title, message, borderColor, spanText, spanColor;

    // LABEL_1 = Correct, LABEL_0 = Incorrect
    if (label === 'LABEL_1') {
      title = "Grammar Analysis ✅";
      spanText = "Correct";
      spanColor = "text-success";
      borderColor = "border-success/50 dark:border-success/40";
      if (confidence >= 95) message = `Excellent! The AI is ${confidence}% certain your grammar is perfect.`;
      else if (confidence >= 75) message = `Nice job. The AI is ${confidence}% confident this is correct.`;
      else message = `The AI is ${confidence}% confident this is correct, but it's not 100% sure.`;
    } else {
      title = "Grammar Analysis ⚠️";
      spanText = "Incorrect";
      spanColor = "text-warning";
      borderColor = "border-warning/50 dark:border-warning/40";
      if (confidence >= 95) message = `Whoops! The AI is ${confidence}% sure it found an error.`;
      else if (confidence >= 75) message = `The AI is ${confidence}% confident there's a mistake.`;
      else message = `The AI is only ${confidence}% confident, but it's leaning towards this being incorrect.`;
    }

    return `
      <div class="w-full rounded-xl border ${borderColor} bg-white dark:bg-gray-800 p-6 shadow-sm flex flex-col gap-3">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-lg text-[#111418] dark:text-white">${title}</h3>
          <span class="font-semibold text-sm ${spanColor}">(${spanText} - ${confidence}%)</span>
        </div>
        <p class="text-base leading-relaxed text-gray-700 dark:text-gray-300">${message}</p>
      </div>
    `;
  }

  // --- NEW: Helper function to build the Sentiment Card ---
  function buildSentimentCard(scores) {
    let bestResult = scores.reduce((prev, current) => (prev.score > current.score) ? prev : current);
    const label = bestResult.label.toUpperCase(); // e.g., "POSITIVE", "NEGATIVE"
    const confidence = (bestResult.score * 100).toFixed(0);

    let title, message, borderColor, spanText, spanColor, icon;

    if (label === 'POSITIVE') {
      title = "Sentiment Analysis 😊";
      spanText = "Positive";
      spanColor = "text-success";
      borderColor = "border-success/50 dark:border-success/40";
      if (confidence >= 95) message = `This text is very positive! (AI is ${confidence}% confident).`;
      else message = `This text has a positive tone. (AI is ${confidence}% confident).`;
    } else if (label === 'NEGATIVE') {
      title = "Sentiment Analysis ☹️";
      spanText = "Negative";
      spanColor = "text-warning";
      borderColor = "border-warning/50 dark:border-warning/40";
      if (confidence >= 95) message = `This text seems very negative. (AI is ${confidence}% confident).`;
      else message = `This text has a negative tone. (AI is ${confidence}% confident).`;
    } else { // Handle NEUTRAL or other labels
      title = "Sentiment Analysis 😐";
      spanText = "Neutral";
      spanColor = "text-suggestion"; // Using your yellow color
      borderColor = "border-suggestion/60 dark:border-suggestion/50";
      message = `This text seems neutral in tone. (AI is ${confidence}% confident).`;
    }

    return `
      <div class="w-full rounded-xl border ${borderColor} bg-white dark:bg-gray-800 p-6 shadow-sm flex flex-col gap-3">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-lg text-[#111418] dark:text-white">${title}</h3>
          <span class="font-semibold text-sm ${spanColor}">(${spanText} - ${confidence}%)</span>
        </div>
        <p class="text-base leading-relaxed text-gray-700 dark:text-gray-300">${message}</p>
      </div>
    `;
  }


  // --- Helper function for showing errors ---
  function showError(message) {
    resultsSection.innerHTML = `
      <div class="w-full rounded-xl border border-warning/50 dark:border-warning/40 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 class="font-bold text-base text-warning">An Error Occurred</h3>
        <p class="text-gray-600 dark:text-gray-300 text-sm mt-2">${message}</p>
      </div>
    `;
    // Also hide loading spinner if an error occurs
    if (loadingSpinner) {
      loadingSpinner.classList.add('hidden');
    }
  }

});




