import { useState, useRef, useEffect } from 'react';
// import { Configuration, OpenAIApi } from "openai";

const Journal = () => {
  const [inputText, setInputText] = useState('');
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

  const handleSubmit = async () => {
    // const configuration = new Configuration({
    //   apiKey: import.meta.env.VITE_OPENAI
    // });
    // const openai = new OpenAIApi(configuration);
    // try {
    //   const response = await openai.listEngines();
  
    //   if (!response.ok) {
    //     throw new Error('OpenAI API response was not in 200 range');
    //   }
  
    //   // Handle the response data
    //   const data = await response.json();
    //   console.log(data);
    // } catch (error) {
    //   console.error('OpenAI API error: ', error);
    // }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-#b4b4b4 mt-40">
      <div className="flex flex-col items-center w-full px-4">
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
      </div>
    </div>
  )
};

export default Journal;
