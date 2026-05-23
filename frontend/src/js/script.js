/**
 * AutoPes V2 - Frontend Controller
 */

const API_URL = 'http://localhost:5000';

let pollingInterval = null;

// Elementos
const temasInput = document.getElementById('temas');
const perguntasInput = document.getElementById('perguntas');
const btnIniciar = document.getElementById('btnIniciar');
const btnParar = document.getElementById('btnParar');
const logDiv = document.getElementById('log');
const led = document.getElementById('led');
const statusText = document.getElementById('statusText');

function addLog(msg, tipo = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const colors = {
        info: '#00f3ff',
        success: '#00ff88',
        error: '#ff006e',
        warning: '#ffbe0b'
    };
    const line = document.createElement('div');
    line.style.color = colors[tipo] || colors.info;
    line.style.margin = '4px 0';
    line.style.fontFamily = 'Consolas, monospace';
    line.style.fontSize = '11px';
    line.innerHTML = `[${timestamp}] ${msg}`;
    logDiv.appendChild(line);
    line.scrollIntoView({ behavior: 'smooth' });
}

function updateStatus(text, isRunning = false) {
    statusText.innerText = text;
    if (isRunning) {
        led.style.background = '#ffbe0b';
        led.style.boxShadow = '0 0 5px #ffbe0b';
    } else if (text === 'Erro') {
        led.style.background = '#ff006e';
        led.style.boxShadow = '0 0 5px #ff006e';
    } else {
        led.style.background = '#00ff88';
        led.style.boxShadow = '0 0 5px #00ff88';
    }
}

async function iniciar() {
    const temas = parseInt(temasInput.value);
    const perguntas = parseInt(perguntasInput.value);

    btnIniciar.disabled = true;
    btnParar.disabled = false;
    logDiv.innerHTML = '';
    updateStatus('Iniciando...', true);

    addLog('═'.repeat(35), 'info');
    addLog('Iniciando AutoPes V2', 'success');
    addLog('═'.repeat(35), 'info');

    try {
        const response = await fetch(`${API_URL}/iniciar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ temas, perguntas })
        });

        const data = await response.json();

        if (data.status === 'ok') {
            startPolling();
        } else {
            addLog(`Erro: ${data.message}`, 'error');
            finalizar(false);
        }
    } catch (err) {
        addLog(`Erro de conexão: ${err.message}`, 'error');
        addLog(`Verifique se o backend está rodando em ${API_URL}`, 'warning');
        finalizar(false);
    }
}

function startPolling() {
    if (pollingInterval) clearInterval(pollingInterval);

    pollingInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_URL}/status`);
            const data = await response.json();

            if (data.log) {
                addLog(data.log, data.tipo || 'info');
            }

            if (data.status === 'executando') {
                updateStatus(`Executando: ${data.progresso || ''}`, true);
            } else if (data.status === 'concluido') {
                finalizar(true);
            } else if (data.status === 'erro') {
                finalizar(false);
            }
        } catch (err) {
            console.error('Polling error:', err);
        }
    }, 1000);
}

async function parar() {
    try {
        await fetch(`${API_URL}/parar`, { method: 'POST' });
        addLog('Parando automação...', 'warning');
        updateStatus('Parando...');
    } catch (err) {
        console.error(err);
    }
}

function finalizar(sucesso) {
    if (pollingInterval) clearInterval(pollingInterval);

    btnIniciar.disabled = false;
    btnParar.disabled = true;

    if (sucesso) {
        addLog('═'.repeat(35), 'success');
        addLog('Automação concluída com sucesso!', 'success');
        addLog('═'.repeat(35), 'success');
        updateStatus('Concluído');
    } else {
        addLog('═'.repeat(35), 'warning');
        addLog('Automação concluída com falhas', 'warning');
        addLog('═'.repeat(35), 'warning');
        updateStatus('Erro');
    }
}

btnIniciar.onclick = iniciar;
btnParar.onclick = parar;

addLog('Sistema pronto. Aguardando comando...', 'success');
updateStatus('Pronto');