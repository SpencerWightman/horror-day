import templates from "./templates.js";

const generatePrompt = (inputText) => {
  const append = ' The journal entry: ';
  const prepend = ' The story should include ';
  // Check for keywords in inputText
  for (let keyword in templates) {
    if (inputText.toLowerCase().includes(keyword)) {
      return templates['default'] + prepend + templates['keyword'] + append + inputText;
    }
  }

  // If no keywords found
  return templates['default'] + append + inputText;
};

export default generatePrompt;
