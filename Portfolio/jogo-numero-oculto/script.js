document.addEventListener('DOMContentLoaded', () => {
    // Elementos da Seção de Configuração (Jogador 1)
    const setupSection = document.getElementById('setup-section');
    const secretNumberInput = document.getElementById('secret-number-input');
    const setSecretButton = document.getElementById('set-secret-button');
    const setupError = document.getElementById('setup-error');

    // Elementos da Seção de Adivinhação (Jogador 2)
    const guessSection = document.getElementById('guess-section');
    const guessInput = document.getElementById('guess-input');
    const guessButton = document.getElementById('guess-button');
    const attemptsLeftSpan = document.getElementById('attempts-left');
    const feedbackMessagesDiv = document.getElementById('feedback-messages');
    const resultMessageP = document.getElementById('result-message');
    const playAgainButton = document.getElementById('play-again-button');

    let secretNumber = null;
    let attempts = 5;
    const MIN_NUMBER = 1;
    const MAX_NUMBER = 100;

    function initializeGame() {
        secretNumber = null;
        attempts = 5;
        
        setupSection.classList.remove('hidden');
        guessSection.classList.add('hidden');
        playAgainButton.classList.add('hidden');

        secretNumberInput.value = '';
        guessInput.value = '';
        attemptsLeftSpan.textContent = attempts;
        feedbackMessagesDiv.innerHTML = '';
        resultMessageP.textContent = '';
        resultMessageP.className = ''; // Limpa classes de cor
        setupError.textContent = '';

        secretNumberInput.disabled = false;
        setSecretButton.disabled = false;
        guessInput.disabled = false;
        guessButton.disabled = false;
    }

    setSecretButton.addEventListener('click', () => {
        const numberValue = parseInt(secretNumberInput.value);

        if (isNaN(numberValue) || numberValue < MIN_NUMBER || numberValue > MAX_NUMBER) {
            setupError.textContent = `Por favor, digite um número entre ${MIN_NUMBER} e ${MAX_NUMBER}.`;
            return;
        }
        
        secretNumber = numberValue;
        setupError.textContent = '';
        secretNumberInput.disabled = true; // Desabilita input após definir
        setSecretButton.disabled = true;  // Desabilita botão após definir

        // Esconde a seção de setup e mostra a seção de adivinhação
        setupSection.classList.add('hidden');
        guessSection.classList.remove('hidden');
        guessInput.focus(); // Foca no input de palpite
        addFeedbackMessage("Número secreto definido! Jogador 2, sua vez.", "info");
    });

    guessButton.addEventListener('click', () => {
        if (attempts <= 0) return; // Não deveria acontecer se o botão estiver desabilitado

        const guess = parseInt(guessInput.value);

        if (isNaN(guess) || guess < MIN_NUMBER || guess > MAX_NUMBER) {
            addFeedbackMessage(`Por favor, digite um número entre ${MIN_NUMBER} e ${MAX_NUMBER}.`, "error");
            guessInput.value = ''; // Limpa input inválido
            return;
        }

        attempts--;
        attemptsLeftSpan.textContent = attempts;
        let feedbackText = '';
        let feedbackClass = '';

        if (guess === secretNumber) {
            resultMessageP.textContent = `Parabéns! Você acertou o número secreto ${secretNumber}!`;
            resultMessageP.classList.add('win');
            endGame();
            return;
        } else if (guess < secretNumber) {
            feedbackText = `O número secreto é MAIOR que ${guess}.`;
            feedbackClass = 'lower'; // Estilo para "chute baixo"
        } else {
            feedbackText = `O número secreto é MENOR que ${guess}.`;
            feedbackClass = 'higher'; // Estilo para "chute alto"
        }

        addFeedbackMessage(feedbackText, feedbackClass);

        if (attempts === 0) {
            resultMessageP.textContent = `Fim de jogo! Suas tentativas acabaram. O número secreto era ${secretNumber}.`;
            resultMessageP.classList.add('lose');
            endGame();
        }

        guessInput.value = ''; // Limpa o input para o próximo palpite
        guessInput.focus();
    });

    playAgainButton.addEventListener('click', initializeGame);

    function addFeedbackMessage(message, type) {
        const feedbackP = document.createElement('p');
        feedbackP.textContent = message;
        feedbackP.classList.add('feedback');
        if (type) {
            feedbackP.classList.add(type); // Adiciona classe para estilização (error, lower, higher, info)
        }
        // Adiciona a nova mensagem no topo
        if (feedbackMessagesDiv.firstChild) {
            feedbackMessagesDiv.insertBefore(feedbackP, feedbackMessagesDiv.firstChild);
        } else {
            feedbackMessagesDiv.appendChild(feedbackP);
        }
        // Limita o número de mensagens de feedback exibidas (opcional)
        while (feedbackMessagesDiv.children.length > 5) {
            feedbackMessagesDiv.removeChild(feedbackMessagesDiv.lastChild);
        }
    }
    
    function endGame() {
        guessInput.disabled = true;
        guessButton.disabled = true;
        playAgainButton.classList.remove('hidden');
    }

    // Inicializa o jogo quando a página carrega
    initializeGame();
});