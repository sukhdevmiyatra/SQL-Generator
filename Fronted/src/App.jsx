import React, { useState, useEffect } from 'react';
import './index.css'

const App = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { author: 'AI', content: ['Hi, how can I help you'] },
  ]);

  const getResponse = async () => {
    try {
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
        { author: 'User', content: [`${text}`] },
        { author: 'AI', content: [`${data.generatedText}`] },
      ]);
      setText('');
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to the bottom of the chat feed when new messages are added
    const chatFeed = document.getElementById('chat-feed');
    if (chatFeed) {
      chatFeed.scrollTop = chatFeed.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full min-h-screen p-10 bg-gray-100 chat-container">
      <header className="flex items-center justify-between py-6">
        <h1 className="text-3xl font-bold text-gray-900">SQL Query Generator</h1>
      </header>
      <main className="flex flex-col gap-6 chat-feed" id="chat-feed">
        <div className="border text-card-foreground p-6 bg-white rounded shadow" data-v0-t="card">
          <div className="flex flex-col space-y-1.5 p-6 mb-4">
            <h3 className="tracking-tight text-2xl font-bold text-gray-900">Chat Interface</h3>
          </div>
          <div className="p-6">
            <div className="flex flex-col space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start space-x-3 ${
                    message.author === 'User' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <span className="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10">
                    <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                      {message.author}
                    </span>
                  </span>
                  <div
                    className={`p-3 rounded ${
                      message.author === 'User' ? 'bg-gray-200' : 'bg-blue-500 text-white'
                    }`}
                  >
                    <p className={`text-${message.author === 'User' ? 'gray' : 'white'}-700`}>
                      {message.content.map((line, lineIndex) => (
                        <span key={lineIndex}>{line}</span>
                      ))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <div className="flex items-center gap-4 chat-input">
        <textarea
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-grow"
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
        />
        <button
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary/90 h-10 px-4 py-2 bg-blue-500 text-white relative"
          onClick={getResponse}
          disabled={loading}
        >
          {loading && <div className="spinner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-t-4 border-blue-500 border-solid rounded-full animate-spin h-5 w-5"></div>}
          {!loading ? 'Send' : 'Sending...'}
        </button>
      </div>
    </div>
  );
};

export default App;
