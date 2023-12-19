import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import formatDate from "../utils/format-date.js";
import axios from 'axios';

// add delete ability
const SingleEntry = () => {
  const [LLMStory, setLLMStory] = useState('');
  const username = localStorage.getItem('username') || '';
  const { id } = useParams();
  const readableDate = formatDate(Number(id));

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('/api/entry', {
          params: {
            username,
            id
          }
        });
        setLLMStory(response.data);
      } catch (error) {
        console.error('DB error: ', error);
      }
    };
    fetchEntries();
  }, [username, id]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-#b4b4b4">
    <p className="block text-stone-500 font-extrabold py-2.5 px-4 rounded hover:cursor-default">{readableDate}</p>
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
