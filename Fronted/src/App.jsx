import { useState } from 'react';

const App = () => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const getResponse = async () => {
    try {
      setLoading(true);

      const response = await fetch(`http://localhost:3000/generate-sql`, {
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
    } catch (error) {
      console.error('Error:', error.message);
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
        <button onClick={getResponse} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default App;
