function login() {
    const username = document.getElementById("username").value.toUpperCase();
    if (username === "KING" || username === "PETER") {
        localStorage.setItem("username", username);
        window.location.href = "quiz.html";
    } else {
        alert("請輸入 KING 或 PETER");
    }
}