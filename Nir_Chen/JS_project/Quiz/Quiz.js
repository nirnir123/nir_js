const apiUrl = "https://opentdb.com/api.php?amount=10&type=multiple";
let currentQuestionIndex = 0;
let score = 0;
let questions = [];

async function fetchQuestions() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        questions = data.results;
        loadQuestion();
    } catch (error) {
        console.error("Error fetching questions:", error);
        document.getElementById("question-text").innerText = "Failed to load questions.";
    }
}

function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const question = questions[currentQuestionIndex];
        document.getElementById("question-text").innerText = question.question;
        document.getElementById("question-number").innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;

        const allOptions = [...question.incorrect_answers, question.correct_answer];
        shuffleArray(allOptions); // Shuffle answers so the correct one isn't always first

        const buttons = document.querySelectorAll(".answer-button");
        buttons.forEach((button, index) => {
            button.innerText = allOptions[index];
        });
    } else {
        showResult();
    }
}

function answerQuestion(answerIndex) {
    const question = questions[currentQuestionIndex];
    const allOptions = [...question.incorrect_answers, question.correct_answer];

    if (allOptions[answerIndex] === question.correct_answer) {
        score++;
    }

    currentQuestionIndex++;
    loadQuestion();
}

function showResult() {
    document.getElementById("question-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";

    const percentage = ((score / questions.length) * 100).toFixed(2);
    document.getElementById("result-text").innerText = `You answered ${score} out of ${questions.length} questions correctly!`;
    document.getElementById("percentage").innerText = `You got ${percentage}% correct!`;
}

function resetQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    document.getElementById("result-container").style.display = "none";
    document.getElementById("question-container").style.display = "block";
    fetchQuestions(); // Fetch questions again
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

fetchQuestions();
