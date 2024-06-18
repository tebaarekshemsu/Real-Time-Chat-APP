const socket = io();

const loginContainer = document.getElementById("login-container");
const chatContainer = document.getElementById("chat-container");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const usersContainer = document.getElementById("users-container");

let currentUser = null;

loginContainer.addEventListener("submit", (e) => {
  e.preventDefault();
  const nameInput = document.getElementById("name-input");
  const name = nameInput.value;
  nameInput.value = "";
  currentUser = name;
  socket.emit("new-user", name);
  loginContainer.style.display = "none";
  chatContainer.style.display = "block";
});

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  appendMessage(`${message}`, true);
  socket.emit("send-chat-message", message);
  messageInput.value = "";
});

socket.on("chat-message", (data) => {
  if (data.name !== currentUser) {
    appendMessage(`${data.name}: ${data.message}`, false);
  }
});

socket.on("user-connected", (data) => {
  appendUser(data.name, data.id, true);
});

socket.on("user-disconnected", (data) => {
  updateUserStatus(data.id, false);
});

function appendMessage(message, isYourMessage) {
  const messageElement = document.createElement("div");
  const messageTextElement = document.createElement("div");

  messageElement.classList.add("message");
  if (isYourMessage) {
    messageElement.classList.add("your-message");
    messageTextElement.innerText = message;
  } else {
    const [name, ...msg] = message.split(": ");
    const nameElement = document.createElement("span");
    nameElement.classList.add("names");
    nameElement.innerText = `${name}:`;
    messageTextElement.innerText = msg.join(": ");
    messageElement.appendChild(nameElement);
  }
  messageTextElement.classList.add("message-text");
  messageElement.appendChild(messageTextElement);
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

function appendUser(name, id, isOnline) {
  let userElement = document.querySelector(`#user-${id}`);
  if (!userElement) {
    userElement = document.createElement("div");
    userElement.classList.add("user");
    userElement.id = `user-${id}`;
    usersContainer.append(userElement);
  }
  const statusElement = document.createElement("span");
  statusElement.classList.add("status");
  if (isOnline) {
    statusElement.classList.add("online");
  } else {
    statusElement.classList.add("offline");
  }
  userElement.textContent = name;
  userElement.prepend(statusElement);
}

function updateUserStatus(id, isOnline) {
  const userElement = document.querySelector(`#user-${id}`);
  if (userElement) {
    const statusElement = userElement.querySelector(".status");
    if (isOnline) {
      statusElement.classList.add("online");
      statusElement.classList.remove("offline");
    } else {
      statusElement.classList.add("offline");
      statusElement.classList.remove("online");
    }
  }
}
