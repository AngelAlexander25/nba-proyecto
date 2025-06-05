// NBA Dashboard JavaScript

// NBA APIs
const NBA_APIS = {
  players: "https://www.balldontlie.io/api/v1/players",
  stats: "https://www.balldontlie.io/api/v1/season_averages",
  teams: "https://www.balldontlie.io/api/v1/teams",
  games: "https://www.balldontlie.io/api/v1/games"
};

// Global variables
let playersData = [];
let teamsData = [];
let currentSeason = "2023";
let currentSection = "players";

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  initializeDashboard();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Season select change
  const seasonSelect = document.getElementById("seasonSelect");
  seasonSelect.addEventListener("change", (e) => {
    currentSeason = e.target.value;
    refreshData();
  });

  // Conference select change
  const conferenceSelect = document.getElementById("conferenceSelect");
  conferenceSelect.addEventListener("change", () => {
    loadTeamRankings();
  });

  // Search functionality
  const searchIcon = document.querySelector(".search i");
  searchIcon.addEventListener("click", openSearchModal);

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    const modal = document.getElementById("searchModal");
    if (e.target === modal) {
      closeSearchModal();
    }
  });

  // Search input
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", handleSearch);

  // ESC key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSearchModal();
    }
  });
}

// Initialize dashboard
async function initializeDashboard() {
  try {
    await Promise.all([
      loadTeams(),
      loadTopPlayers(),
      loadTeamRankings(),
      loadSeasonStats(),
      loadNews(),
      loadPlayerComparison()
    ]);
  } catch (error) {
    console.error("Error initializing dashboard:", error);
    loadFallbackData();
  }
}

// Load teams data
async function loadTeams() {
  try {
    const response = await fetch(NBA_APIS.teams);
    const data = await response.json();
    teamsData = data.data;
  } catch (error) {
    console.error("Error loading teams:", error);
    teamsData = getFallbackTeams();
  }
}

// Load top players
async function loadTopPlayers() {
  const container = document.getElementById("topPlayers");
  container.innerHTML = `<canvas id="playersStatsChart"></canvas>`;

  try {
    const response = await fetch(`${NBA_APIS.players}?per_page=6`);
    const data = await response.json();
    const players = data.data;

    const statsPromises = players.map(async (player) => {
      const statsResponse = await fetch(`${NBA_APIS.stats}?season=${currentSeason}&player_ids[]=${player.id}`);
      const statsData = await statsResponse.json();
      const stats = statsData.data[0] || { pts: 0, ast: 0, reb: 0 };
      return { ...player, stats };
    });

    const playersWithStats = await Promise.all(statsPromises);

    // Gráfica de puntos
    const labels = playersWithStats.map(p => `${p.first_name} ${p.last_name}`);
    const pts = playersWithStats.map(p => p.stats.pts);

    new Chart(document.getElementById('playersStatsChart'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'PPG', data: pts, backgroundColor: '#4ade80' }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false }, title: { display: true, text: 'Top Jugadores - Puntos por Partido' } }
      }
    });

    // Si quieres también las tarjetas, puedes agregarlas debajo de la gráfica
    // container.innerHTML += ... (tu código de tarjetas aquí)

  } catch (error) {
    container.innerHTML = "<p style='color:red'>No se pudieron cargar los jugadores.</p>";
  }
}

// Get players with stats
async function getTopPlayersWithStats(players) {
  const playersWithStats = [];
  
  for (const player of players) {
    try {
      const statsResponse = await fetch(`${NBA_APIS.stats}?season=${currentSeason}&player_ids[]=${player.id}`);
      const statsData = await statsResponse.json();
      const stats = statsData.data[0] || generateMockStats();
      
      playersWithStats.push({
        ...player,
        stats: stats
      });
    } catch (error) {
      playersWithStats.push({
        ...player,
        stats: generateMockStats()
      });
    }
  }
  
  return playersWithStats;
}

// Display top players
function displayTopPlayers(players) {
  const container = document.getElementById("topPlayers");
  container.innerHTML = "";

  players.forEach(player => {
    const playerCard = document.createElement("div");
    playerCard.className = "player-card";
    playerCard.innerHTML = `
      <div class="player-card-header">
        <div class="player-avatar">
          <img src="https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${player.id}.png" 
               alt="${player.first_name} ${player.last_name}"
               onerror="this.onerror=null;this.src='https://cdn-icons-png.flaticon.com/512/147/147144.png';">
        </div>
        <div class="player-info">
          <h3>${player.first_name} ${player.last_name}</h3>
          <p>${player.team?.full_name || "NBA"}</p>
        </div>
      </div>
      <div class="player-stats">
        <div class="stat-mini">
          <div class="value">${parseFloat(player.stats.pts || 0).toFixed(1)}</div>
          <div class="label">PPG</div>
        </div>
        <div class="stat-mini">
          <div class="value">${parseFloat(player.stats.ast || 0).toFixed(1)}</div>
          <div class="label">APG</div>
        </div>
        <div class="stat-mini">
          <div class="value">${parseFloat(player.stats.reb || 0).toFixed(1)}</div>
          <div class="label">RPG</div>
        </div>
      </div>
    `;
    
    // Add click event for player details
    playerCard.addEventListener("click", () => showPlayerDetails(player));
    container.appendChild(playerCard);
  });
}

// Load team rankings
function loadTeamRankings() {
  const container = document.getElementById("teamRankings");
  const conferenceFilter = document.getElementById("conferenceSelect").value;
  container.innerHTML = "";

  const mockRankings = [
    { name: "Boston Celtics", record: "45-20", logo: "1", conference: "East" },
    { name: "Denver Nuggets", record: "43-22", logo: "7", conference: "West" },
    { name: "Milwaukee Bucks", record: "42-23", logo: "15", conference: "East" },
    { name: "Phoenix Suns", record: "41-24", logo: "21", conference: "West" },
    { name: "Philadelphia 76ers", record: "40-25", logo: "20", conference: "East" },
    { name: "Los Angeles Lakers", record: "39-26", logo: "14", conference: "West" },
    { name: "Miami Heat", record: "38-27", logo: "16", conference: "East" },
    { name: "Sacramento Kings", record: "37-28", logo: "23", conference: "West" }
  ];

  // Filter by conference
  let filteredRankings = mockRankings;
  if (conferenceFilter !== "all") {
    filteredRankings = mockRankings.filter(team => 
      team.conference.toLowerCase() === conferenceFilter
    );
  }

  filteredRankings.forEach((team, index) => {
    const teamDiv = document.createElement("div");
    teamDiv.className = "team-ranking";
    const [wins, losses] = team.record.split("-");
    
    teamDiv.innerHTML = `
      <div class="team-info">
        <div class="team-logo">
          <img src="https://cdn.nba.com/logos/nba/${team.logo}/primary/L/logo.svg" 
               alt="${team.name}" 
               onerror="this.style.display='none'">
        </div>
        <div class="team-details">
          <h4>${team.name}</h4>
          <p>${team.conference} Conference</p>
        </div>
      </div>
      <div class="team-record">
        <span class="wins">${wins}</span>-<span class="losses">${losses}</span>
      </div>
    `;
    
    teamDiv.addEventListener("click", () => showTeamDetails(team));
    container.appendChild(teamDiv);
  });
}

// Load season stats
async function loadSeasonStats() {
  const container = document.getElementById("seasonChart");
  container.innerHTML = `<canvas id="teamsStatsChart"></canvas>`;

  // Obtén equipos y sus estadísticas promedio
  try {
    const teamsResponse = await fetch(NBA_APIS.teams);
    const teamsData = await teamsResponse.json();
    const teams = teamsData.data;

    // Para demo, solo los primeros 10 equipos
    const statsPromises = teams.slice(0, 10).map(async (team) => {
      // Busca un jugador del equipo para obtener stats (la API no da stats de equipo)
      const playersResponse = await fetch(`${NBA_APIS.players}?team_ids[]=${team.id}&per_page=1`);
      const playersData = await playersResponse.json();
      const player = playersData.data[0];
      if (!player) return { team: team.full_name, pts: 0, ast: 0, reb: 0 };

      const statsResponse = await fetch(`${NBA_APIS.stats}?season=${currentSeason}&player_ids[]=${player.id}`);
      const statsData = await statsResponse.json();
      const stats = statsData.data[0] || { pts: 0, ast: 0, reb: 0 };
      return { team: team.full_name, pts: stats.pts, ast: stats.ast, reb: stats.reb };
    });

    const statsList = await Promise.all(statsPromises);

    // Prepara datos para Chart.js
    const labels = statsList.map(s => s.team);
    const pts = statsList.map(s => s.pts);
    const ast = statsList.map(s => s.ast);
    const reb = statsList.map(s => s.reb);

    // Crea la gráfica
    new Chart(document.getElementById('teamsStatsChart'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: 'PPG', data: pts, backgroundColor: '#4ade80' },
          { label: 'APG', data: ast, backgroundColor: '#60a5fa' },
          { label: 'RPG', data: reb, backgroundColor: '#f59e0b' }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top' }, title: { display: true, text: `Estadísticas Promedio por Equipo (${currentSeason})` } }
      }
    });

  } catch (error) {
    container.innerHTML = "<p style='color:red'>No se pudieron cargar las estadísticas.</p>";
  }
}

// Load news
function loadNews() {
  const container = document.getElementById("newsSection");
  const mockNews = [
    {
      title: "Lakers Secure Playoff Spot with Victory Over Warriors",
      summary: "LeBron James leads the charge with 35 points in crucial win",
      time: "2 hours ago",
      image: "https://cdn.nba.com/manage/2023/10/lebron-james-lakers.jpg"
    },
    {
      title: "Jayson Tatum Named Eastern Conference Player of the Week",
      summary: "Celtics star averages 28.5 points in three-game winning streak",
      time: "5 hours ago",
      image: "https://cdn.nba.com/manage/2023/10/jayson-tatum-celtics.jpg"
    },
    {
      title: "Trade Deadline Approaches: Top Rumors and Predictions",
      summary: "Several teams looking to make moves before the deadline",
      time: "1 day ago",
      image: "https://cdn.nba.com/manage/2023/10/trade-deadline.jpg"
    }
  ];

  container.innerHTML = "";
  mockNews.forEach(news => {
    const newsCard = document.createElement("div");
    newsCard.className = "news-card";
    newsCard.innerHTML = `
      <div class="news-image">
        <img src="${news.image}" alt="${news.title}" onerror="this.style.display='none'">
      </div>
      <div class="news-content">
        <h4>${news.title}</h4>
        <p>${news.summary}</p>
        <small>${news.time}</small>
      </div>
    `;
    container.appendChild(newsCard);
  });
}

// Load player comparison
function loadPlayerComparison() {
  const container = document.getElementById("playerComparison");
  const comparisonData = {
    player1: {
      name: "LeBron James",
      team: "Lakers",
      stats: { pts: 28.5, ast: 8.2, reb: 7.8 }
    },
    player2: {
      name: "Jayson Tatum",
      team: "Celtics", 
      stats: { pts: 30.2, ast: 4.5, reb: 8.1 }
    }
  };

  container.innerHTML = `
    <div class="comparison-header">
      <h3>Comparación de Jugadores</h3>
    </div>
    <div class="comparison-content">
      <div class="player-comparison-card">
        <h4>${comparisonData.player1.name}</h4>
        <p>${comparisonData.player1.team}</p>
        <div class="comparison-stats">
          <div>PPG: ${comparisonData.player1.stats.pts}</div>
          <div>APG: ${comparisonData.player1.stats.ast}</div>
          <div>RPG: ${comparisonData.player1.stats.reb}</div>
        </div>
      </div>
      <div class="vs-divider">VS</div>
      <div class="player-comparison-card">
        <h4>${comparisonData.player2.name}</h4>
        <p>${comparisonData.player2.team}</p>
        <div class="comparison-stats">
          <div>PPG: ${comparisonData.player2.stats.pts}</div>
          <div>APG: ${comparisonData.player2.stats.ast}</div>
          <div>RPG: ${comparisonData.player2.stats.reb}</div>
        </div>
      </div>
    </div>
  `;
}

// Search functionality
function openSearchModal() {
  const modal = document.getElementById("searchModal");
  modal.style.display = "block";
  document.getElementById("searchInput").focus();
}

function closeSearchModal() {
  const modal = document.getElementById("searchModal");
  modal.style.display = "none";
  document.getElementById("searchInput").value = "";
  document.getElementById("searchResults").innerHTML = "";
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  const resultsContainer = document.getElementById("searchResults");
  
  if (query.length < 2) {
    resultsContainer.innerHTML = "";
    return;
  }

  // Search in players and teams
  const playerResults = playersData.filter(player => 
    `${player.first_name} ${player.last_name}`.toLowerCase().includes(query)
  ).slice(0, 5);

  const teamResults = teamsData.filter(team =>
    team.full_name.toLowerCase().includes(query) || 
    team.name.toLowerCase().includes(query)
  ).slice(0, 5);

  let resultsHTML = "";
  
  if (playerResults.length > 0) {
    resultsHTML += "<h4>Jugadores</h4>";
    playerResults.forEach(player => {
      resultsHTML += `
        <div class="search-result" onclick="showPlayerDetails(${JSON.stringify(player).replace(/"/g, '&quot;')})">
          <i class="fas fa-user"></i>
          <span>${player.first_name} ${player.last_name} - ${player.team?.full_name || "NBA"}</span>
        </div>
      `;
    });
  }

  if (teamResults.length > 0) {
    resultsHTML += "<h4>Equipos</h4>";
    teamResults.forEach(team => {
      resultsHTML += `
        <div class="search-result" onclick="showTeamDetails(${JSON.stringify(team).replace(/"/g, '&quot;')})">
          <i class="fas fa-basketball-ball"></i>
          <span>${team.full_name}</span>
        </div>
      `;
    });
  }

  if (playerResults.length === 0 && teamResults.length === 0) {
    resultsHTML = "<p>No se encontraron resultados</p>";
  }

  resultsContainer.innerHTML = resultsHTML;
}

// Show player details
function showPlayerDetails(player) {
  alert(`Detalles de ${player.first_name} ${player.last_name}\nEquipo: ${player.team?.full_name || "NBA"}\nPosición: ${player.position || "N/A"}`);
  closeSearchModal();
}

// Show team details
function showTeamDetails(team) {
  alert(`Detalles de ${team.full_name || team.name}\nConferencia: ${team.conference || "N/A"}\nDivisión: ${team.division || "N/A"}`);
}

// Show section
function showSection(section) {
  // Oculta todas las secciones
  document.getElementById('dashboardSection').style.display = 'none';
  document.getElementById('playersSection').style.display = 'none';
  document.getElementById('teamsSection').style.display = 'none';
  document.getElementById('standingsSection').style.display = 'none';
  document.getElementById('newsSectionWrap').style.display = 'none';
  document.getElementById('analyticsSection').style.display = 'none';

  // Quita la clase activa del menú
  document.querySelectorAll('nav ul li').forEach(li => li.classList.remove('active'));

  // Muestra la sección seleccionada y marca el menú
  switch (section) {
    case 'dashboard':
      document.getElementById('dashboardSection').style.display = '';
      document.getElementById('nav-dashboard').classList.add('active');
      break;
    case 'players':
      document.getElementById('playersSection').style.display = '';
      document.getElementById('nav-players').classList.add('active');
      loadTopPlayers();
      break;
    case 'teams':
      document.getElementById('teamsSection').style.display = '';
      document.getElementById('nav-teams').classList.add('active');
      loadTeamRankings();
      break;
    case 'standings':
      document.getElementById('standingsSection').style.display = '';
      document.getElementById('nav-standings').classList.add('active');
      loadSeasonStats();
      break;
    case 'analytics':
      document.getElementById('analyticsSection').style.display = '';
      document.getElementById('nav-analytics').classList.add('active');
      loadPlayerComparison();
      break;
    case 'news':
      document.getElementById('newsSectionWrap').style.display = '';
      document.getElementById('nav-news').classList.add('active');
      loadNews();
      break;
    default:
      document.getElementById('playersSection').style.display = '';
      document.getElementById('nav-players').classList.add('active');
      loadTopPlayers();
      break;
  }
}

// Refresh data
async function refreshData() {
  try {
    await Promise.all([
      loadTopPlayers(),
      loadSeasonStats()
    ]);
  } catch (error) {
    console.error("Error refreshing data:", error);
  }
}

// Fallback data functions
function getFallbackTeams() {
  return [
    { id: 1, full_name: "Boston Celtics", name: "Celtics", conference: "East" },
    { id: 2, full_name: "Los Angeles Lakers", name: "Lakers", conference: "West" },
    { id: 3, full_name: "Golden State Warriors", name: "Warriors", conference: "West" },
    { id: 4, full_name: "Miami Heat", name: "Heat", conference: "East" }
  ];
}

function getFallbackPlayers() {
  return [
    {
      id: 1,
      first_name: "LeBron",
      last_name: "James",
      team: { full_name: "Los Angeles Lakers" },
      stats: { pts: 28.5, ast: 8.2, reb: 7.8 }
    },
    {
      id: 2,
      first_name: "Stephen",
      last_name: "Curry",
      team: { full_name: "Golden State Warriors" },
      stats: { pts: 29.1, ast: 6.3, reb: 5.1 }
    },
    {
      id: 3,
      first_name: "Jayson",
      last_name: "Tatum",
      team: { full_name: "Boston Celtics" },
      stats: { pts: 30.2, ast: 4.5, reb: 8.1 }
    }
  ];
}

function generateMockStats() {
  return {
    pts: (Math.random() * 25 + 10).toFixed(1),
    ast: (Math.random() * 8 + 2).toFixed(1),
    reb: (Math.random() * 10 + 3).toFixed(1)
  };
}

function loadFallbackData() {
  displayTopPlayers(getFallbackPlayers());
  loadTeamRankings();
  loadSeasonStats();
  loadNews();
  loadPlayerComparison();
}