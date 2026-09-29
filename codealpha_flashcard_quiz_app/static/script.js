// =====================================================
// FLASHCARD QUIZ APP
// Study Mode + Quiz Mode + CRUD
// =====================================================


// ================= GLOBAL VARIABLES =================

let flashcards = [];

let currentIndex = 0;

let showingAnswer = false;

let editingId = null;


// Quiz variables

let quizCards = [];

let quizIndex = 0;

let quizScore = 0;

let selectedAnswer = null;

let answerChecked = false;


// ================= STUDY MODE ELEMENTS =================

const cardNumber =
    document.getElementById("cardNumber");

const question =
    document.getElementById("question");

const answer =
    document.getElementById("answer");

const label =
    document.getElementById("label");

const showAnswerBtn =
    document.getElementById("showAnswerBtn");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");

const editBtn =
    document.getElementById("editBtn");

const deleteBtn =
    document.getElementById("deleteBtn");


// ================= GENERAL ELEMENTS =================

const addBtn =
    document.getElementById("addBtn");

const message =
    document.getElementById("message");

const modal =
    document.getElementById("modal");

const modalTitle =
    document.getElementById("modalTitle");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");

const form =
    document.getElementById("flashcardForm");

const questionInput =
    document.getElementById("questionInput");

const answerInput =
    document.getElementById("answerInput");


// ================= MODE ELEMENTS =================

const studyModeBtn =
    document.getElementById("studyModeBtn");

const quizModeBtn =
    document.getElementById("quizModeBtn");

const studyMode =
    document.getElementById("studyMode");

const quizMode =
    document.getElementById("quizMode");


// ================= QUIZ ELEMENTS =================

const quizNumber =
    document.getElementById("quizNumber");

const score =
    document.getElementById("score");

const quizQuestion =
    document.getElementById("quizQuestion");

const quizOptions =
    document.getElementById("quizOptions");

const quizMessage =
    document.getElementById("quizMessage");

const checkAnswerBtn =
    document.getElementById("checkAnswerBtn");

const nextQuestionBtn =
    document.getElementById("nextQuestionBtn");

const quizResult =
    document.getElementById("quizResult");

const finalScore =
    document.getElementById("finalScore");

const restartQuizBtn =
    document.getElementById("restartQuizBtn");


// ================= START APPLICATION =================

document.addEventListener(
    "DOMContentLoaded",
    loadFlashcards
);


// =====================================================
// LOAD FLASHCARDS FROM FLASK API
// =====================================================

async function loadFlashcards() {

    try {

        const response =
            await fetch("/api/flashcards");


        if (!response.ok) {

            throw new Error(
                "Unable to load flashcards."
            );

        }


        flashcards =
            await response.json();


        currentIndex = 0;


        renderCard();


    } catch (error) {

        showMessage(
            error.message,
            true
        );

    }

}


// =====================================================
// STUDY MODE
// =====================================================

function renderCard() {

    if (flashcards.length === 0) {

        cardNumber.textContent =
            "Card 0 of 0";

        question.textContent =
            "No flashcards yet";

        answer.textContent =
            "";

        answer.classList.add(
            "hidden"
        );

        label.textContent =
            "QUESTION";

        showAnswerBtn.disabled =
            true;

        prevBtn.disabled =
            true;

        nextBtn.disabled =
            true;

        editBtn.disabled =
            true;

        deleteBtn.disabled =
            true;

        return;

    }


    const card =
        flashcards[currentIndex];


    showingAnswer =
        false;


    cardNumber.textContent =
        `Card ${currentIndex + 1} of ${flashcards.length}`;


    question.textContent =
        card.question;


    answer.textContent =
        card.answer;


    answer.classList.add(
        "hidden"
    );


    label.textContent =
        "QUESTION";


    showAnswerBtn.textContent =
        "Show Answer";


    showAnswerBtn.disabled =
        false;


    prevBtn.disabled =
        currentIndex === 0;


    nextBtn.disabled =
        currentIndex ===
        flashcards.length - 1;


    editBtn.disabled =
        false;


    deleteBtn.disabled =
        false;

}


// =====================================================
// SHOW / HIDE ANSWER
// =====================================================

showAnswerBtn.addEventListener(
    "click",
    () => {

        if (!flashcards.length) {
            return;
        }


        showingAnswer =
            !showingAnswer;


        answer.classList.toggle(
            "hidden",
            !showingAnswer
        );


        label.textContent =
            showingAnswer
                ? "ANSWER"
                : "QUESTION";


        showAnswerBtn.textContent =
            showingAnswer
                ? "Hide Answer"
                : "Show Answer";

    }
);


// =====================================================
// PREVIOUS CARD
// =====================================================

prevBtn.addEventListener(
    "click",
    () => {

        if (currentIndex > 0) {

            currentIndex--;

            renderCard();

        }

    }
);


// =====================================================
// NEXT CARD
// =====================================================

nextBtn.addEventListener(
    "click",
    () => {

        if (
            currentIndex <
            flashcards.length - 1
        ) {

            currentIndex++;

            renderCard();

        }

    }
);


// =====================================================
// ADD FLASHCARD
// =====================================================

addBtn.addEventListener(
    "click",
    () => {

        openModal();

    }
);


// =====================================================
// EDIT FLASHCARD
// =====================================================

editBtn.addEventListener(
    "click",
    () => {

        if (!flashcards.length) {
            return;
        }


        const card =
            flashcards[currentIndex];


        openModal(card);

    }
);


// =====================================================
// DELETE FLASHCARD
// =====================================================

deleteBtn.addEventListener(
    "click",
    async () => {

        if (!flashcards.length) {
            return;
        }


        const card =
            flashcards[currentIndex];


        const confirmed =
            confirm(
                "Are you sure you want to delete this flashcard?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `/api/flashcards/${card.id}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Delete failed."
                );

            }


            flashcards.splice(
                currentIndex,
                1
            );


            if (
                currentIndex >=
                flashcards.length
            ) {

                currentIndex =
                    Math.max(
                        0,
                        flashcards.length - 1
                    );

            }


            renderCard();


            showMessage(
                "Flashcard deleted successfully."
            );


        } catch (error) {

            showMessage(
                error.message,
                true
            );

        }

    }
);


// =====================================================
// SAVE ADD / EDIT FORM
// =====================================================

form.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const data = {

            question:
                questionInput.value.trim(),

            answer:
                answerInput.value.trim()

        };


        if (
            !data.question ||
            !data.answer
        ) {

            showMessage(
                "Please enter both a question and an answer.",
                true
            );

            return;

        }


        try {

            let response;


            // CREATE

            if (editingId === null) {

                response =
                    await fetch(
                        "/api/flashcards",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );

            }


            // UPDATE

            else {

                response =
                    await fetch(
                        `/api/flashcards/${editingId}`,
                        {
                            method: "PUT",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );

            }


            const savedCard =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    savedCard.error ||
                    "Unable to save flashcard."
                );

            }


            // NEW CARD

            if (editingId === null) {

                flashcards.push(
                    savedCard
                );


                currentIndex =
                    flashcards.length - 1;


                showMessage(
                    "Flashcard added successfully."
                );

            }


            // UPDATED CARD

            else {

                const index =
                    flashcards.findIndex(
                        card =>
                            card.id ===
                            editingId
                    );


                flashcards[index] =
                    savedCard;


                currentIndex =
                    index;


                showMessage(
                    "Flashcard updated successfully."
                );

            }


            closeFormModal();


            renderCard();


        } catch (error) {

            showMessage(
                error.message,
                true
            );

        }

    }
);


// =====================================================
// OPEN MODAL
// =====================================================

function openModal(card = null) {

    editingId =
        card
            ? card.id
            : null;


    modalTitle.textContent =
        card
            ? "Edit Flashcard"
            : "Add Flashcard";


    questionInput.value =
        card
            ? card.question
            : "";


    answerInput.value =
        card
            ? card.answer
            : "";


    modal.classList.remove(
        "hidden"
    );


    questionInput.focus();

}


// =====================================================
// CLOSE MODAL
// =====================================================

function closeFormModal() {

    modal.classList.add(
        "hidden"
    );


    form.reset();


    editingId =
        null;

}


closeModal.addEventListener(
    "click",
    closeFormModal
);


cancelBtn.addEventListener(
    "click",
    closeFormModal
);


modal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === modal
        ) {

            closeFormModal();

        }

    }
);


// =====================================================
// STUDY / QUIZ MODE SWITCH
// =====================================================

studyModeBtn.addEventListener(
    "click",
    () => {

        studyMode.classList.remove(
            "hidden"
        );

        quizMode.classList.add(
            "hidden"
        );


        studyModeBtn.classList.add(
            "active"
        );

        quizModeBtn.classList.remove(
            "active"
        );

    }
);


quizModeBtn.addEventListener(
    "click",
    () => {

        studyMode.classList.add(
            "hidden"
        );

        quizMode.classList.remove(
            "hidden"
        );


        studyModeBtn.classList.remove(
            "active"
        );

        quizModeBtn.classList.add(
            "active"
        );


        startQuiz();

    }
);


// =====================================================
// START QUIZ
// =====================================================

function startQuiz() {

    if (flashcards.length < 1) {

        quizQuestion.textContent =
            "Add some flashcards first.";

        quizOptions.innerHTML =
            "";

        checkAnswerBtn.disabled =
            true;

        return;

    }


    // Copy flashcards

    quizCards =
        [...flashcards];


    // Shuffle questions

    quizCards.sort(
        () => Math.random() - 0.5
    );


    quizIndex =
        0;


    quizScore =
        0;


    selectedAnswer =
        null;


    answerChecked =
        false;


    quizResult.classList.add(
        "hidden"
    );


    loadQuizQuestion();

}


// =====================================================
// LOAD QUIZ QUESTION
// =====================================================

function loadQuizQuestion() {

    if (
        quizIndex >=
        quizCards.length
    ) {

        finishQuiz();

        return;

    }


    const card =
        quizCards[quizIndex];


    quizNumber.textContent =
        `Question ${quizIndex + 1} of ${quizCards.length}`;


    score.textContent =
        `Score: ${quizScore}`;


    quizQuestion.textContent =
        card.question;


    quizMessage.textContent =
        "";


    selectedAnswer =
        null;


    answerChecked =
        false;


    checkAnswerBtn.disabled =
        false;


    checkAnswerBtn.classList.remove(
        "hidden"
    );


    nextQuestionBtn.classList.add(
        "hidden"
    );


    createOptions(
        card
    );

}


// =====================================================
// CREATE MULTIPLE CHOICE OPTIONS
// =====================================================

function createOptions(card) {

    quizOptions.innerHTML =
        "";


    // Create wrong answers

    const wrongAnswers =
        flashcards
            .filter(
                item =>
                    item.id !== card.id
            )
            .map(
                item =>
                    item.answer
            );


    // Shuffle wrong answers

    wrongAnswers.sort(
        () => Math.random() - 0.5
    );


    // Take maximum 3 wrong answers

    const selectedWrongAnswers =
        wrongAnswers.slice(
            0,
            3
        );


    // Add correct answer

    let options = [
        card.answer,
        ...selectedWrongAnswers
    ];


    // Shuffle all options

    options.sort(
        () => Math.random() - 0.5
    );


    options.forEach(
        (option, index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "quiz-option";


            button.textContent =
                option;


            button.dataset.answer =
                option;


            button.addEventListener(
                "click",
                () => {

                    selectOption(
                        button
                    );

                }
            );


            quizOptions.appendChild(
                button
            );

        }
    );

}


// =====================================================
// SELECT QUIZ OPTION
// =====================================================

function selectOption(button) {

    if (answerChecked) {
        return;
    }


    const allOptions =
        document.querySelectorAll(
            ".quiz-option"
        );


    allOptions.forEach(
        option => {

            option.classList.remove(
                "selected"
            );

        }
    );


    button.classList.add(
        "selected"
    );


    selectedAnswer =
        button.dataset.answer;

}


// =====================================================
// CHECK ANSWER
// =====================================================

checkAnswerBtn.addEventListener(
    "click",
    () => {

        if (answerChecked) {
            return;
        }


        if (selectedAnswer === null) {

            quizMessage.textContent =
                "Please select an answer.";

            return;

        }


        const correctAnswer =
            quizCards[quizIndex].answer;


        answerChecked =
            true;


        const allOptions =
            document.querySelectorAll(
                ".quiz-option"
            );


        allOptions.forEach(
            option => {

                option.disabled =
                    true;


                if (
                    option.dataset.answer ===
                    correctAnswer
                ) {

                    option.classList.add(
                        "correct"
                    );

                }


                if (
                    option.dataset.answer ===
                    selectedAnswer &&
                    selectedAnswer !==
                    correctAnswer
                ) {

                    option.classList.add(
                        "wrong"
                    );

                }

            }
        );


        if (
            selectedAnswer ===
            correctAnswer
        ) {

            quizScore++;


            quizMessage.textContent =
                "✅ Correct answer!";

        }

        else {

            quizMessage.textContent =
                `❌ Wrong answer! Correct answer: ${correctAnswer}`;

        }


        score.textContent =
            `Score: ${quizScore}`;


        checkAnswerBtn.classList.add(
            "hidden"
        );


        nextQuestionBtn.classList.remove(
            "hidden"
        );

    }
);


// =====================================================
// NEXT QUIZ QUESTION
// =====================================================

nextQuestionBtn.addEventListener(
    "click",
    () => {

        quizIndex++;


        loadQuizQuestion();

    }
);


// =====================================================
// FINISH QUIZ
// =====================================================

function finishQuiz() {

    quizQuestion.textContent =
        "Quiz completed!";


    quizOptions.innerHTML =
        "";


    quizMessage.textContent =
        "";


    checkAnswerBtn.classList.add(
        "hidden"
    );


    nextQuestionBtn.classList.add(
        "hidden"
    );


    quizResult.classList.remove(
        "hidden"
    );


    finalScore.textContent =
        `${quizScore} / ${quizCards.length}`;


    score.textContent =
        `Score: ${quizScore}`;

}


// =====================================================
// RESTART QUIZ
// =====================================================

restartQuizBtn.addEventListener(
    "click",
    () => {

        startQuiz();

    }
);


// =====================================================
// MESSAGE FUNCTION
// =====================================================

function showMessage(
    text,
    isError = false
) {

    message.textContent =
        text;


    message.style.color =
        isError
            ? "#c62828"
            : "#536dfe";


    setTimeout(
        () => {

            if (
                message.textContent ===
                text
            ) {

                message.textContent =
                    "";

            }

        },
        3000
    );

}