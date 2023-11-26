import templates from "./templates.js";

const generatePrompt = (inputText) => {
  const append = ' The journal entry: ';
  const prepend = ' Your story should include ';

  const words = inputText.toLowerCase().split(/\b/); // Split inputText on word boundaries
  for (const word of words) {
    if (templates.hasOwnProperty(word)) {
      return templates['default'] + prepend + templates[word] + append + inputText;
    }
  }

  // If no keywords found
  return templates['default'] + append + inputText;
};

export default generatePrompt;
