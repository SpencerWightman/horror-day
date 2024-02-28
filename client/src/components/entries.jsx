import { useState, useEffect } from 'react';
import axios from 'axios';
import formatDate from "../utils/format-date.js";
import SingleEntry from './SingleEntry';

const Entries = () => {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const username = localStorage.getItem('username') || '';

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
    setSelectedEntry(timestamp);
  };

  return (
    <div className="flex">
      <aside className="w-1/4 min-h-screen bg-#b4b4b4">
        <p className="block text-stone-500 font-extrabold py-2.5 px-4 rounded">Archive</p>
        <div className="mt-10 mb-10 text-black py-2.5 px-4 rounded transition duration-200">
          {entries.map((entry, index) => (
            <div
              key={index}
              className={`timestamp-entry hover-bg-custom cursor-pointer ${index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-300'} ${selectedEntry === entry.N ? 'menu-select' : ''}`}
              onClick={() => handleClick(entry.N)}
            >
              <p className="block text-stone-500 font-extrabold py-2.5 px-4 rounded">{formatDate(Number(entry.N))}</p>
            </div>
          ))}
        </div>
      </aside>
      <main className="w-3/4">
        {selectedEntry && <SingleEntry id={selectedEntry} />}
      </main>
    </div>
  );
};

export default Entries;
