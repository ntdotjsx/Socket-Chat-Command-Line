# chat_client.py
import socket
import threading

def receive_messages(client_socket):
    while True:
        try:
            # รับข้อมูลจากเซิร์ฟเวอร์
            message = client_socket.recv(1024).decode()
            if message:
                print(message)
        except Exception as e:
            print(f"Error receiving message: {e}")
            break

# กำหนด IP address และ port ของเซิร์ฟเวอร์
HOST = 'เป็น IP address ของเซิร์ฟเวอร์'
PORT = 12345

# สร้าง socket object
client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# เชื่อมต่อไปยังเซิร์ฟเวอร์
client.connect((HOST, PORT))
print(f'Connected to {HOST}:{PORT}')

# สร้าง thread สำหรับรับข้อความจากเซิร์ฟเวอร์
receive_thread = threading.Thread(target=receive_messages, args=(client,))
receive_thread.start()

while True:
    try:
        # ส่งข้อความไปยังเซิร์ฟเวอร์
        message = input()
        client.sendall(message.encode())
    except Exception as e:
        print(f"Error sending message: {e}")
        break

client.close()
