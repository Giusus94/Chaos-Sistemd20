const socket = io('http://localhost:3001');
socket.on('chatMessage', (data) => {
  const chatbox = document.getElementById('chatbox');
  const newMessage = document.createElement('p');
  newMessage.textContent = `[${data.id}] ${data.message}`;
  chatbox.appendChild(newMessage);
  chatbox.scrollTop = chatbox.scrollHeight;
});
function sendMessage() {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();
  if (message !== "") {
    socket.emit('chatMessage', message);
    chatInput.value = "";
  }
}
function loadAvatar(event) {
  const reader = new FileReader();
  reader.onload = function(){
    document.getElementById('avatarPreview').src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}
function calcolaScheda() {
  const rank = document.getElementById('rank').value;
  const rankMods = {'E':0,'F':2,'D':4,'C':6,'B':8,'A':10,'S':12,'1 star':14,'2 stars':16,'3 stars':18,'4 stars':20,'5 stars':22,'Legend':24,'Demigod':26};
  const rankMod = rankMods[rank] || 0;
  const con = parseInt(document.getElementById('costituzione').value || 0);
  document.getElementById('manaOut').innerText = 10 + rankMod;
  document.getElementById('scudoOut').innerText = con + 2;
  document.getElementById('vitaOut').innerText = 4 * 12;
}
function exportToJSON() {
  const data = {};
  document.querySelectorAll("input, select").forEach(input => {
    if (input.type !== "file") data[input.id] = input.value;
  });
  data.avatar = document.getElementById("avatarPreview").src;
  const blob = new Blob([JSON.stringify(data, null, 2)], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "scheda_chaos.json";
  a.click();
  URL.revokeObjectURL(url);
}
function importFromJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const data = JSON.parse(e.target.result);
    for (const id in data) {
      if (id === "avatar") document.getElementById("avatarPreview").src = data.avatar;
      else document.getElementById(id).value = data[id];
    }
    calcolaScheda();
  };
  reader.readAsText(file);
}
function resetForm() {
  document.getElementById("characterForm").reset();
  document.getElementById("avatarPreview").src = "";
  document.getElementById("chatbox").innerHTML = "";
  document.getElementById("chatInput").value = "";
  document.getElementById("vitaOut").innerText = "0";
  document.getElementById("manaOut").innerText = "0";
  document.getElementById("scudoOut").innerText = "0";
}
function exportToPDF() {
  window.print();
}
