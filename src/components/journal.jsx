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
    <div className="flex flex-col items-center justify-start min-h-screen bg-#b4b4b4 pt-10">
      <div className="text-center">
        <p className="block text-stone-500 font-extrabold py-2.5 px-4 rounded hover:cursor-default">HORRIFY ME</p>
      </div>
      <div className="flex flex-col items-center w-full px-4">
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={handleInputChange}
          maxLength={500}
          className="mt-6 w-full sm:max-w-2xl p-2 border border-gray-300 rounded-md focus:outline-none"
          placeholder="Type your text here..."
          style={{ overflowY: 'hidden', resize: 'none' }}
        />
        <p className="mt-2">{inputText.length}/500</p>
        <button 
          onClick={handleSubmit}
          className="mt-4 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          HORRIFY
        </button>
      </div>
    </div>
  )
};

export default Journal;
