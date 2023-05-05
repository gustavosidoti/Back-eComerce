
let socket = io();
let user="";
//let user = JSON.parse(sessionStorage.getItem("user")) || prompt("Ingrese correo electrónico:");
fetch('/api/sessions/current')
.then(response => response.json())
.then(data => user=data.dato.email);


let sendMessageForm = document.getElementById("sendMessage");

sendMessageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = e.target[0].value.trim();
  socket.emit("newMessage", { user, message });
  e.target.reset();
});

socket.on("messagesListUpdated", () => {
  location.reload();
});