const loginBtn = document.getElementById('loginBtn');
const statusText = document.getElementById('status');

// Connect to WebSocket server
const socket = new WebSocket('ws://192.168.1.100:3000');

// When the socket is open
socket.addEventListener('open', () => {
    console.log('Connected to WebSocket server');
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'loginResult') {
        if (data.success) {
            statusText.style.color = 'green';
            statusText.textContent = 'Login successful!';
        } else {
            statusText.style.color = 'red';
            statusText.textContent = 'Login failed!';
        }
    }
});

loginBtn.addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
        statusText.textContent = 'Please fill all fields';
        return;
    }

    // Send login credentials to the server
    socket.send(JSON.stringify({
        type: 'login',
        username,
        password
    }));
});
