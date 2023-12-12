import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Entries = () => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate(); 
  const username = sessionStorage.getItem('username') || '';

  useEffect(() => {
    if (!entries.length > 0) {
      const fetchEntries = async () => {
        try {
          const response = await axios.get('/api/entries', {
            params: {
              username
            }
          });
          setEntries(response.data);
        } catch (error) {
          console.error('DB error: ', error);
        }
      };
      fetchEntries();
    }
  }, [username, entries]);

  const handleClick = (timestamp) => {
    navigate(`/entry/${timestamp}`);
  };

  return (
    <>
    <div className="flex flex-col items-center justify-start min-h-screen bg-#b4b4b4">
      <p className="block text-stone-500 font-extrabold py-2.5 px-4 rounded hover:cursor-default">Archive</p>
      <div className="mt-10 mb-10 sm:max-w-2xl lg:max-w-2xl text-black py-2.5 px-4 rounded transition duration-200">
        {entries.map((entry, index) => (
          <div
            key={index}
            className="timestamp-entry hover:bg-blue-500 hover:text-white cursor-pointer"
            onClick={() => handleClick(entry.N)}
          >
            <p className="block text-stone-500 font-extrabold py-2.5 px-4 rounded hover:cursor-default">{entry.N}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Entries;
