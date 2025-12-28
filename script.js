/**********************************************************
 ÁREA DE ADMINISTRAÇÃO (EDITÁVEL PELO ADMIN)
**********************************************************/

const ADMIN = {
    turno: 2, // 1 ou 2
    totalSessoes: 35,

    cargos: {
        Presidente: {
            candidatos: {
                "Henrique C.": 4218,
                "Álvaro A.": 3782
            }
        },

        Governador: null,
        Senador: null,
        DeputadoFederal: null,
        DeputadoEstadual: null,
        Prefeito: null,
        Vereador: null
    }
};

/**********************************************************
 VARIÁVEIS GLOBAIS
**********************************************************/

let sessaoAtual = 1;
let dadosProcessados = {};
const container = document.getElementById("apuração");

/**********************************************************
 FUNÇÕES PRINCIPAIS
**********************************************************/

// Inicializa dados e gera curvas realistas
function prepararDados() {
    for (let cargo in ADMIN.cargos) {
        if (!ADMIN.cargos[cargo]) continue;

        let candidatos = ADMIN.cargos[cargo].candidatos;
        let lista = Object.entries(candidatos);

        // Se for 2º turno, pega apenas os dois mais votados
        if (ADMIN.turno === 2) {
            lista.sort((a, b) => b[1] - a[1]);
            lista = lista.slice(0, 2);
        }

        dadosProcessados[cargo] = gerarSessoes(lista);
    }
}

// Gera sessões com reviravoltas realistas
function gerarSessoes(candidatos) {
    let sessoes = [];
    let acumulado = {};

    candidatos.forEach(c => acumulado[c[0]] = 0);

    for (let i = 1; i <= ADMIN.totalSessoes; i++) {
        let fator = i / ADMIN.totalSessoes;
        let sessao = {};

        candidatos.forEach(([nome, votosFinais]) => {
            let base = votosFinais * fator;
            let ruido = (Math.random() - 0.5) * votosFinais * 0.05;
            sessao[nome] = Math.max(0, Math.round(base + ruido));
        });

        sessoes.push(sessao);
    }

    // Corrige a última sessão para bater exatamente
    let ultima = sessoes[sessoes.length - 1];
    candidatos.forEach(([nome, votos]) => {
        ultima[nome] = votos;
    });

    return sessoes;
}

// Renderiza a sessão atual
function renderizar() {
    container.innerHTML = "";
    document.getElementById("turnoAtual").innerText =
        `Hoje é o ${ADMIN.turno}º turno • Sessão ${sessaoAtual}/${ADMIN.totalSessoes}`;

    for (let cargo in dadosProcessados) {
        let dados = dadosProcessados[cargo][sessaoAtual - 1];
        let total = Object.values(dados).reduce((a, b) => a + b, 0);

        let div = document.createElement("div");
        div.className = "cargo";

        let html = `<h2>${cargo}</h2>
                    <div class="info">Sessão ${sessaoAtual}</div>`;

        for (let nome in dados) {
            let votos = dados[nome];
            let perc = total ? ((votos / total) * 100).toFixed(1) : 0;

            html += `
                <div class="candidato">
                    <div class="nome">${nome} - ${votos} votos (${perc}%)</div>
                    <div class="barra">
                        <div class="progresso" style="width:${perc}%"></div>
                    </div>
                </div>
            `;
        }

        html += `<div class="total">Total de votos: ${total}</div>`;
        div.innerHTML = html;
        container.appendChild(div);
    }
}

/**********************************************************
 CONTROLES
**********************************************************/

document.getElementById("btnSessao").onclick = () => {
    if (sessaoAtual < ADMIN.totalSessoes) {
        sessaoAtual++;
        renderizar();
    }
};

document.getElementById("btnFinal").onclick = () => {
    sessaoAtual = ADMIN.totalSessoes;
    renderizar();
};

/**********************************************************
 INICIALIZAÇÃO
**********************************************************/

prepararDados();
renderizar();
