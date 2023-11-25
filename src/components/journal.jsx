import { useState } from 'react';

const Journal = () => {
  const [inputText, setInputText] = useState('');

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  return (
    <div className="mt-[-150px] flex flex-col items-center justify-center min-h-screen bg-#b4b4b4">
      <p className="block text-stone-500 font-extrabold py-2.5 px-4 rounded hover:cursor-default">HORRIFY ME</p>
      <div className="flex space-x-4">
        <div className="w-48 h-48 bg-#b4b4b4 border border-black rounded-md m-2">
          <p>Character Count: {inputText.length}/200</p>
          <textarea
            value={inputText}
            onChange={handleInputChange}
            maxLength={200}
            className="w-full h-40 p-2 border border-gray-300 rounded-md"
            placeholder="Type your text here..."
          />
        </div>
      </div>
    </div>
  );
};

export default Journal;
