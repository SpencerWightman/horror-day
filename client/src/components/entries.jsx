import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Entries = ({ username }) => {
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get('/entries', { params: { username } });
        setEntries(response.data);
      } catch (error) {
        console.error('DB error: ', error);
      }
    };
    fetchEntries();
  }, [username]);

  const handleClick = (timestamp) => {
    navigate(`/entry/${timestamp}`);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-#b4b4b4">
      <div className="mt-10 mb-10 sm:max-w-2xl lg:max-w-2xl text-black py-2.5 px-4 rounded transition duration-200">
        {entries.map((entry, index) => (
          <div
            key={index}
            className="timestamp-entry hover:bg-blue-500 hover:text-white cursor-pointer"
            onClick={() => handleClick(entry)}
          >
            {entry}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Entries;
