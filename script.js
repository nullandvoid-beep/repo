
const API_BASE_URL = 'https://cricbuzz-cricket.p.rapidapi.com';
const API_KEY = '6bb2dfcf9amshb5bd48348a98da6p1317c2jsn537a4af5b5e5'; 

const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
};

const liveMatchesContainer = document.getElementById('live-matches');
const liveMatchesTab = document.getElementById('live-matches-container');
const upcomingMatchesTab = document.getElementById('upcoming-matches-container');
const recentMatchesTab = document.getElementById('recent-matches-container');
const playersTable = document.getElementById('players-table');

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
    loadLiveMatches();
  } else if (window.location.pathname.includes('matches.html')) {
    loadAllMatches();
  } else if (window.location.pathname.includes('players.html')) {
    loadPlayers();
  }
});

async function loadLiveMatches() {
  try {
    const response = await fetch(`${API_BASE_URL}/matches/v1/live`, { headers });
    const data = await response.json();
    
    if (data.typeMatches && data.typeMatches.length > 0) {
      let html = '';
      
      data.typeMatches.forEach(typeMatch => {
        typeMatch.seriesMatches.forEach(series => {
          if (series.seriesAdWrapper && series.seriesAdWrapper.matches) {
            series.seriesAdWrapper.matches.forEach(match => {
              html += createMatchCard(match);
            });
          }
        });
      });
      
      liveMatchesContainer.innerHTML = html || '<p>No live matches currently</p>';
    } else {
      liveMatchesContainer.innerHTML = '<p>No live matches currently</p>';
    }
  } catch (error) {
    console.error('Error fetching live matches:', error);
    liveMatchesContainer.innerHTML = '<p>Error loading matches. Please try again later.</p>';
  }
}

async function loadAllMatches() {
  try {
    const [liveResponse, upcomingResponse, recentResponse] = await Promise.all([
      fetch(`${API_BASE_URL}/matches/v1/live`, { headers }),
      fetch(`${API_BASE_URL}/matches/v1/upcoming`, { headers }),
      fetch(`${API_BASE_URL}/matches/v1/recent`, { headers })
    ]);
    
    const liveData = await liveResponse.json();
    const upcomingData = await upcomingResponse.json();
    const recentData = await recentResponse.json();
    
    if (liveData.typeMatches && liveData.typeMatches.length > 0) {
      let html = '';
      
      liveData.typeMatches.forEach(typeMatch => {
        typeMatch.seriesMatches.forEach(series => {
          if (series.seriesAdWrapper && series.seriesAdWrapper.matches) {
            series.seriesAdWrapper.matches.forEach(match => {
              html += createMatchCard(match);
            });
          }
        });
      });
      
      liveMatchesTab.innerHTML = html || '<p>No live matches currently</p>';
    } else {
      liveMatchesTab.innerHTML = '<p>No live matches currently</p>';
    }
    
    if (upcomingData.typeMatches && upcomingData.typeMatches.length > 0) {
      let html = '';
      
      upcomingData.typeMatches.forEach(typeMatch => {
        typeMatch.seriesMatches.forEach(series => {
          if (series.seriesAdWrapper && series.seriesAdWrapper.matches) {
            series.seriesAdWrapper.matches.forEach(match => {
              html += createMatchCard(match);
            });
          }
        });
      });
      
      upcomingMatchesTab.innerHTML = html || '<p>No upcoming matches scheduled</p>';
    } else {
      upcomingMatchesTab.innerHTML = '<p>No upcoming matches scheduled</p>';
    }
    
    if (recentData.typeMatches && recentData.typeMatches.length > 0) {
      let html = '';
      
      recentData.typeMatches.forEach(typeMatch => {
        typeMatch.seriesMatches.forEach(series => {
          if (series.seriesAdWrapper && series.seriesAdWrapper.matches) {
            series.seriesAdWrapper.matches.forEach(match => {
              html += createMatchCard(match);
            });
          }
        });
      });
      
      recentMatchesTab.innerHTML = html || '<p>No recent matches found</p>';
    } else {
      recentMatchesTab.innerHTML = '<p>No recent matches found</p>';
    }
  } catch (error) {
    console.error('Error fetching matches:', error);
    liveMatchesTab.innerHTML = '<p>Error loading matches. Please try again later.</p>';
    upcomingMatchesTab.innerHTML = '<p>Error loading matches. Please try again later.</p>';
    recentMatchesTab.innerHTML = '<p>Error loading matches. Please try again later.</p>';
  }
}

async function loadPlayers() {
  try {
    const response = await fetch(`${API_BASE_URL}/stats/v1/player/trending`, { headers });
    const data = await response.json();
    
    if (data.player && data.player.length > 0) {
      let html = '';
      
      data.player.forEach((player, index) => {
        html += `
          <tr>
            <td>${index + 1}. ${player.name}</td>
            <td>${player.teamName}</td>
            <td>${player.matches || '-'}</td>
            <td>${player.runs || '-'}</td>
            <td>${player.wickets || '-'}</td>
            <td>${player.average || '-'}</td>
          </tr>
        `;
      });
      
      playersTable.innerHTML = html;
    } else {
      playersTable.innerHTML = '<tr><td colspan="6">No players found</td></tr>';
    }
  } catch (error) {
    console.error('Error fetching players:', error);
    playersTable.innerHTML = '<tr><td colspan="6">Error loading players. Please try again later.</td></tr>';
  }
}

function createMatchCard(match) {
  const matchInfo = match.matchInfo;
  const team1 = matchInfo.team1;
  const team2 = matchInfo.team2;
  const venue = matchInfo.venueInfo;
  
  const team1Score = match.matchScore ? formatScore(match.matchScore.team1Score) : 'Yet to bat';
  const team2Score = match.matchScore ? formatScore(match.matchScore.team2Score) : 'Yet to bat';
  
  const playersUrl = `match-details.html?matchId=${matchInfo.matchId}&team1=${encodeURIComponent(team1.teamName)}&team2=${encodeURIComponent(team2.teamName)}&team1Id=${team1.teamId}&team2Id=${team2.teamId}`;
  
  return `
    <div class="col-md-6 col-lg-4">
      <div class="card match-card mb-4">
        <div class="card-body">
          <h5 class="card-title">${team1.teamName} vs ${team2.teamName}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${matchInfo.matchDesc} - ${matchInfo.matchFormat}</h6>
          
          <div class="match-details mt-3">
            <p class="mb-1"><strong>Venue:</strong> ${venue ? `${venue.ground}, ${venue.city}` : 'TBD'}</p>
            <p class="mb-1"><strong>Status:</strong> ${matchInfo.status}</p>
          </div>
          
          <div class="scores mt-3">
            <div class="team-score mb-2">
              <strong>${team1.teamName}:</strong> ${team1Score}
            </div>
            <div class="team-score">
              <strong>${team2.teamName}:</strong> ${team2Score}
            </div>
          </div>
          
          <a href="${playersUrl}" class="btn btn-primary btn-sm mt-3">View Players</a>
        </div>
      </div>
    </div>
  `;
}

function formatScore(teamScore) {
  if (!teamScore) return 'Yet to bat';
  
  let scoreString = '';
  for (const inning in teamScore) {
    const score = teamScore[inning];
    if (score && score.runs) {
      scoreString += `${score.runs}/${score.wickets || 0} (${score.overs || '0'})<br>`;
    }
  }
  
  return scoreString || 'Yet to bat';
}

document.getElementById('playerSearch')?.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();
  const rows = document.querySelectorAll('#players-table tr');
  
  rows.forEach(row => {
    const playerName = row.querySelector('td').textContent.toLowerCase();
    if (playerName.includes(searchTerm)) {
      row.style.display = 'table-row';
    } else {
      row.style.display = 'none';
    }
  });
});