async function testAuth() {
    const timestamp = Date.now();
    const email = `testuser_${timestamp}@example.com`;
    const password = 'password123';
    
    console.log("1. Attempting Registration for", email);
    try {
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Candidate',
                email: email,
                password: password,
                role: 'candidate'
            })
        });
        
        const regData = await regRes.json();
        console.log("Registration API Response: HTTP", regRes.status);
        if (!regRes.ok) throw new Error(JSON.stringify(regData));
        
    } catch (e) {
        console.error("Registration FAILED:", e.message);
        process.exit(1);
    }
    
    console.log("\n2. Attempting Login with exact same credentials");
    try {
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });
        
        const loginData = await loginRes.json();
        console.log("Login API Response: HTTP", loginRes.status);
        if (!loginRes.ok) throw new Error(JSON.stringify(loginData));
        
        console.log("SUCCESS! User data returned:", loginData.email);
    } catch (e) {
        console.error("Login FAILED:", e.message);
        process.exit(1);
    }
}

testAuth();
