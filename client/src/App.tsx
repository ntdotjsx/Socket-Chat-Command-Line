import { useState, useEffect } from 'react';
import './App.css';
import Swal from 'sweetalert2';

function App() {
  // const [message, setMessage] = useState('');
  const [roomName, setRoomName] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Function to handle room selection
  const selectRoom = (selectedRoom: string) => {
    setRoomName(selectedRoom);
  };


  // Function to handle WebSocket connection
  useEffect(() => {
    if (!roomName) return;

    const ws = new WebSocket(`ws://192.168.2.33:12345/${roomName}`);

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
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      Swal.fire({
        title: "Failed Connect",
        text: "Failed to connect to WebSocket server!",
        icon: "error"
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

    console.log('Sending message:', inputMessage); // ตรวจสอบค่าที่จะส่งไปยัง server

    socket.send(inputMessage);
    setMessages((prevMessages) => [...prevMessages, inputMessage]); // อัพเดท messages ทันทีที่ส่งไปยัง server
    setInputMessage('');
  };

  return (
    <>
      <h1>Socket</h1>
      <div className="card">
        {/* Room selection buttons */}
        <div>
          <button onClick={() => selectRoom('room1')}>Room 1</button>
          <button onClick={() => selectRoom('room2')}>Room 2</button>
        </div>
        {/* Chat message area */}
        <div className="chat-container">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              {msg}
            </div>
          ))}
        </div>
        {/* Input message area */}
        <div className="input-container">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Enter message..."
          />
          <button onClick={sendMessage}>Send Message</button>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App
