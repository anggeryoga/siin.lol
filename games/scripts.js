document.addEventListener("DOMContentLoaded", async function () {
    const choices = ["rock", "paper", "scissors"];
    const emojiMap = {
      rock: "✊",
      paper: "✋",
      scissors: "✌️"
    };
    const animationContainer = document.getElementById('animation');
    let animationInterval;
  
    // Mendapatkan IP pengguna
    const userIP = await getUserIP();
  
    // Periksa apakah IP sudah tersimpan di localStorage
    let gameData = JSON.parse(localStorage.getItem('gameData')) || {};
  
    // Jika IP belum tersimpan, simpan IP dan inisialisasi jumlah kemenangan awal
    if (!gameData[userIP]) {
      gameData[userIP] = {
        wins: 0, // Jumlah kemenangan awal
        played: 0 // Jumlah permainan total
      };
      localStorage.setItem('gameData', JSON.stringify(gameData));
    }
  
    document.getElementById("rock").addEventListener("click", function () {
      playGame("rock");
    });
  
    document.getElementById("paper").addEventListener("click", function () {
      playGame("paper");
    });
  
    document.getElementById("scissors").addEventListener("click", function () {
      playGame("scissors");
    });
  
    function playGame(playerChoice) {
      const computerChoice = getComputerChoice(playerChoice, gameData[userIP].played, gameData[userIP].wins);
      const animationDiv = document.getElementById("animation");
  
      clearInterval(animationInterval);
      let currentIndex = 0;
  
      animationInterval = setInterval(() => {
        animationDiv.textContent = emojiMap[choices[currentIndex]];
        currentIndex = (currentIndex + 1) % choices.length;
      }, 100);
  
      setTimeout(() => {
        clearInterval(animationInterval);
        animationDiv.textContent = emojiMap[computerChoice];
        displayResult(playerChoice, computerChoice);
      }, 1500);
    }
  
    function getComputerChoice(playerChoice, gamesPlayed, wins) {
      const randomNum = Math.random(); // Generates a random number between 0 and 1
  
      // Jika pemain belum menang 2-3 kali, beri kemenangan
      if (wins < 2 && gamesPlayed < 3) {
        if (playerChoice === "rock") {
          return "scissors"; // Rock beats scissors
        } else if (playerChoice === "paper") {
          return "rock"; // Paper beats rock
        } else if (playerChoice === "scissors") {
          return "paper"; // Scissors beats paper
        }
      }
  
      // Setelah 2-3 kemenangan, komputer menang 93% dari waktu
      if (randomNum < 0.93) {
        if (playerChoice === "rock") {
          return "paper"; // Paper beats rock
        } else if (playerChoice === "paper") {
          return "scissors"; // Scissors beats paper
        } else if (playerChoice === "scissors") {
          return "rock"; // Rock beats scissors
        }
      } else {
        // 3% chance of losing or drawing (random choice)
        return choices[Math.floor(Math.random() * choices.length)];
      }
    }
  
    function displayResult(playerChoice, computerChoice) {
      let result = "";
  
      if (playerChoice === computerChoice) {
        result = "It's a draw!";
      } else if (
        (playerChoice === "rock" && computerChoice === "scissors") ||
        (playerChoice === "paper" && computerChoice === "rock") ||
        (playerChoice === "scissors" && computerChoice === "paper")
      ) {
        result = `You win! ${emojiMap[playerChoice]} beats ${emojiMap[computerChoice]}.`;
        gameData[userIP].wins++; // Tambahkan kemenangan
        triggerFireworks();
      } else {
        result = `You lose! ${emojiMap[computerChoice]} beats ${emojiMap[playerChoice]}.`;
        triggerLossBackground();
      }
  
      // Tambahkan permainan yang dimainkan
      gameData[userIP].played++;
  
      // Simpan data game
      localStorage.setItem('gameData', JSON.stringify(gameData));
  
      document.getElementById("result").textContent = result;
    }
  
    function triggerFireworks() {
      const fireworksContainer = document.getElementById("fireworks-container");
      fireworksContainer.innerHTML = ""; // Clear any existing fireworks
  
      for (let i = 0; i < 10; i++) {
        // Generate 10 fireworks
        const firework = document.createElement("div");
        firework.className = "firework";
        firework.style.left = `${Math.random() * 100}%`;
        firework.style.top = `${Math.random() * 100}%`;
        firework.style.animationDelay = `${Math.random() * 0.5}s`;
  
        fireworksContainer.appendChild(firework);
  
        // Remove the firework after animation ends
        setTimeout(() => {
          firework.remove();
        }, 1000);
      }
    }
    
    function triggerLossBackground() {
      animationContainer.style.backgroundColor = 'red';
  
      // Revert the background color to original after 1 second
      setTimeout(() => {
          animationContainer.style.backgroundColor = '';
      }, 1000);
    }
  
    function resetBackgroundColor() {
      animationContainer.style.backgroundColor = '';
    }
  
    async function getUserIP() {
      return fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => data.ip);
    }
  });
  