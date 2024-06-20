import { useState, useEffect } from 'react';
import './App.css';
import Swal from 'sweetalert2';

function App() {
  const [roomName, setRoomName] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Function to handle room selection
  const selectRoom = (selectedRoom: string) => {
    setRoomName(selectedRoom);
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  // Function to handle WebSocket connection
  useEffect(() => {
    if (!roomName) return;

    const ws = new WebSocket(`ws://localhost:12345/${roomName}`);

    ws.onopen = () => {
      console.log('WebSocket Client Connected');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      const incomingMessage = event.data;
      setMessages((prevMessages) => [...prevMessages, incomingMessage]);
    };

    ws.onclose = () => {
      console.log('WebSocket Client Disconnected');

      Toast.fire({
        icon: "warning",
        text: 'WebSocket connection closed unexpectedly.'
      });
      // Optionally implement reconnect logic here
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      Swal.fire({
        title: 'Failed Connect',
        text: 'Failed to connect to WebSocket server!',
        icon: 'error',
      });
    };

    return () => {
      ws.close();
    };
  }, [roomName]);

  // Function to send message to server
  const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.error('WebSocket not connected');
      return;
    }

    if (!inputMessage.trim()) {
      console.error('Empty message cannot be sent');
      return;
    }

    console.log('Sending message:', inputMessage);

    if (isLink(inputMessage)) {
      fetchMetaDescription(inputMessage)
        .then((description) => {
          setMessages((prevMessages) => [
            ...prevMessages,
            `${inputMessage}: ${description}`,
          ]);
          setInputMessage('');
        })
        .catch((error) => {
          console.error('Failed to fetch meta description:', error);
          setMessages((prevMessages) => [
            ...prevMessages,
            `${inputMessage}: Error fetching meta description`,
          ]);
          setInputMessage('');
        });
    } else {
      socket.send(inputMessage);
      setMessages((prevMessages) => [...prevMessages, inputMessage]);
      setInputMessage('');
    }

  };

  // Function to fetch meta description from URL
  const fetchMetaDescription = async (url: string) => {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content');

      return metaDescription || 'No meta description found';
    } catch (error) {
      console.error('Error fetching meta description:', error);
      return 'Error fetching meta description';
    }
  };

  // Function to check if a string is a link
  const isLink = (message: string): boolean => {
    const urlRegex = /(http:\/\/|https:\/\/)(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/gi;
    return urlRegex.test(message);
  };

  return (
    <>
      {/* Sidebar Room */}
      <div className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
        <h1 className="text-2xl font-bold mb-4">Rooms</h1>
        <button
          onClick={() => selectRoom('room1')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Room 1
        </button>
        <button
          onClick={() => selectRoom('room2')}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Room 2
        </button>
        <a href="/Login" className="text-blue-300 hover:text-blue-400 block mb-2">Login</a>
      </div>

      <div className="min-h-screen bg-gray-100 flex sm:ml-64">
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <div className="card bg-white shadow-md rounded-lg max-w-8xl w-full mx-auto flex-1">
            <div className="chat-container m-4 max-h-97 overflow-y-auto">
              {messages.map((msg, index) => {
                if (isLink(msg)) {
                  const parts = msg.split(': ');
                  const link = parts[0];
                  const description = parts.slice(1).join(': ');

                  return (
                    <div key={index} className="message bg-gray-200 p-2 rounded mb-2">
                      <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>
                      <div>{description}</div>
                    </div>
                  );
                } else {
                  return (
                    <div key={index} className="message bg-gray-200 p-2 rounded mb-2">
                      {msg}
                    </div>
                  );
                }
              })}
            </div>
          </div>

          <div className="input-container flex items-end sticky bottom-0 bg-white p-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Enter message..."
              className="flex-1 py-2 px-4 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
