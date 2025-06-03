function showStats() {
    const username = localStorage.getItem("username");
    const stats = JSON.parse(localStorage.getItem("stats") || "{}");
    const statsDiv = document.getElementById("stats");
    if (!stats[username]) {
        statsDiv.innerHTML = "<p>尚未有答題記錄！</p>";
        return;
    }

    const selfRespect = stats[username].selfRespect;
    const selfControl = stats[username].selfControl;
    const selfRespectRate = selfRespect.total > 0 ? ((selfRespect.correct / selfRespect.total) * 100).toFixed(2) : 0;
    const selfControlRate = selfControl.total > 0 ? ((selfControl.correct / selfControl.total) * 100).toFixed(2) : 0;

    const circumference = 314.159; // 2 * π * r (r = 50)

    statsDiv.innerHTML = `
        <div class="stat-card" style="--card-index: 0">
            <h3>${username} 的熟識度</h3>
            <div class="ring-container">
                <h4>自我尊重類</h4>
                <div class="ring">
                    <svg class="ring-circle" width="120" height="120">
                        <circle class="ring-bg" cx="60" cy="60" r="50"></circle>
                        <circle class="ring-progress" cx="60" cy="60" r="50" style="--progress: ${selfRespectRate * circumference / 100};"></circle>
                    </svg>
                    <span class="ring-text">${selfRespectRate}%</span>
                </div>
                <p>${selfRespect.correct}/${selfRespect.total}</p>
            </div>
            <div class="ring-container">
                <h4>自我節制類</h4>
                <div class="ring">
                    <svg class="ring-circle" width="120" height="120">
                        <circle class="ring-bg" cx="60" cy="60" r="50"></circle>
                        <circle class="ring-progress" cx="60" cy="60" r="50" style="--progress: ${selfControlRate * circumference / 100};"></circle>
                    </svg>
                    <span class="ring-text">${selfControlRate}%</span>
                </div>
                <p>${selfControl.correct}/${selfControl.total}</p>
            </div>
        </div>
    `;
}

showStats();