// Import useEffect and useState only since useParams will not be used.
import React, { useState, useEffect } from 'react';
import formatDate from "../utils/format-date.js";
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const SingleEntry = ({ id }) => { // Accept id as a prop
  const [LLMStory, setLLMStory] = useState('');
  const username = localStorage.getItem('username') || '';
  const readableDate = formatDate(Number(id));

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await axios.get(`/api/entry?username=${username}&id=${id}`);
        setLLMStory(response.data);
      } catch (error) {
        console.error('DB error: ', error);
      }
    };

    if (id) {
      fetchEntry();
    }
  }, [username, id]); // Effect depends on id and username

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-#b4b4b4">
      <p className="block text-stone-500 font-extrabold py-2.5 px-4 rounded hover:cursor-default">{readableDate}</p>
      <div className="text-black py-2.5 px-4 rounded transition duration-200">
        {LLMStory && LLMStory.split('\n\n').map((paragraph, index, array) => (
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
