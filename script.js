// Game State
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let gameStarted = false;
let canFlip = true;

// Card emojis - 8 pairs
const cardEmojis = ['🎮', '🎯', '🎨', '🎪', '🎭', '🎬', '🎤', '🎧'];

// Initialize Game
function initGame() {
    // Reset game state
    matchedPairs = 0;
    moves = 0;
    timer = 0;
    flippedCards = [];
    gameStarted = false;
    canFlip = true;
    
    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    // Update UI
    updateMoves();
    updateTimer();
    updateMatches();
    
    // Generate cards
    generateCards();
    
    // Hide win modal
    document.getElementById('win-modal').classList.remove('show');
}

// Generate and shuffle cards
function generateCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    // Create pairs of cards
    const cardPairs = [...cardEmojis, ...cardEmojis];
    
    // Shuffle cards using Fisher-Yates algorithm
    shuffleArray(cardPairs);
    
    // Create card elements
    cards = cardPairs.map((emoji, index) => ({
        id: index,
        emoji: emoji,
        flipped: false,
        matched: false
    }));
    
    // Render cards
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.dataset.index = index;
        cardElement.innerHTML = `
            <div class="card-back">?</div>
            <div class="card-front">${card.emoji}</div>
        `;
        cardElement.addEventListener('click', () => handleCardClick(index));
        gameBoard.appendChild(cardElement);
    });
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Handle card click
function handleCardClick(index) {
    if (!canFlip) return;
    
    const card = cards[index];
    const cardElement = document.querySelector(`[data-index="${index}"]`);
    
    // Don't allow clicking already flipped or matched cards
    if (card.flipped || card.matched) return;
    
    // Start timer on first card flip
    if (!gameStarted) {
        startTimer();
        gameStarted = true;
    }
    
    // Flip the card
    flipCard(index);
    
    // Add to flipped cards
    flippedCards.push(index);
    
    // Check if two cards are flipped
    if (flippedCards.length === 2) {
        canFlip = false;
        moves++;
        updateMoves();
        
        // Check for match
        setTimeout(() => {
            checkMatch();
        }, 1000);
    }
}

// Flip card
function flipCard(index) {
    const card = cards[index];
    const cardElement = document.querySelector(`[data-index="${index}"]`);
    
    card.flipped = true;
    cardElement.classList.add('flipped');
}

// Check if flipped cards match
function checkMatch() {
    const [firstIndex, secondIndex] = flippedCards;
    const firstCard = cards[firstIndex];
    const secondCard = cards[secondIndex];
    
    if (firstCard.emoji === secondCard.emoji) {
        // Match found!
        firstCard.matched = true;
        secondCard.matched = true;
        matchedPairs++;
        
        const firstElement = document.querySelector(`[data-index="${firstIndex}"]`);
        const secondElement = document.querySelector(`[data-index="${secondIndex}"]`);
        
        firstElement.classList.add('matched');
        secondElement.classList.add('matched');
        
        updateMatches();
        
        // Check if game is won
        if (matchedPairs === cardEmojis.length) {
            setTimeout(() => {
                endGame();
            }, 500);
        }
    } else {
        // No match - flip cards back
        const firstElement = document.querySelector(`[data-index="${firstIndex}"]`);
        const secondElement = document.querySelector(`[data-index="${secondIndex}"]`);
        
        firstCard.flipped = false;
        secondCard.flipped = false;
        
        firstElement.classList.remove('flipped');
        secondElement.classList.remove('flipped');
    }
    
    // Reset flipped cards
    flippedCards = [];
    canFlip = true;
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        updateTimer();
    }, 1000);
}

// Update timer display
function updateTimer() {
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

// Update moves display
function updateMoves() {
    document.getElementById('moves-count').textContent = moves;
}

// Update matches display
function updateMatches() {
    document.getElementById('matches-count').textContent = `${matchedPairs} / ${cardEmojis.length}`;
}

// End game
function endGame() {
    clearInterval(timerInterval);
    
    // Update win modal
    document.getElementById('win-moves').textContent = moves;
    const minutes = Math.floor(timer / 60).toString().padStart(2, '0');
    const seconds = (timer % 60).toString().padStart(2, '0');
    document.getElementById('win-time').textContent = `${minutes}:${seconds}`;
    
    // Show win modal
    document.getElementById('win-modal').classList.add('show');
}

// Theme Toggle
function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

// Event Listeners
document.getElementById('reset-btn').addEventListener('click', initGame);
document.getElementById('play-again-btn').addEventListener('click', initGame);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initGame();
});
