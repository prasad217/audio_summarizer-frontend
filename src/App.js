import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/summarize', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setSummary(data.summary);
      setError('');  // Clear any errors if the request was successful
    } catch (error) {
      setError('There was a problem with the fetch operation: ' + error.message);
    }
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
