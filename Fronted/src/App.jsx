import { useState } from 'react';

const App = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getResponse = async () => {
    try {
      // Check if the message is empty
      if (!text.trim()) {
        setErrorMessage('Please enter a message.');
        return;
      }

      setLoading(true);

      const response = await fetch(`https://sql-generator-w634.vercel.app/generate-sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userInput: text }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the server');
      }

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          author: 'User',
          content: [text], // User message as an array
        },
        {
          author: 'Bot',
          content: data.generatedText.split('\n'), // Bot response as an array of lines
        },
      ]);
      setText('');
      setErrorMessage('');
    } catch (error) {
      console.error('Error:', error.message);
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-feed">
        {messages?.map((message, index) => (
          <div key={index} className={`message ${message.author.toLowerCase()}`}>
            <strong>{message.author}: </strong>
            {message.content.map((line, lineIndex) => (
              <p key={lineIndex}>{line}</p>
            ))}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <textarea
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4} // Adjust the number of rows as needed
        />
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        <button onClick={getResponse} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default App;
