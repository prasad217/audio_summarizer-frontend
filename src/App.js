import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://audio-summarizer-4m05.onrender.com'); // Update this with your server's URL

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    socket.on('summary_response', (data) => {
      setSummary(data.summary);
      setError('');
    });

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.off('summary_response');
    };
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError('');  // Clear any previous errors
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      const data = { file: arrayBuffer };
      socket.emit('summarize', data);
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="App">
      <h1>Voice Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Summarize</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {summary && <p>Summary: {summary}</p>}
    </div>
  );
}

export default App;
