# server.py
import socket

# กำหนด IP address และ port ที่จะใช้สร้างเซิร์ฟเวอร์
HOST = '0.0.0.0'  # ใช้ '0.0.0.0' เพื่อให้รับ connection จากทุก interface ของเครื่อง
PORT = 12345

# สร้าง socket object
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    # Bind เซิร์ฟเวอร์ไปยัง address และ port ที่กำหนด
    s.bind((HOST, PORT))
    # Listen รอการเชื่อมต่อเข้ามา
    s.listen()
    print(f'Server is listening on {HOST}:{PORT}')
    # Accept การเชื่อมต่อ
    conn, addr = s.accept()
    with conn:
        print('Connected by', addr)
        while True:
            # รับข้อมูลจาก client
            data = conn.recv(1024)
            if not data:
                break
            # แสดงข้อมูลที่รับมา
            print(f"Received from client: {data.decode()}")
            # ส่งข้อมูลกลับไปยัง client
            conn.sendall(data)
