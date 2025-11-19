//your code here
const cardSuitMap = {
    "0": "spade",   
    "1": "club",    
    "2": "club",    
    "3": "diamond", 
    "4": "spade"    
};

const holderMap = {
    "100": "club",
    "101": "diamond",
    "102": "heart",
    "103": "spade"
};

const deck = document.getElementById("deck");
const holders = document.querySelectorAll(".typesOfCards .placed img");
const wonBox = document.getElementById("won");
const resetBtn = document.getElementById("reset");
const shuffleBtn = document.getElementById("shuffle");

let dragged = null;

window.onload = function () {
    loadGame();
};

document.querySelectorAll(".whitebox2").forEach(card => {
    card.addEventListener("dragstart", (e) => {
        dragged = e.target;
    });
});

holders.forEach(holder => {
    holder.parentElement.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    holder.parentElement.addEventListener("drop", (e) => {
        placeCard(holder, e);
    });
});

function placeCard(holder, e) {
    const cardId = dragged.id;
    const holderId = holder.id;

    const cardSuit = cardSuitMap[cardId];
    const holderSuit = holderMap[holderId];

    if (cardSuit === holderSuit) {
        holder.parentElement.appendChild(dragged.parentElement);

        saveGame();
        checkWin();
    }
}

function saveGame() {
    const positions = {};

    document.querySelectorAll(".whitebox2").forEach(card => {
        positions[card.id] = card.parentElement.parentElement.id;  // deck or bottom container
    });

    localStorage.setItem("cardPositions", JSON.stringify(positions));
}

function loadGame() {
    const saved = JSON.parse(localStorage.getItem("cardPositions"));
    if (!saved) return;

    Object.keys(saved).forEach(cardId => {
        const cardBox = document.getElementById(cardId).parentElement;
        const parentId = saved[cardId];

        if (parentId !== "deck") {
            const holderContainer = document.getElementById(parentId);
            holderContainer.appendChild(cardBox);
        }
    });

    checkWin();
}

function checkWin() {
    let placedCount = 0;

    holders.forEach(holder => {
        const container = holder.parentElement;
        placedCount += container.querySelectorAll(".whitebox2").length;
    });

    if (placedCount === 5) {
        wonBox.style.display = "flex";
    }
}

resetBtn.onclick = function () {
    localStorage.removeItem("cardPositions");
    wonBox.style.display = "none";
    shuffleCards();
};

shuffleBtn.onclick = shuffleCards;

function shuffleCards() {
    const cards = [...document.querySelectorAll(".whitebox2")];

    const deckArea = document.getElementById("deck");
    cards.forEach(c => deckArea.appendChild(c.parentElement));

    for (let i = deckArea.children.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        deckArea.appendChild(deckArea.children[j]);
    }

    localStorage.removeItem("cardPositions");
}

