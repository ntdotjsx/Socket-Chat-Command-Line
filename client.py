# client.py
import socket

# กำหนด IP address และ port ของเซิร์ฟเวอร์
HOST = '192.168.2.45'  # ใช้ IP address ของเซิร์ฟเวอร์ที่สร้าง socket server ไว้
PORT = 12345  # ใช้ port ที่กำหนดในเซิร์ฟเวอร์

# สร้าง socket object
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    # เชื่อมต่อไปยังเซิร์ฟเวอร์
    s.connect((HOST, PORT))
    print(f'Connected to {HOST}:{PORT}')
    
    while True:
        # รับข้อมูลจากผู้ใช้เพื่อส่งไปยังเซิร์ฟเวอร์
        message = input('Enter message: ')
        
        # ส่งข้อมูลไปยังเซิร์ฟเวอร์
        s.sendall(message.encode())
        
        # รับข้อมูลที่ส่งกลับมาจากเซิร์ฟเวอร์
        data = s.recv(1024)
        
        # แสดงข้อมูลที่รับกลับมา
        print(f'Received from server: {data.decode()}')
