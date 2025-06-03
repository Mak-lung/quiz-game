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
    document.getElementById("next-btn").disabled = true;
}

function selectOption(selected, question, button) {
    clearInterval(timer);
    const isCorrect = selected === question.answer;
    button.classList.add(isCorrect ? "correct" : "wrong");
    if (isCorrect) {
        score++;
    }
    updateStats(question, isCorrect);
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
        stats[username][question.type === "word" || question.type === "idiom" ? questionpolicy: question.type === "word" || question.type === "idiom" || question.type === "phrase"].total++;
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