// Bitcoin Script Learning Lab - Interactive Quiz System
// Tests knowledge and reinforces learning

class QuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.score = 0;
        this.quizData = this.initializeQuizData();
    }

    initializeQuizData() {
        return {
            beginner: [
                {
                    question: "What does P2SH stand for?",
                    options: [
                        "Pay-to-Script-Hash",
                        "Pay-to-Simple-Hash", 
                        "Pay-to-Secure-Hash",
                        "Pay-to-Smart-Hash"
                    ],
                    correct: 0,
                    explanation: "P2SH stands for Pay-to-Script-Hash, which allows complex scripts to be represented by a hash."
                },
                {
                    question: "How many signatures are required in a 2-of-3 multisig?",
                    options: ["1", "2", "3", "4"],
                    correct: 1,
                    explanation: "A 2-of-3 multisig requires exactly 2 signatures from 3 possible signers."
                },
                {
                    question: "What opcode is used to verify a signature?",
                    options: ["OP_VERIFY", "OP_CHECKSIG", "OP_SIG", "OP_VALIDATE"],
                    correct: 1,
                    explanation: "OP_CHECKSIG is used to verify that a signature is valid for a given public key."
                },
                {
                    question: "What is the purpose of OP_CHECKLOCKTIMEVERIFY?",
                    options: [
                        "Verify transaction fees",
                        "Check if current time >= locktime",
                        "Validate script length",
                        "Verify signature count"
                    ],
                    correct: 1,
                    explanation: "OP_CHECKLOCKTIMEVERIFY checks if the current time is greater than or equal to the specified locktime."
                }
            ],
            intermediate: [
                {
                    question: "In a Lightning Network script, what happens if someone tries to cheat?",
                    options: [
                        "The transaction fails",
                        "The revocation key can be used to punish them",
                        "The script becomes invalid",
                        "Nothing happens"
                    ],
                    correct: 1,
                    explanation: "The revocation key allows the honest party to immediately spend all funds if the other party tries to cheat."
                },
                {
                    question: "What is the main advantage of SegWit?",
                    options: [
                        "Lower transaction fees",
                        "Witness data separation",
                        "Smaller transaction size",
                        "All of the above"
                    ],
                    correct: 3,
                    explanation: "SegWit provides all these benefits: lower fees, witness data separation, and smaller transaction sizes."
                },
                {
                    question: "What does HTLC stand for?",
                    options: [
                        "Hash Time Locked Contract",
                        "High Throughput Lightning Channel",
                        "Hardware Trusted Ledger Code",
                        "Hash Transaction Lock Code"
                    ],
                    correct: 0,
                    explanation: "HTLC stands for Hash Time Locked Contract, used in Lightning Network and atomic swaps."
                }
            ],
            advanced: [
                {
                    question: "What is the purpose of OP_CHECKSEQUENCEVERIFY?",
                    options: [
                        "Check relative time locks",
                        "Verify transaction sequence",
                        "Validate script execution order",
                        "Check signature sequence"
                    ],
                    correct: 0,
                    explanation: "OP_CHECKSEQUENCEVERIFY is used for relative time locks, checking if enough time has passed since the transaction was created."
                },
                {
                    question: "In Miniscript, what does 'or_b' represent?",
                    options: [
                        "OR condition with branching",
                        "Ordered response",
                        "Output requirement",
                        "Optional requirement"
                    ],
                    correct: 0,
                    explanation: "or_b represents an OR condition with branching in Miniscript, allowing different spending paths."
                }
            ]
        };
    }

    startQuiz(level) {
        this.currentQuiz = this.quizData[level];
        this.currentQuestion = 0;
        this.score = 0;
        this.displayQuiz();
    }

    displayQuiz() {
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) return;

        const question = this.currentQuiz[this.currentQuestion];
        
        quizContainer.innerHTML = `
            <div class="quiz-question">
                <h5>Question ${this.currentQuestion + 1} of ${this.currentQuiz.length}</h5>
                <p class="question-text">${question.question}</p>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <div class="quiz-option" onclick="selectAnswer(${index})">
                            <input type="radio" name="answer" value="${index}" id="option${index}">
                            <label for="option${index}">${option}</label>
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-actions">
                    <button class="btn btn-primary" onclick="submitAnswer()" id="submit-btn" disabled>Submit Answer</button>
                    <button class="btn btn-secondary" onclick="skipQuestion()">Skip</button>
                </div>
                <div class="quiz-progress">
                    <div class="progress">
                        <div class="progress-bar" style="width: ${((this.currentQuestion + 1) / this.currentQuiz.length) * 100}%"></div>
                    </div>
                </div>
            </div>
        `;
    }

    selectAnswer(index) {
        // Remove previous selection
        document.querySelectorAll('.quiz-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Add selection to clicked option
        document.querySelectorAll('.quiz-option')[index].classList.add('selected');
        
        // Enable submit button
        document.getElementById('submit-btn').disabled = false;
        
        // Store selected answer
        this.selectedAnswer = index;
    }

    submitAnswer() {
        if (this.selectedAnswer === undefined) return;
        
        const question = this.currentQuiz[this.currentQuestion];
        const isCorrect = this.selectedAnswer === question.correct;
        
        if (isCorrect) {
            this.score++;
        }
        
        this.showAnswerFeedback(question, isCorrect);
    }

    showAnswerFeedback(question, isCorrect) {
        const quizContainer = document.getElementById('quiz-container');
        
        quizContainer.innerHTML = `
            <div class="quiz-feedback">
                <div class="feedback-header ${isCorrect ? 'correct' : 'incorrect'}">
                    <h5>${isCorrect ? '✅ Correct!' : '❌ Incorrect'}</h5>
                </div>
                <div class="feedback-content">
                    <p><strong>Explanation:</strong> ${question.explanation}</p>
                    <div class="correct-answer">
                        <strong>Correct Answer:</strong> ${question.options[question.correct]}
                    </div>
                </div>
                <div class="quiz-actions">
                    <button class="btn btn-primary" onclick="nextQuestion()">
                        ${this.currentQuestion < this.currentQuiz.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    </button>
                </div>
            </div>
        `;
    }

    nextQuestion() {
        this.currentQuestion++;
        this.selectedAnswer = undefined;
        
        if (this.currentQuestion < this.currentQuiz.length) {
            this.displayQuiz();
        } else {
            this.showQuizResults();
        }
    }

    skipQuestion() {
        this.nextQuestion();
    }

    showQuizResults() {
        const quizContainer = document.getElementById('quiz-container');
        const percentage = Math.round((this.score / this.currentQuiz.length) * 100);
        
        let message = '';
        if (percentage >= 90) {
            message = '🎉 Excellent! You have a deep understanding of Bitcoin Script!';
        } else if (percentage >= 70) {
            message = '👍 Good job! You understand the basics well.';
        } else if (percentage >= 50) {
            message = '📚 Not bad! Keep studying to improve your knowledge.';
        } else {
            message = '📖 Keep learning! Review the materials and try again.';
        }
        
        quizContainer.innerHTML = `
            <div class="quiz-results">
                <h4>Quiz Complete!</h4>
                <div class="score-display">
                    <div class="score-circle">
                        <span class="score-number">${percentage}%</span>
                    </div>
                    <p class="score-text">${this.score} out of ${this.currentQuiz.length} correct</p>
                </div>
                <div class="results-message">
                    <p>${message}</p>
                </div>
                <div class="quiz-actions">
                    <button class="btn btn-primary" onclick="retakeQuiz()">Retake Quiz</button>
                    <button class="btn btn-secondary" onclick="startNewQuiz()">New Quiz</button>
                </div>
            </div>
        `;
    }

    retakeQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.displayQuiz();
    }

    startNewQuiz() {
        // Reset to quiz selection
        this.showQuizSelection();
    }

    showQuizSelection() {
        const quizContainer = document.getElementById('quiz-container');
        
        quizContainer.innerHTML = `
            <div class="quiz-selection">
                <h4>Choose Your Quiz Level</h4>
                <div class="quiz-levels">
                    <div class="quiz-level-card" onclick="startQuiz('beginner')">
                        <h5>🌱 Beginner</h5>
                        <p>Basic Bitcoin Script concepts</p>
                        <span class="question-count">4 questions</span>
                    </div>
                    <div class="quiz-level-card" onclick="startQuiz('intermediate')">
                        <h5>🚀 Intermediate</h5>
                        <p>Advanced scripting concepts</p>
                        <span class="question-count">3 questions</span>
                    </div>
                    <div class="quiz-level-card" onclick="startQuiz('advanced')">
                        <h5>⚡ Advanced</h5>
                        <p>Expert-level knowledge</p>
                        <span class="question-count">2 questions</span>
                    </div>
                </div>
            </div>
        `;
    }
}

// Global functions for HTML onclick handlers
function startQuiz(level) {
    window.quizSystem.startQuiz(level);
}

function selectAnswer(index) {
    window.quizSystem.selectAnswer(index);
}

function submitAnswer() {
    window.quizSystem.submitAnswer();
}

function nextQuestion() {
    window.quizSystem.nextQuestion();
}

function skipQuestion() {
    window.quizSystem.skipQuestion();
}

function retakeQuiz() {
    window.quizSystem.retakeQuiz();
}

function startNewQuiz() {
    window.quizSystem.startNewQuiz();
}

// Initialize quiz system
document.addEventListener('DOMContentLoaded', function() {
    window.quizSystem = new QuizSystem();
    console.log('🧠 Quiz System initialized!');
});
