let users = [
  { id: 1, name: "Aaron", total: 0, history: [] },
  { id: 2, name: "Carlie", total: 0, history: [] },
  { id: 3, name: "Alison", total: 0, history: [] },
  { id: 4, name: "Shakirah", total: 0, history: [] },
  { id: 5, name: "Steven", total: 0, history: [] }
];

const container = document.getElementById("user-container");
const leaderboardList = document.getElementById("leaderboard-list");

function renderUsers() {
  container.innerHTML = "";
  users.forEach(user => {
    const card = document.createElement("div");
    card.className = "user-card";

    const historyHTML = user.history.map(entry => `<li>${entry}</li>`).join("");

    card.innerHTML = `
      <h2>${user.name}</h2>
      <p>Total: ${user.total}</p>
      <input type="text" placeholder="Reason..." id="reason-${user.id}" />
      <br/>
      <button onclick="addDollar(${user.id})">+ 1</button>
      <div class="history">
        <strong>History:</strong>
        <ul>${historyHTML}</ul>
      </div>
    `;
    container.appendChild(card);
  });
  renderLeaderboard();
}

function addDollar(userId) {
  const user = users.find(u => u.id === userId);
  const reasonInput = document.getElementById(`reason-${userId}`);
  const reason = reasonInput.value.trim();
  if (user) {
    user.total += 1;
    const timestamp = new Date().toLocaleString();
    // (${timestamp})
    user.history.unshift(`$1 added - ${reason || "Just 'cause"}`);
    if (user.history.length > 5) user.history.pop();
    reasonInput.value = "";
    renderUsers();
  }
}

// Sort Order - Highest Amount

// function renderLeaderboard() {
//   const sortedUsers = [...users].sort((a, b) => b.total - a.total);
//   leaderboardList.innerHTML = sortedUsers
//     .map(user => `<li>${user.name}: $${user.total}</li>`) 
//     .join("");
// }

// Sort Order - Lowest Amount

function renderLeaderboard() {
      const sortedUsers = [...users].sort((a, b) => a.total - b.total);
      leaderboardList.innerHTML = sortedUsers
        .map(user => `<li>${user.name}: ${user.total}</li>`) 
        .join("");
    }

renderUsers();