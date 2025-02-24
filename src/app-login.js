async function loadApi() {
    const Api = await import("./modules/api.js");
    return Api;
}

document.getElementById('submit').addEventListener('click',async (e) => {
    e.preventDefault();

    const Api = await loadApi();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const data = await Api.login(username,password);
});