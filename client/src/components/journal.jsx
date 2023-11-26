import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import formatTime from "../utils/format-time.js";

const timer = 30 // 86400 for 24hrs

const Journal = () => {
  const [inputText, setInputText] = useState('');
  const [LLMText, setLLMText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const [countdownTime, setCountdownTime] = useState(timer);

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

  useEffect(() => {
    const storedText = localStorage.getItem('LLMText');
    const storedTime = localStorage.getItem('countdownTime');
    if (storedText) {
      setLLMText(storedText);
    }
    if (storedTime) {
      setCountdownTime(parseInt(storedTime, 10));
    }
  }, []);

  useEffect(() => {
    // Store LLMText and countdownTime in localStorage
    localStorage.setItem('LLMText', LLMText);
    localStorage.setItem('countdownTime', countdownTime.toString());

    // Clear the stored values when timer hits 0
    if (countdownTime === 0) {
      localStorage.removeItem('LLMText');
      localStorage.removeItem('countdownTime');
    }
  }, [LLMText, countdownTime]);

  useEffect(() => {
    if (countdownTime > 0 && !isLoading && LLMText) {
      const timerId = setTimeout(() => {
        setCountdownTime(countdownTime - 1);
      }, 1000);
  
      return () => clearTimeout(timerId);
    } else if (countdownTime === 0) {
      setLLMText(''); // Reset LLMText when timer hits zero
      setInputText('');
      localStorage.removeItem('LLMText');
      localStorage.removeItem('countdownTime');
    }
  }, [countdownTime, isLoading, LLMText]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios({
        method: 'post',
        url: '/horrify',
        data: {
          inputText
        }
      });
      setLLMText(response.data);
      setIsLoading(false);

      // Reset timer on new submission
      setCountdownTime(timer);
    } catch (error) {
      setIsLoading(false);
      console.error('API error: ', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-#b4b4b4">
        {isLoading ? (
          <div className="flex justify-center items-center" style={{flex: 1}}>
            <div className="spinner"></div>
          </div>
        ) : !LLMText ? (
          <>
            {/* User input content */}
            <textarea
              autoFocus
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              maxLength={500}
              className="mt-20 sm:max-w-2xl lg:max-w-4xl p-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Your journal entry..."
              style={{ overflowY: 'hidden', resize: 'none' }}
            />
            <p className="mt-2 py-2.5 font-extrabold">{inputText.length}/500</p>
            <button 
              onClick={handleSubmit}
              className="mt-2 mb-10 bg-black block text-stone-300 font-extrabold py-2.5 px-4 rounded transition duration-200 hover:bg-red-800"
            >
              HORRIFY
            </button>
          </>
        ) : (
          <>
          <div className="countdown-timer">
            {formatTime(countdownTime)}
          </div>
          <div className="mt-10 mb-10 sm:max-w-2xl lg:max-w-2xl text-black py-2.5 px-4 rounded transition duration-200">
            {LLMText.split('\n\n').map((paragraph, index, array) => (
              <React.Fragment key={index}>
                <p className="justified-text">{paragraph}</p>
                {index < array.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          </>
        )}
    </div>
  );    
};

export default Journal;
