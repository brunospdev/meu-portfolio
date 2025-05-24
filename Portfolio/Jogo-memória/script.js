document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('game-board');
    const restartButton = document.getElementById('restart-button');
    const currentAttemptsSpan = document.getElementById('current-attempts');
    const winMessageP = document.getElementById('win-message');
    const historyList = document.getElementById('history-list');

    // Defina os caminhos para suas 3 imagens de pares
    const IMAGE_PATHS = [
        'images/par1.png', // Imagem para o par 1
        'images/par2.png', // Imagem para o par 2
        'images/par3.png', // Imagem para o par 3
    ];
    const CARD_BACK_IMAGE = 'images/card-verso.png'; // Imagem para o verso da carta

    let cards = []; // Array para armazenar os dados das cartas (imagem, id, etc.)
    let flippedCards = []; // Armazena as duas cartas viradas atualmente
    let matchedPairs = 0;
    let currentAttempts = 0;
    let canFlip = true; // Controla se o jogador pode virar cartas

    function initializeGame() {
        // Resetar variáveis do jogo
        matchedPairs = 0;
        currentAttempts = 0;
        flippedCards = [];
        canFlip = true;
        cards = [];

        currentAttemptsSpan.textContent = currentAttempts;
        winMessageP.classList.add('hidden');
        winMessageP.textContent = '';
        gameBoard.innerHTML = ''; // Limpa o tabuleiro anterior

        // Criar os pares de cartas
        const cardImages = [...IMAGE_PATHS, ...IMAGE_PATHS]; // Duplica para formar pares

        // Embaralhar as imagens
        shuffleArray(cardImages);

        // Criar e adicionar as cartas ao tabuleiro
        cardImages.forEach((imageSrc, index) => {
            const cardElement = createCardElement(index, imageSrc);
            cards.push({
                id: index,
                imageSrc: imageSrc,
                element: cardElement,
                isFlipped: false,
                isMatched: false,
            });
            gameBoard.appendChild(cardElement);
        });
        loadHistory();
    }

    function createCardElement(id, imageSrc) {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.id = id; // Para identificar a carta no array 'cards'
        card.dataset.image = imageSrc; // Armazena a imagem de referência

        const cardFaceFront = document.createElement('div');
        cardFaceFront.classList.add('card-face', 'card-front');
        const frontImg = document.createElement('img');
        frontImg.src = imageSrc;
        frontImg.alt = "Imagem da Carta";
        cardFaceFront.appendChild(frontImg);

        const cardFaceBack = document.createElement('div');
        cardFaceBack.classList.add('card-face', 'card-back');
        const backImg = document.createElement('img');
        backImg.src = CARD_BACK_IMAGE; // Imagem do verso da carta
        backImg.alt = "Verso da Carta";
        cardFaceBack.appendChild(backImg);

        card.appendChild(cardFaceFront);
        card.appendChild(cardFaceBack);

        card.addEventListener('click', handleCardClick);
        return card;
    }

    function handleCardClick(event) {
        if (!canFlip) return;
        const clickedCardElement = event.currentTarget;
        const cardId = parseInt(clickedCardElement.dataset.id);
        const clickedCardData = cards.find(c => c.id === cardId);

        if (!clickedCardData || clickedCardData.isFlipped || clickedCardData.isMatched) {
            return; // Carta já virada, já encontrada ou não existe
        }

        flipCard(clickedCardData);
        flippedCards.push(clickedCardData);

        if (flippedCards.length === 2) {
            canFlip = false; // Impede mais cliques enquanto verifica
            currentAttempts++;
            currentAttemptsSpan.textContent = currentAttempts;
            checkForMatch();
        }
    }

    function flipCard(cardData) {
        cardData.isFlipped = true;
        cardData.element.classList.add('flipped');
    }

    function unflipCards(card1Data, card2Data) {
        setTimeout(() => {
            card1Data.isFlipped = false;
            card1Data.element.classList.remove('flipped');
            card2Data.isFlipped = false;
            card2Data.element.classList.remove('flipped');
            canFlip = true;
        }, 1000); // Tempo para o jogador ver a segunda carta antes de desvirar
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;

        if (card1.imageSrc === card2.imageSrc) {
            // É um par!
            card1.isMatched = true;
            card2.isMatched = true;
            card1.element.classList.add('matched');
            card2.element.classList.add('matched');
            matchedPairs++;
            canFlip = true; // Permite virar novamente
            if (matchedPairs === IMAGE_PATHS.length) { // Todas os pares encontrados
                endGame();
            }
        } else {
            // Não é um par
            unflipCards(card1, card2);
        }
        flippedCards = []; // Limpa o array de cartas viradas
    }

    function endGame() {
        canFlip = false; // Impede mais jogadas
        winMessageP.textContent = `PARABÉNS! Você encontrou todos os pares em ${currentAttempts} tentativas!`;
        winMessageP.classList.remove('hidden');
        saveAttemptToHistory(currentAttempts);
        loadHistory();
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Troca de elementos
        }
    }

    // --- LocalStorage para Histórico ---
    function saveAttemptToHistory(attempts) {
        let history = JSON.parse(localStorage.getItem('memoryGameHistory')) || [];
        const now = new Date();
        const attemptRecord = {
            attempts: attempts,
            date: `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`
        };
        history.unshift(attemptRecord); // Adiciona no início para mais recente primeiro
        if (history.length > 10) { // Mantém apenas os últimos 10 registros, por exemplo
            history.pop();
        }
        localStorage.setItem('memoryGameHistory', JSON.stringify(history));
    }

    function loadHistory() {
        historyList.innerHTML = ''; // Limpa a lista atual
        let history = JSON.parse(localStorage.getItem('memoryGameHistory')) || [];
        if (history.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Nenhuma rodada jogada ainda.';
            historyList.appendChild(li);
        } else {
            history.forEach(record => {
                const li = document.createElement('li');
                li.textContent = `Rodada de ${record.date} - ${record.attempts} tentativas`;
                historyList.appendChild(li);
            });
        }
    }

    // Event Listeners
    restartButton.addEventListener('click', initializeGame);

    // Iniciar o jogo
    initializeGame();
});