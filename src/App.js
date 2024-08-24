import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Define server URLs
const servers = {
  primary: 'https://audio-summarizer-4m05.onrender.com',
  secondary: 'https://audio-summarizer-xi.vercel.app',
};

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [server, setServer] = useState(servers.primary); // Default to primary server

  // Initialize socket connection based on selected server
  const socket = io(server);

  useEffect(() => {
    socket.on('summary_response', (data) => {
      setSummary(data.summary);
      setError('');
    });

    socket.on('connect', () => {
      console.log(`Connected to ${server}`);
    });

    socket.on('disconnect', () => {
      console.log(`Disconnected from ${server}`);
    });

    return () => {
      socket.off('summary_response');
    };
  }, [server]);

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

  const switchServer = () => {
    setServer(server === servers.primary ? servers.secondary : servers.primary);
  };

  return (
    <div className="App">
      <h1>Voice Summarizer</h1>
      <button onClick={switchServer}>Switch Server</button>
      <p>Currently connected to: {server}</p>
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
