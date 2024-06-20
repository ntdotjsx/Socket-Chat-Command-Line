import asyncio
import websockets

# รายชื่อห้องแชท
chat_rooms = {
    'room1': set(),
    'room2': set()
}

async def handle_client(websocket, path):
    room_name = path.strip('/')
    if room_name in chat_rooms:
        chat_rooms[room_name].add(websocket)
        print(f"Client connected to room {room_name}")

        # Send welcome message
        await websocket.send(f"Welcome to room {room_name}!")

        try:
            async for message in websocket:
                print(f"Received message from client in room {room_name}: {message}")  # ตรวจสอบข้อความที่ได้รับ
                # Broadcast message to all clients in the room
                for member_socket in chat_rooms[room_name]:
                    if member_socket != websocket:
                        await member_socket.send(message)
        finally:
            # Remove client from the room upon disconnection
            chat_rooms[room_name].remove(websocket)
            print(f"Client disconnected from room {room_name}")


async def main():
    async with websockets.serve(handle_client, "0.0.0.0", 12345):
        print("WebSocket server started")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
