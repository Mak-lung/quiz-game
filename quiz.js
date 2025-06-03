let currentQuestionIndex = 0;
let score = 0;
let timer;
const TIME_LIMIT = 10;
const username = localStorage.getItem("username");
let currentQuestions = [];

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    currentQuestions = [
        ...quizData[username].selfRespect,
        ...quizData[username].selfControl
    ].sort(() => Math.random() - 0.5);
    updateProgress();
    showQuestion();
}

function updateProgress() {
    const progress = (currentQuestionIndex + 1) / currentQuestions.length * 100;
    document.getElementById("progress").style.width = `${progress}%`;
    document.getElementById("progress").style.setProperty('--progress-width', `${progress}%`);
    document.getElementById("progress-text").textContent = `${currentQuestionIndex + 1}/${currentQuestions.length}`;
}

function showQuestion() {
    clearInterval(timer);
    document.getElementById("timer").textContent = TIME_LIMIT;
    let timeLeft = TIME_LIMIT;
    const timerProgress = document.getElementById("timer-progress");
    timerProgress.style.animation = 'none';
    timerProgress.offsetHeight; // Trigger reflow to restart animation
    timerProgress.style.animation = `timerSpin ${TIME_LIMIT}s linear forwards`;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);

    const question = currentQuestions[currentQuestionIndex];
    document.getElementById("question").textContent = question.question;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";
    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option");
        button.style.setProperty('--option-index', index);
        button.onclick = () => selectOption(option, question, button);
        optionsDiv.appendChild(button);
    });
    // 清空之前的解釋（如果有）
    const explanationDiv = document.createElement("div");
    explanationDiv.id = "explanation";
    explanationDiv.classList.add("explanation");
    optionsDiv.appendChild(explanationDiv);
    document.getElementById("next-btn").disabled = true;
}

function selectOption(selected, question, button) {
    clearInterval(timer);
    const isCorrect = selected === question.answer;
    // 變色並禁用所有選項
    const options = document.querySelectorAll(".option");
    options.forEach(opt => {
        opt.disabled = true; // 禁用按鈕
        if (opt.textContent === question.answer) {
            opt.classList.add("correct"); // 正確答案變綠
        } else if (opt === button && !isCorrect) {
            opt.classList.add("wrong"); // 錯誤答案變紅
        }
    });

    // 計分和統計
    if (isCorrect) {
        score++;
    }
    updateStats(question, isCorrect);

    // 顯示正確答案和解釋
    const explanationDiv = document.getElementById("explanation");
    let explanationText = "";
    if (username === "KING") {
        explanationText = isCorrect 
            ? `答對了！正確答案是「${question.answer}」。`
            : `答錯了。正確答案是「${question.answer}」。`;
    } else {
        explanationText = isCorrect 
            ? `Correct! The answer is "${question.answer}".`
            : `Incorrect. The correct answer is "${question.answer}".`;
    }
    explanationDiv.innerHTML = `<p>${explanationText}</p>`;

    // 啟用「下一題」按鈕
    document.getElementById("next-btn").disabled = false;
}

function updateStats(question, isCorrect) {
    const stats = JSON.parse(localStorage.getItem("stats") || "{}");
    if (!stats[username]) {
        stats[username] = {
            selfRespect: { correct: 0, total: 0 },
            selfControl: { correct: 0, total: 0 }
        };
    }
    const category = question.type === "word" || question.type === "idiom" ? question.type : question.type === "phrase" ? "idiom" : "word";
    stats[username][question.type === "word" || question.type === "idiom" ? question.type : "word"].total++;
    if (isCorrect) {
        stats[username][question.type === "word" || question.type === "idiom" ? question.type : "word"].correct++;
    }
    localStorage.setItem("stats", JSON.stringify(stats));
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        updateProgress();
        showQuestion();
    } else {
        alert(`測驗結束！你的得分：${score} / ${currentQuestions.length}`);
        window.location.href = "stats.html";
    }
}

startQuiz();
