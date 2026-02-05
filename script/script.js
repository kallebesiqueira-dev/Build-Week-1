const questions = [
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "What does CPU stand for?",
    correct_answer: "Central Processing Unit",
    incorrect_answers: [
      "Central Process Unit",
      "Computer Personal Unit",
      "Central Processor Unit",
    ],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "In the programming language Java, which of these keywords would you put on a variable to make sure it doesn&#039;t get modified?",
    correct_answer: "Final",
    incorrect_answers: ["Static", "Private", "Public"],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question: "The logo for Snapchat is a Bell.",
    correct_answer: "False",
    incorrect_answers: ["True"],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question:
      "Pointers were not used in the original C programming language; they were added later on in C++.",
    correct_answer: "False",
    incorrect_answers: ["True"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "What is the most preferred image format used for logos in the Wikimedia database?",
    correct_answer: ".svg",
    incorrect_answers: [".png", ".jpeg", ".gif"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "In web design, what does CSS stand for?",
    correct_answer: "Cascading Style Sheet",
    incorrect_answers: [
      "Counter Strike: Source",
      "Corrective Style Sheet",
      "Computer Style Sheet",
    ],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "What is the code name for the mobile operating system Android 7.0?",
    correct_answer: "Nougat",
    incorrect_answers: ["Ice Cream Sandwich", "Jelly Bean", "Marshmallow"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question: "On Twitter, what is the character limit for a Tweet?",
    correct_answer: "140",
    incorrect_answers: ["120", "160", "100"],
  },
  {
    category: "Science: Computers",
    type: "boolean",
    difficulty: "easy",
    question: "Linux was first created as an alternative to Windows XP.",
    correct_answer: "False",
    incorrect_answers: ["True"],
  },
  {
    category: "Science: Computers",
    type: "multiple",
    difficulty: "easy",
    question:
      "Which programming language shares its name with an island in Indonesia?",
    correct_answer: "Java",
    incorrect_answers: ["Python", "C", "Jakarta"],
  },
];



/* window.addEventListener("load", function () {
  // Bottone di prova per il timer
  let prova = document.querySelector("#contoRovescia");
  prova.addEventListener("click", () => updateTimer());
  // Fine bottone di prova
});

// Funzione per fare il conto alla rovescia
function updateTimer() {
  let tempo = 30;
  // Provo a iniettare il conto nel body
  let container = document.querySelector("body");
  let elemento = document.createElement("p");
  const timerId = setInterval(() => {
    console.log(tempo);
    elemento.textContent = tempo;
    tempo--;
    if (tempo < 0) {
      clearInterval(timerId);
      console.log("Timer scaduto!");
    }
  }, 1000);
  container.appendChild(elemento);
}  */

// ==== Ho fatto qui sotto vedi se ti serve qualche codice ====

document.addEventListener("DOMContentLoaded", () => {
  // Sezione pagina introduttiva: abilita il pulsante solo dopo il check
  const checkbox = document.getElementById("promiseCheck");
  const proceedButton = document.getElementById("proceedButton");

  if (checkbox && proceedButton) {
    const toggleProceed = () => {
      if (checkbox.checked) {
        proceedButton.setAttribute("aria-disabled", "false");
        proceedButton.removeAttribute("tabindex");
      } else {
        proceedButton.setAttribute("aria-disabled", "true");
        proceedButton.setAttribute("tabindex", "-1");
      }
    };

    toggleProceed();
    checkbox.addEventListener("change", toggleProceed);
  }

  // Sezione pagina domande: riferimenti agli elementi dinamici
  const questionTitle = document.getElementById("questionTitle");
  const questionOptions = document.getElementById("questionOptions");
  const questionFooter = document.getElementById("questionFooter");
  const timerValue = document.getElementById("timerValue");
  const timerRing = document.querySelector(".timer");

  const isQuestionPage = !!(questionTitle && questionOptions && questionFooter && timerValue && timerRing);

  // Stato del quiz
  const totalQuestions = questions.length;
  let currentIndex = 0;
  let timerId = null;
  let remaining = 30;
  const totalTime = 30;
  let score = 0;
  const passThreshold = 0.6; // 60% correct answers required to pass the quiz

  // Decodifica entità HTML presenti nelle domande
  const decodeHTML = (text) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    return doc.documentElement.textContent;
  };

  // Mescola le risposte per evitare ordine fisso
  const shuffle = (array) => {
    const items = [...array];
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  };

  // Ferma il timer corrente
  const stopTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  // Aggiorna l'angolo del cerchio in base al tempo rimanente
  const updateTimerRing = () => {
    const angle = Math.max(0, (remaining / totalTime) * 360);
    timerRing.style.setProperty("--timer-angle", `${angle}deg`);
  };

  // Avvia il timer di 30 secondi per la domanda corrente
  const startTimer = () => {
    remaining = totalTime;
    timerValue.textContent = remaining.toString();
    updateTimerRing();
    stopTimer();
    timerId = setInterval(() => {
      remaining -= 1;
      timerValue.textContent = remaining.toString();
      updateTimerRing();
      if (remaining <= 0) {
        stopTimer();
        goToNextQuestion();
      }
    }, 1000);
  };

  // Renderizza domanda e risposte, poi avvia il timer
  const renderQuestion = () => {
    const current = questions[currentIndex];
    const answers = shuffle([
      current.correct_answer,
      ...current.incorrect_answers,
    ]);

    const correctDecoded = decodeHTML(current.correct_answer);

    questionTitle.textContent = decodeHTML(current.question);
    
    // Clear previous options safely
    while (questionOptions.firstChild) {
      questionOptions.removeChild(questionOptions.firstChild);
    }
    
    answers.forEach((answer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      const decodedAnswer = decodeHTML(answer);
      button.textContent = decodedAnswer;
      button.addEventListener("click", () => {
        if (decodedAnswer === correctDecoded) {
          score += 1;
        }
        stopTimer();
        goToNextQuestion();
      });
      questionOptions.appendChild(button);
    });

    // Build question footer safely
    while (questionFooter.firstChild) {
      questionFooter.removeChild(questionFooter.firstChild);
    }
    questionFooter.textContent = `QUESTION ${currentIndex + 1} / `;
    const totalStrong = document.createElement("strong");
    totalStrong.className = "question-total";
    totalStrong.textContent = totalQuestions.toString();
    questionFooter.appendChild(totalStrong);
    startTimer();
  };

  // Passa alla prossima domanda o termina il quiz
  const goToNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      currentIndex += 1;
      renderQuestion();
    } else {
      localStorage.setItem("quizScore", score.toString());
      localStorage.setItem("quizTotal", totalQuestions.toString());
      localStorage.setItem("quizPassed", ((score / totalQuestions) >= passThreshold).toString());
      window.location.href = "pagina3.html";
    }
  };

  // Prima renderizzazione
  if (isQuestionPage) {
    renderQuestion();
  }

  // Pagina risultati: mostra messaggio e punteggio in inglese
  const resultMessage = document.getElementById("resultMessage");
  const resultScore = document.getElementById("resultScore");

  if (resultMessage && resultScore) {
    const storedScore = Number(localStorage.getItem("quizScore") || "0");
    const storedTotal = Number(localStorage.getItem("quizTotal") || totalQuestions.toString());
    const passed = (localStorage.getItem("quizPassed") || "false") === "true";
    
    // Build result score DOM safely to avoid XSS
    resultScore.textContent = "Score: ";
    const scoreNumber = document.createElement("span");
    scoreNumber.className = "result-number";
    scoreNumber.textContent = storedScore.toString();
    resultScore.appendChild(scoreNumber);
    resultScore.appendChild(document.createTextNode(" / "));
    const totalStrong = document.createElement("strong");
    totalStrong.className = "result-total";
    totalStrong.textContent = storedTotal.toString();
    resultScore.appendChild(totalStrong);
    
    resultMessage.textContent = passed
      ? "Congratulations, you passed!"
      : "You didn't pass this time. Try again!";
  }
});
