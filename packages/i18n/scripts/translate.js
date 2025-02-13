const { translate } = require("@vitalets/google-translate-api");
const jsonfile = require("jsonfile");
const fs = require("fs");
const readline = require("readline-sync");

// Paths to JSON translation files
const localesPath = __dirname + "/../src/locales/";
const languages = ["en", "ru", "uk"];

// --- STEP 1: User input ---
const keyPath = readline.question("Enter translation key (example: user.signOut): ");
const englishText = readline.question("Enter translation for English: ");

// --- Function to set nested keys ("user.signOut" → { user: { signOut: "..." } }) ---
function setNestedKey(obj, path, value) {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}; // Create nested objects if they don't exist
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

// --- STEP 2: Update JSON files ---
async function updateTranslations() {
  for (const lang of languages) {
    const filePath = `${localesPath}${lang}.json`;

    // Load existing JSON file
    let translations = {};
    if (fs.existsSync(filePath)) {
      translations = jsonfile.readFileSync(filePath);
    }

    // Check if key already exists
    const keys = keyPath.split(".");
    let current = translations;
    let exists = true;
    for (let i = 0; i < keys.length; i++) {
      if (!current[keys[i]]) {
        exists = false;
        break;
      }
      current = current[keys[i]];
    }

    if (exists) {
      console.log(`🔹 ${lang}.json already contains key "${keyPath}". Skipping.`);
      continue;
    }

    // --- Translate text if language is not English ---
    let translatedValue = englishText;
    if (lang !== "en") {
      try {
        const res = await translate(englishText, { to: lang });
        translatedValue = res.text;
      } catch (error) {
        console.error(`⚠️ Translation error for ${lang}:`, error);
        translatedValue = englishText;
      }
    }

    // --- Add key to JSON ---
    setNestedKey(translations, keyPath, translatedValue);
    jsonfile.writeFileSync(filePath, translations, { spaces: 2 });

    console.log(`✅ Added translation in ${lang}.json: "${keyPath}" → "${translatedValue}"`);
  }
}

// Run script
updateTranslations();
