import React, { useState, useEffect } from 'react';
import axios from 'axios';

// add delete ability
// pull id from the path
const SingleEntry = ({ username, storyId }) => {
  const [LLMStory, setLLMStory] = useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios({
          method: 'get',
          url: '/entry/${storyId}',
          data: username
        });
        setLLMStory(response.data);
      } catch (error) {
        console.error('DB error: ', error);
      }
    }
    fetchEntry();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-#b4b4b4">
      <div className="mt-10 mb-10 sm:max-w-2xl lg:max-w-2xl text-black py-2.5 px-4 rounded transition duration-200">
        {LLMStory.split('\n\n').map((paragraph, index, array) => (
          <React.Fragment key={index}>
            <p className="justified-text">{paragraph}</p>
            {index < array.length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SingleEntry;
