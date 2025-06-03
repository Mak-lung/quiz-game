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

    statsDiv.innerHTML = `
        <div class="stat-card" style="--card-index: 0">
            <h3>${username} 的熟識度</h3>
            <p>自我尊重類：${selfRespect.correct}/${selfRespect.total}（正確率：${selfRespectRate}%）</p>
            <p>自我節制類：${selfControl.correct}/${selfControl.total}（正確率：${selfControlRate}%）</p>
        </div>
    `;
}

showStats();