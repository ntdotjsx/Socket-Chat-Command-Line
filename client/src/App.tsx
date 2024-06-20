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
      </div>

      <div className="min-h-screen bg-gray-100 flex sm:ml-64">

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          <div className="card bg-white shadow-md rounded-lg max-w-8xl w-full mx-auto flex-1">
            <div className="chat-container m-4 max-h-97 overflow-y-auto">
              {messages.map((msg, index) => (
                <div key={index} className="message bg-gray-200 p-2 rounded mb-2">
                  {msg}
                </div>
              ))}
            </div>
            {/*           
          <p className="mt-4 text-sm text-gray-500">
            Edit <code className="bg-gray-200 p-1 rounded">src/App.tsx</code> and save to test HMR
          </p> */}
          </div>

          <div className="input-container flex items-end sticky bottom-0 bg-white p-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
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


export default App
