const fruits = [
    { name: "apple", symbol: "🍎" },
    { name: "banana", symbol: "🍌" },
    { name: "cherry", symbol: "🍒" },
    { name: "coconut", symbol: "🥥" },
    { name: "grapes", symbol: "🍇" },
    { name: "mango", symbol: "🥭" },
    { name: "pineapple", symbol: "🍍" },
    { name: "watermelon", symbol: "🍉" },
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const board = document.getElementById("board");
const movesDisplay = document.getElementById("moves");
const status = document.getElementById("status");
const newGameButton = document.getElementById("new-game");

let moves = 0;
let flippedCards = [];
let waiting = false;
let timer = null;

function buildBoard() {
    board.replaceChildren();

    const deck = shuffle([...fruits, ...fruits]);

    deck.forEach((fruit, i) => {
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("card");
        card.setAttribute("aria-label", `Card ${i + 1}, face down`);
        card.dataset.index = i;

        board.appendChild(card);
    });

    board.dataset.deck = JSON.stringify(deck);
}

buildBoard();

board.addEventListener("click", function (event) {
    const card = event.target.closest(".card");

    if (!card || waiting || card.disabled || card.classList.contains("flipped")) {
        return;
    }

    const deck = JSON.parse(board.dataset.deck);
    const fruit = deck[Number(card.dataset.index)];

    card.textContent = fruit.symbol;
    card.classList.add("flipped");
    card.setAttribute("aria-label", `Card ${Number(card.dataset.index) + 1}, ${fruit.name}`);

    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.textContent = moves;

        const firstCard = flippedCards[0];
        const secondCard = flippedCards[1];

        const firstFruit = deck[Number(firstCard.dataset.index)];
        const secondFruit = deck[Number(secondCard.dataset.index)];

        if (firstFruit.name === secondFruit.name) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard.disabled = true;
            secondCard.disabled = true;

            status.textContent = "That's a pair!";
            flippedCards = [];

            if (board.querySelectorAll(".matched").length === 16) {
                status.textContent = `You found all the pairs in ${moves} moves!`;
                status.classList.add("you-won");
            }
        } else {
            status.textContent = "Not a pair. Try again.";
            waiting = true;

            timer = setTimeout(function () {
                [firstCard, secondCard].forEach(function (card) {
                    card.textContent = "";
                    card.classList.remove("flipped");
                    card.setAttribute(
                        "aria-label",
                        `Card ${Number(card.dataset.index) + 1}, face down`
                    );
                });

                flippedCards = [];
                waiting = false;
                timer = null;
            }, 1000);
        }
    }
});

newGameButton.addEventListener("click", function () {
    if (timer !== null) {
        clearTimeout(timer);
        timer = null;
    }

    moves = 0;
    movesDisplay.textContent = moves;
    flippedCards = [];
    waiting = false;

    status.textContent = "Turn over two cards to find a matching pair.";
    status.classList.remove("you-won");

    buildBoard();
});


        
