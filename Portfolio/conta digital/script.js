document.addEventListener('DOMContentLoaded', () => {
    // Elementos da UI
    const currentBalanceEl = document.getElementById('current-balance');
    const totalEntriesEl = document.getElementById('total-entries');
    const totalExitsEl = document.getElementById('total-exits');
    const transactionsListEl = document.getElementById('transactions-list');
    const noTransactionsEl = document.querySelector('.no-transactions');

    const btnPix = document.getElementById('btn-pix');
    const btnPagar = document.getElementById('btn-pagar');
    const btnInvestir = document.getElementById('btn-investir');

    const pixSection = document.getElementById('pix-section');
    const pixTabs = document.querySelectorAll('.pix-tab-button');
    const pixReceiveForm = document.getElementById('pix-receive-form');
    const pixTransferForm = document.getElementById('pix-transfer-form');

    const receiveKeyInput = document.getElementById('receive-key');
    const receiveAmountInput = document.getElementById('receive-amount');
    const receiveErrorMessage = document.getElementById('receive-error-message');

    const transferKeyInput = document.getElementById('transfer-key');
    const transferAmountInput = document.getElementById('transfer-amount');
    const transferErrorMessage = document.getElementById('transfer-error-message');

    const currentYearEl = document.getElementById('current-year');

    // Estado da Aplicação
    let balance = 1000.00; // Saldo inicial
    let entries = 0.00;
    let exits = 0.00;
    let transactions = [];

    const ICONS = {
        entrada: 'imagens/icon_receber.png',
        saida: 'imagens/icon_enviar.png'
    };

    // --- Funções Principais ---

    function formatCurrency(value) {
        return value.toFixed(2).replace('.', ',');
    }

    function updateUI() {
        currentBalanceEl.textContent = formatCurrency(balance);
        totalEntriesEl.textContent = formatCurrency(entries);
        totalExitsEl.textContent = formatCurrency(exits);
        renderTransactions();
    }

    function renderTransactions() {
        transactionsListEl.innerHTML = ''; // Limpa a lista atual
        if (transactions.length === 0) {
            if (noTransactionsEl) {
                transactionsListEl.appendChild(noTransactionsEl.cloneNode(true)); // Re-adiciona "Não constam transações"
            } else { // Fallback caso o elemento original seja removido
                 const li = document.createElement('li');
                 li.classList.add('no-transactions');
                 li.textContent = 'Não constam transações';
                 transactionsListEl.appendChild(li);
            }
            return;
        }

        // Ordena as transações da mais recente para a mais antiga
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

        sortedTransactions.forEach(tx => {
            const li = document.createElement('li');
            li.classList.add(tx.type === 'entrada' ? 'transaction-entry' : 'transaction-exit');

            const iconImg = document.createElement('img');
            iconImg.src = tx.icon;
            iconImg.alt = tx.type;
            iconImg.classList.add('transaction-icon');

            const detailsDiv = document.createElement('div');
            detailsDiv.classList.add('transaction-details');
            
            const titleStrong = document.createElement('strong');
            titleStrong.textContent = tx.title;
            
            const typeP = document.createElement('p');
            typeP.classList.add('type');
            typeP.textContent = `Tipo: ${tx.details}`;

            const idP = document.createElement('p');
            idP.classList.add('id');
            idP.textContent = `ID: ${tx.id}`;
            
            const dateTimeP = document.createElement('p');
            dateTimeP.classList.add('date-time');
            dateTimeP.textContent = `${tx.date} - ${tx.time}`;


            detailsDiv.appendChild(titleStrong);
            detailsDiv.appendChild(typeP);
            detailsDiv.appendChild(idP);
            detailsDiv.appendChild(dateTimeP);


            const amountSpan = document.createElement('span');
            amountSpan.classList.add('transaction-amount');
            amountSpan.textContent = (tx.type === 'entrada' ? '+ R$ ' : '- R$ ') + formatCurrency(tx.amount);

            li.appendChild(iconImg);
            li.appendChild(detailsDiv);
            li.appendChild(amountSpan);
            transactionsListEl.appendChild(li);
        });
    }

    function addTransaction(type, details, amount) {
        const now = new Date();
        const date = now.toLocaleDateString('pt-BR');
        const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        
        const year = String(now.getFullYear());
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        const id = `${year}${month}${day}${hour}${minute}${second}`;

        const transaction = {
            id: id,
            rawDate: now, // Para ordenação
            date: date,
            time: time,
            type: type, // 'entrada' ou 'saida'
            title: type === 'entrada' ? 'Entrada' : 'Saída',
            icon: type === 'entrada' ? ICONS.entrada : ICONS.saida,
            details: details, // "Transferência recebida" ou "Transferência enviada"
            amount: amount
        };
        transactions.push(transaction);
    }


    // --- Event Listeners ---

    btnPagar.addEventListener('click', () => {
        alert('Sistema indisponível. Tente novamente mais tarde.');
    });

    btnInvestir.addEventListener('click', () => {
        alert('Sistema indisponível. Tente novamente mais tarde.');
    });

    btnPix.addEventListener('click', () => {
        pixSection.classList.toggle('hidden');
    });

    pixTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            pixTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const formToShow = tab.dataset.form;
            if (formToShow === 'receive') {
                pixReceiveForm.classList.remove('hidden');
                pixTransferForm.classList.add('hidden');
            } else {
                pixReceiveForm.classList.add('hidden');
                pixTransferForm.classList.remove('hidden');
            }
            // Limpar mensagens de erro ao trocar de aba
            receiveErrorMessage.textContent = '';
            transferErrorMessage.textContent = '';
        });
    });

    pixReceiveForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const key = receiveKeyInput.value.trim();
        const amount = parseFloat(receiveAmountInput.value);

        receiveErrorMessage.textContent = ''; // Limpa erro anterior

        if (!key || !amount) {
            receiveErrorMessage.textContent = 'Todos os campos devem ser preenchidos!';
            return;
        }
        if (amount <= 0) {
            receiveErrorMessage.textContent = 'O valor deve ser positivo!';
            return;
        }

        balance += amount;
        entries += amount;
        addTransaction('entrada', 'Transferência recebida', amount);
        updateUI();

        alert('Transação realizada com sucesso! (Cobrança gerada e valor creditado)');
        receiveKeyInput.value = '';
        receiveAmountInput.value = '';
    });

    pixTransferForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const key = transferKeyInput.value.trim();
        const amount = parseFloat(transferAmountInput.value);

        transferErrorMessage.textContent = ''; // Limpa erro anterior

        if (!key || !amount) {
            transferErrorMessage.textContent = 'Todos os campos devem ser preenchidos!';
            return;
        }
        if (amount <= 0) {
            transferErrorMessage.textContent = 'O valor deve ser positivo!';
            return;
        }
        if (amount > balance) {
            transferErrorMessage.textContent = 'Saldo insuficiente!';
            return;
        }

        balance -= amount;
        exits += amount;
        addTransaction('saida', 'Transferência enviada', amount);
        updateUI();

        alert('Transação realizada com sucesso!');
        transferKeyInput.value = '';
        transferAmountInput.value = '';
    });


    // --- Inicialização ---
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
    updateUI(); // Atualiza a UI com os valores iniciais
});