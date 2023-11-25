import { useState, useRef, useEffect } from 'react';
import OpenAI from "openai";
import templates from "../utils/templates.js"

const Journal = () => {
  const [inputText, setInputText] = useState('');
  const [LLMText, setLLMText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  // Adjust the height of the textarea to fit the content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to recalculate
      textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
    }
  }, [inputText]);

  const generatePrompt = (inputText) => {
    const append = ' The journal entry: ';
    const prepend = ' The story should include ';
    // Check for keywords in inputText
    for (let keyword in templates) {
      if (inputText.toLowerCase().includes(keyword)) {
        return templates['default'] + prepend + templates['keyword'] + append + inputText;
      }
    }

    // Default template if no keywords found
    return templates['default'] + append + inputText;
  };

  const handleSubmit = async () => {
    console.log('HANDLE SUBMIT');
    setIsLoading(true);
    const prompt = generatePrompt(inputText);
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI,
      dangerouslyAllowBrowser: true
    });
    try {
      console.log('TRY');
      const response = await openai.chat.completions.create({
        messages: [
          {"role": "system", "content": prompt},
          {"role": "user", "content": inputText}
        ],
        model: "gpt-4-1106-preview",
      });
  
      const data = response.choices[0].message.content
      setLLMText(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('OpenAI API error: ', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-#b4b4b4 mt-40">
      <div className="flex flex-col items-center w-full px-4">
        {isLoading || !LLMText ? (
          <>
            <textarea
              autoFocus
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              maxLength={500}
              className="mt-6 sm:max-w-2xl lg:max-w-4xl p-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Your journal entry..."
              style={{ overflowY: 'hidden', resize: 'none' }}
            />
            <p className="mt-2 py-2.5 font-extrabold">{inputText.length}/500</p>
            <button 
              onClick={handleSubmit}
              className="mt-2 bg-black block text-stone-300 font-extrabold py-2.5 px-4 rounded transition duration-200 hover:bg-red-800"
            >
              HORRIFY
            </button>
          </>
        ) : (
          <div style={{ color: 'white', backgroundColor: 'black', padding: '20px', marginTop: '20px' }}>
            {LLMText}
          </div>
        )}
      </div>
    </div>
  );  
};

export default Journal;
