const quotes = [
    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },
    {
        text: "Success is the sum of small efforts, repeated day in and day out.",
        author: "Robert Collier"
    },
    {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela"
    },
    {
        text: "Believe you can and you're halfway there.",
        author: "Theodore Roosevelt"
    },
    {
        text: "The future depends on what you do today.",
        author: "Mahatma Gandhi"
    },
    {
        text: "Do something today that your future self will thank you for.",
        author: "Sean Patrick Flanery"
    },
    {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },
    {
        text: "Great things are done by a series of small things brought together.",
        author: "Vincent van Gogh"
    },
    {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
    }
];

const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const newQuoteButton = document.getElementById("newQuoteBtn");

let lastQuoteIndex = -1;

function showRandomQuote() {
    let randomIndex;

    do {
        randomIndex = Math.floor(Math.random() * quotes.length);
    } while (quotes.length > 1 && randomIndex === lastQuoteIndex);

    lastQuoteIndex = randomIndex;

    quoteElement.textContent = quotes[randomIndex].text;
    authorElement.textContent = quotes[randomIndex].author;
}

newQuoteButton.addEventListener("click", showRandomQuote);

// Display a random quote when the app opens.
showRandomQuote();
