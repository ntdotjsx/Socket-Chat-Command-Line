# chat_server.py
import socket
import threading

# สร้าง socket object
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# กำหนด IP address และ port ที่จะใช้สร้างเซิร์ฟเวอร์
HOST = '0.0.0.0'  # ใช้ '0.0.0.0' เพื่อให้รับ connection จากทุก interface ของเครื่อง
PORT = 12345

# Bind เซิร์ฟเวอร์ไปยัง address และ port ที่กำหนด
server.bind((HOST, PORT))

# Listen รอการเชื่อมต่อเข้ามา
server.listen()

print(f'Server is listening on {HOST}:{PORT}')

# รายชื่อห้องแชท
chat_rooms = {
    'room1': [],
    'room2': []
}

def handle_client(client_socket, room_name):
    while True:
        try:
            # รับข้อมูลจาก client
            message = client_socket.recv(1024).decode()

            if not message:
                break

            # ส่งข้อความไปยังสมาชิกในห้อง
            for member_socket in chat_rooms[room_name]:
                if member_socket != client_socket:
                    member_socket.sendall(message.encode())
        except Exception as e:
            print(f"Error handling client: {e}")
            break

    # หาก client ออกจากการเชื่อมต่อ
    if client_socket in chat_rooms[room_name]:
        chat_rooms[room_name].remove(client_socket)
        client_socket.close()

while True:
    # Accept การเชื่อมต่อ
    client_socket, addr = server.accept()
    print('Connected by', addr)

    # เมื่อ client เชื่อมต่อเข้ามา ให้ส่งห้องแชทที่ใช้งานอยู่ไปยัง client
    client_socket.sendall("Available chat rooms: room1, room2\nEnter room name:".encode())
    room_name = client_socket.recv(1024).decode().strip()

    # เชื่อม client เข้าห้องแชท
    if room_name in chat_rooms:
        chat_rooms[room_name].append(client_socket)
        client_socket.sendall(f"Welcome to room {room_name}!\n".encode())
        thread = threading.Thread(target=handle_client, args=(client_socket, room_name))
        thread.start()
    else:
        client_socket.sendall(f"Room {room_name} not found. Closing connection...\n".encode())
        client_socket.close()
