async function loadApi() {
    const Api = await import("./modules/api.js");
    return Api;
}

document.getElementById('submit').addEventListener('click',async (e) => {
    e.preventDefault();
    const Api = await loadApi();

    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        const result = await Api.login(username, password);
        console.log('Login successful:', result);
        
        // Redirect or update UI on success
        window.location.href = '/index';
    } catch (error) {
        console.error('Login failed:', error.message);
        // Show error to user
        const errorElement = document.getElementById('loginError');
        if (errorElement) {
            errorElement.textContent = error.message;
            errorElement.style.display = 'block';
        }
    }
});