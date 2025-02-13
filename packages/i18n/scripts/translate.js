const { translate } = require("@vitalets/google-translate-api");
const jsonfile = require("jsonfile");
const fs = require("fs");
const readline = require("readline-sync");

// Paths to JSON translation files
const localesPath = __dirname + "/../src/locales/";
const languages = ["en", "ru", "uk"];

// --- STEP 1: User input ---
const section = readline.question("Enter translation section (example: user): ");
const englishText = readline.question("Enter translation for English: ");

// --- STEP 2: Generate unique key in camelCase ---
function generateKey(text) {
  return text
    .replace(/[^a-zA-Z\s]/g, "") // Remove everything except letters and spaces
    .split(" ")
    .map((word, index) =>
      index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join("")
    .slice(0, 20); // Max 20 characters
}

const keyName = generateKey(englishText);
const keyPath = `${section}.${keyName}`;

// --- Highlight key in console ---
//
console.log("\n────────────────────────────────────────");
console.log(`🔑  Generated key: \x1b[32m${keyPath}\x1b[0m`);
console.log("\n────────────────────────────────────────");
console.log(`🔑  Just in case: \x1b[32mconst { t } = useTranslation();\x1b[0m`);
console.log(`🔑  Translate with: \x1b[32m{t('${keyPath}')}\x1b[0m`);
console.log("────────────────────────────────────────\n");

// --- Function to check if key already exists ---
function keyExists(obj, path) {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length; i++) {
    if (!current[keys[i]]) return false;
    current = current[keys[i]];
  }
  return true;
}

// --- Function to set nested key ("user.signUpUsingEmail" → { user: { signUpUsingEmail: "..." } }) ---
function setNestedKey(obj, path, value) {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}; // Create nested objects if they don't exist
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

// --- STEP 3: Update JSON files ---
async function updateTranslations() {
  for (const lang of languages) {
    const filePath = `${localesPath}${lang}.json`;

    // Load existing JSON file
    let translations = {};
    if (fs.existsSync(filePath)) {
      translations = jsonfile.readFileSync(filePath);
    }

    // Check if key already exists
    if (keyExists(translations, keyPath)) {
      console.log(`⚠️ ERROR: Key "\x1b[31m${keyPath}\x1b[0m" already exists in ${lang}.json. Skipping.`);
      return; // Exit if key is already in use
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
