// CONFIGURAÇÕES E CHAVES
const PROXY = "https://corsproxy.io/?";
const KEYS = {
    num: '37c50a4c4aaf752f098edc2caf52c752',
    ip: 'a9b57e3b51c26e5418baabf34be67947',
    coin: '49a4c82a024139de90b2bb2c457a6b75'
};

// RELÓGIO
setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);

// NAVEGAÇÃO DE ABAS
function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.currentTarget.classList.add('active');
}

// NAVEGAÇÃO DE TOOLS
function openTool(id) {
    document.querySelectorAll('.tool-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('tool-' + id).classList.add('active');
}

// FORMATADOR DE RESULTADO
const render = (l, v) => `<div class="res-item"><span class="label">${l}</span><span class="val">${v || '---'}</span></div>`;

// --- APIs ---

async function apiNum() {
    const val = document.getElementById('phoneInput').value;
    const out = document.getElementById('res-num');
    out.innerHTML = "Consultando...";
    try {
        const url = `http://apilayer.net/api/validate?access_key=${KEYS.num}&number=${val}`;
        const r = await fetch(PROXY + encodeURIComponent(url));
        const d = await r.json();
        out.innerHTML = render('Operadora', d.carrier) + render('Local', d.location) + render('Válido', d.valid) + render('Tipo', d.line_type);
    } catch(e) { out.innerHTML = "Erro de conexão."; }
}

async function apiIP() {
    const val = document.getElementById('ipInput').value || 'check';
    const out = document.getElementById('res-ip');
    try {
        const url = `http://api.ipstack.com/${val}?access_key=${KEYS.ip}`;
        const r = await fetch(PROXY + encodeURIComponent(url));
        const d = await r.json();
        out.innerHTML = render('Cidade', d.city) + render('País', d.country_name) + render('ISP', d.connection?.isp);
    } catch(e) { out.innerHTML = "Erro de conexão."; }
}

async function apiCoin() {
    const val = document.getElementById('coinInput').value.toUpperCase();
    const out = document.getElementById('res-coin');
    try {
        const url = `http://api.coinlayer.com/api/live?access_key=${KEYS.coin}&symbols=${val}`;
        const r = await fetch(PROXY + encodeURIComponent(url));
        const d = await r.json();
        out.innerHTML = render('Moeda', val) + render('Preço USD', d.rates[val]);
    } catch(e) { out.innerHTML = "Erro."; }
}

// --- RH ---
function genBio() {
    const text = document.getElementById('expText').value;
    document.getElementById('rhOutput').innerText = `Bio Gerada:\n\nProfissional focado em ${text}. Especialista em otimização de processos e tecnologia.`;
}

function genCV() {
    const text = document.getElementById('expText').value;
    document.getElementById('rhOutput').innerText = `CURRÍCULO MATHEUS OS\n-------------------\nResumo: Experiência sólida em ${text}.\nSkills: Integração de APIs, Desenvolvimento Frontend.`;
}
