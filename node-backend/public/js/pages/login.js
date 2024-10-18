let base_url = window.origin + '/';

let submit = document.getElementById("submit");
submit.addEventListener("click", async (e) => {
    e.preventDefault();
    let email = document.getElementById("email").value;

    let password = document.getElementById("password").value;
    if (email.length === 0) {
        GlobalToast('Email is required!', 'red');

        return;
    } else if (password.length === 0) {
        GlobalToast('Password is required!', 'red');
        return;
    } else {
        const res = await fetch(`${base_url}auth/login`, {
            method: "Post",
            headers: {
                "Content-Type": "application/json", // Telling the server that the body is in JSON format
            },
            body: JSON.stringify({ email, password }),
        });

        const response = await res.json();
        if (response.statusCode == 401) {
            GlobalToast(response.error[0], 'red');

        } else {
            GlobalToast(response.message, 'green');
            setTimeout(() => {

                window.location.href = base_url + 'admin/dashboard';
            }, 1000);

        }
        if (response.statusCode === 200) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
    }
});


function GlobalToast(msg, colour) {
    Toastify({
        text: msg,
        duration: 3000,
        className: 'custom-toast',
        gravity: "top",  // Position of the toast ("top" or "bottom")
        position: "center",  // Position of the toast ("left", "center", or "right")
        backgroundColor: colour,  // Custom background color
        close: true  // Show close button
    }).showToast();
}
