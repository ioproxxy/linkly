const axios = require('axios');

const API_URL = 'http://localhost:3000/api/auth';

async function testAuth() {
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Testing with email: ${email}`);

    try {
        // 1. Register
        console.log('1. Testing Register...');
        const registerRes = await axios.post(`${API_URL}/register`, { email, password });
        if (registerRes.status === 201 && registerRes.data.token) {
            console.log('✅ Register Success');
        } else {
            console.error('❌ Register Failed', registerRes.data);
        }

        // 2. Login
        console.log('2. Testing Login...');
        const loginRes = await axios.post(`${API_URL}/login`, { email, password });
        if (loginRes.status === 200 && loginRes.data.token) {
            console.log('✅ Login Success');
        } else {
            console.error('❌ Login Failed', loginRes.data);
        }

    } catch (error) {
        if (error.response) {
            console.error('❌ Request Failed:', error.response.status, error.response.data);
        } else {
            console.error('❌ Request Error:', error.message);
        }
    }
}

testAuth();
