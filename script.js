/************************************************
 CONFIGURAÇÃO ADMINISTRATIVA
************************************************/

const TURNO = 2;
const TOTAL_SESSOES = 35;
const INTERVALO = 5000; // 5 segundos

const RESULTADO_FINAL = {
    "Henrique C.": 4218,
    "Álvaro A.": 3782
};

// Zonas eleitorais
const ZONAS = {
    "Henrique C.": [
        "BH-01 a BH-07",
        "NC-01 a NC-06",
        "CT-01 a CT-05",
        "FM-01 a FM-04",
        "FX-01 a FX-06"
    ],
    "Álvaro A.": [
        "BH-08 a BH-14",
        "NC-07 a NC-11",
        "CT-06 a CT-12",
        "FM-05 a FM-10",
        "FX-07 a FX-14"
    ]
};

/************************************************
 VARIÁVEIS
************************************************/

let sessaoAtual = 1;
let sessoes = [];
const container = document.getElementById("apuração");

/************************************************
 GERA SESSÕES CONTROLADAS
************************************************/

function gerarSessoes() {
    for (let i = 1; i <= TOTAL_SESSOES; i++) {
        let fator = i / TOTAL_SESSOES;

        let h = Math.round(RESULTADO_FINAL["Henrique C."] * fator);
        let a = Math.round(RESULTADO_FINAL["Álvaro A."] * fator);

        // Controle de viradas
        if (i <= 15) {
            a += 120;
        } else if (i <= 25) {
            h += 150;
        } else if (i <= 34) {
            a += 100;
        }

        sessoes.push({
            "Henrique C.": h,
            "Álvaro A.": a
        });
    }

    // Correção final exata
    sessoes[TOTAL_SESSOES - 1] = RESULTADO_FINAL;
}

/************************************************
 RENDERIZAÇÃO
************************************************/

function renderizar() {
    container.innerHTML = "";

    document.getElementById("turnoAtual").innerText =
        `Hoje é o ${TURNO}º turno • Sessão ${sessaoAtual}/${TOTAL_SESSOES}`;

    const dados = sessoes[sessaoAtual - 1];
    const total = dados["Henrique C."] + dados["Álvaro A."];

    let html = `
        <div class="cargo">
            <h2>Presidente</h2>
            <div class="info">Sessão ${sessaoAtual}</div>
    `;

    for (let nome in dados) {
        let votos = dados[nome];
        let perc = ((votos / total) * 100).toFixed(2);

        html += `
            <div class="candidato">
                <div class="nome">${nome} — ${votos} votos (${perc}%)</div>
                <div class="barra">
                    <div class="progresso" style="width:${perc}%"></div>
                </div>
            </div>
        `;
    }

    html += `
        <div class="total">Total de votos: ${total}</div>
        <div class="zonas">
            <strong>Zonas com maior votação:</strong><br>
            Henrique C.: ${ZONAS["Henrique C."].join(", ")}<br>
            Álvaro A.: ${ZONAS["Álvaro A."].join(", ")}
        </div>
        </div>
    `;

    container.innerHTML = html;
}

/************************************************
 INÍCIO AUTOMÁTICO
************************************************/

gerarSessoes();
renderizar();

setInterval(() => {
    if (sessaoAtual < TOTAL_SESSOES) {
        sessaoAtual++;
        renderizar();
    }
}, INTERVALO);
