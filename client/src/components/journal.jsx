import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import formatTime from "../utils/format-time.js";

const timer = 86400 // 86400 for 24hrs

const Journal = () => {
  const [inputText, setInputText] = useState('');
  const [LLMText, setLLMText] = useState('');
  const [textSaved, setTextSaved] = useState(() => {
    const saved = localStorage.getItem('textSaved');
    return saved === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const [countdownTime, setCountdownTime] = useState(timer);
  const [endTime, setEndTime] = useState(Date.now() + timer * 1000);
  const username = localStorage.getItem('username') || '';

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  useEffect(() => {
    localStorage.setItem('textSaved', textSaved.toString());
  }, [textSaved]);

  useEffect(() => {
    const storedLLMText = localStorage.getItem('LLMText');
    if (storedLLMText) {
      setLLMText(storedLLMText);
    }
  }, []);

  // useEffect(() => {
  //   let timeoutId;
  //   if (textSaved) {
  //     timeoutId = setTimeout(() => setTextSaved(false), 2000); // resets to false after 2 seconds
  //   }
  //   return () => clearTimeout(timeoutId);
  // }, [textSaved]);

  useEffect(() => {
    localStorage.setItem('LLMText', LLMText);
  }, [LLMText]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [inputText]);

  useEffect(() => {
    const storedEndTime = localStorage.getItem('endTime');
    if (storedEndTime) {
      setEndTime(parseInt(storedEndTime, 10));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('endTime', endTime.toString());
  }, [endTime]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const remainingTime = endTime - now;
      if (remainingTime > 0) {
        setCountdownTime(Math.ceil(remainingTime / 1000));
      } else if (countdownTime !== 0) {
        setCountdownTime(0);
        setLLMText('');
        localStorage.removeItem('LLMText');
        localStorage.removeItem('endTime');
      }
    };

    const timerId = setInterval(updateCountdown, 1000);
    updateCountdown();

    return () => clearInterval(timerId);
  }, [endTime, countdownTime, inputText, LLMText]);


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
      localStorage.setItem('LLMText', response.data);
      setLLMText(response.data);
      setTextSaved(false);
      setIsLoading(false);
      setInputText('');
      setEndTime(Date.now() + timer * 1000);
    } catch (error) {
      setIsLoading(false);
      console.error('API error: ', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await axios({
        method: 'post',
        url: '/entry',
        data: {
          username,
          LLMText
        }
      });
      setTextSaved(true);
    } catch (error) {
      console.error('API error: ', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-#b4b4b4">
        {isLoading ? (
          <div className="flex justify-center items-center" style={{flex: 1}}>
            <div className="spinner"></div>
          </div>
        ) : !LLMText ? (
          <>
            <textarea
              autoFocus
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              maxLength={500}
              className="mt-20 sm:max-w-2xl lg:max-w-4xl p-2 border border-gray-300 rounded-md bg-black focus:outline-none"
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
              <button
                onClick={handleSave}
                disabled={textSaved}
                className="mx-auto mt-4 mb-10 bg-black block text-stone-300 font-extrabold py-2.5 px-4 rounded transition duration-200 hover:bg-red-800"
              >
                {textSaved ? 'STORY SAVED' : 'SAVE YOUR STORY'}
              </button>
            </div>
          </>
        )}
    </div>
  );
};

export default Journal;
