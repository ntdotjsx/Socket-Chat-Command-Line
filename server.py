import socket

HOST = '0.0.0.0'
PORT = 12345

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:

    s.bind((HOST, PORT))
    s.listen()
    print(f'Server is listening on {HOST}:{PORT}')

    #Accept Connect
    conn, addr = s.accept()
    with conn:
        print('Connect by', addr)
        while True:
            data = conn.recv(1024)
            if not data:
                break
            print(f"Received from client: {data.decode()}")

            conn.sendall(data)