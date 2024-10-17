let submit = document.getElementById("submit");
submit.addEventListener("click", async (e) => {
  e.preventDefault();
  let email = document.getElementById("email").value;

  let password = document.getElementById("password").value;
  if (email.length === 0) {
    alert("Please Enter the email");

    return;
  } else if (password.length === 0) {
    alert("Please Enter the Password");
    return;
  } else {
    console.log("hi", email, password);
    const res = await fetch("http://localhost:8080/auth/login", {
      method: "Post",
      headers: {
        "Content-Type": "application/json", // Telling the server that the body is in JSON format
      },
      body: JSON.stringify({ email, password }),
    });

    alert("kkk");
  }
});
