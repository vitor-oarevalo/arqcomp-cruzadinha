const casos = [
  {
    id: 1, nome: "CPU", arquivo: "cpu.png",
    dica: "Componente que executa instruções, faz cálculos e coordena as tarefas de um computador",
    respostas: ["cpu"]
  },
  {
    id: 2, nome: "ULA", arquivo: "ula.png",
    dica: "Componente que executa operações matemáticas e lógicas em um processador",
    respostas: ["ula"]
  },
  {
    id: 3, nome: "UC (Unidade de Controle)", arquivo: "uc.png",
    dica: "Componente que busca, decodifica e coordena a execução de instruções",
    respostas: ["uc", "unidade de controle"]
  },
  {
    id: 4, nome: "Registradores", arquivo: "registradores.png",
    dica: "Pequenas memórias extremamente rápidas de um processador",
    respostas: ["registradores", "registrador"]
  },
  {
    id: 5, nome: "RAM", arquivo: "ram.png",
    dica: "Memória temporária e volátil do computador",
    respostas: ["ram"]
  },
  {
    id: 6, nome: "ROM", arquivo: "rom.png",
    dica: "Memória permanente e não volátil, de apenas leitura, que guarda a BIOS",
    respostas: ["rom"]
  },
  {
    id: 7, nome: "EEPROM", arquivo: "eeprom.png",
    dica: "Memória não volátil que permite alterar um byte por vez",
    respostas: ["eeprom"]
  },
  {
    id: 8, nome: "Flash", arquivo: "flash.png",
    dica: "Memória não volátil que permite gravar dados em blocos grandes",
    respostas: ["flash", "memoria flash"]
  },
  {
    id: 9, nome: "Cache", arquivo: "cache.png",
    dica: "Memória muito rápida integrada no próprio chip do processador",
    respostas: ["cache", "memoria cache"]
  },
  {
    id: 10, nome: "Memória de Massa", arquivo: "memoria-de-massa.png",
    dica: "Dispositivos usados para armazenar grandes quantidade de dados. Não volátil e mais lento",
    respostas: ["memoria de massa", "armazenamento", "memoria de armazenamento", "memoriademassa"]
  },
  {
    id: 11, nome: "DMA", arquivo: "dma.png",
    dica: "Recurso do hardware que permite que dados sejam escritos diretamente na RAM",
    respostas: ["dma", "direct memory access", "acesso direto a memoria"]
  },
  {
    id: 12, nome: "Address Bus", arquivo: "address-bus.png",
    dica: "Conjunto de linhas condutoras da CPU para enviar endereços de memória",
    respostas: ["address bus", "barramento de endereco", "barramento de enderecos", "adressbus"]
  },
  {
    id: 13, nome: "Data Bus", arquivo: "data-bus.png",
    dica: "Conjunto de conexões que transfere dados entre componentes de um processador",
    respostas: ["data bus", "barramento de dados", "databus"]
  },
  {
    id: 14, nome: "Microcontrolador", arquivo: "microcontrolador.png",
    dica: "Computador compacto integrado em um único chip",
    respostas: ["microcontrolador"]
  },
  {
    id: 15, nome: "Dual Core", arquivo: "dual-core.png",
    dica: "CPU que possui dois núcleos de processamento independentes em um hardware",
    respostas: ["dual core", "dualcore"]
  },
  {
    id: 16, nome: "Quad Core", arquivo: "quad-core.png",
    dica: "CPU que possui quatro núcleos de processamento independentes em um hardware",
    respostas: ["quad core", "quadcore"]
  }
];

const caminhoImagens = "./img/";
const imagemInterrogacao = `${caminhoImagens}mistery.png`;

const telaInicial = document.querySelector("#tela-inicial");
const telaInvestigacao = document.querySelector("#tela-investigacao");
const telaResultado = document.querySelector("#tela-resultado");
const mural = document.querySelector("#mural");
const btnConferir = document.querySelector("#btn-conferir");
const btnReiniciar = document.querySelector("#btn-reiniciar");
const btnAceitar = document.querySelector("#btn-aceitar");
const btnRecusar = document.querySelector("#btn-recusar");
const respostaDiretor = document.querySelector("#resposta-diretor");

let investigacaoConferida = false;

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function mostrarTela(telaAtiva) {
  [telaInicial, telaInvestigacao, telaResultado].forEach(tela => {
    tela.classList.add("hidden");
  });
  telaAtiva.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function criarCards() {
  mural.querySelectorAll(".evidence-card").forEach(card => card.remove());

  casos.forEach(caso => {
    const card = document.createElement("article");
    card.className = "evidence-card";
    card.dataset.id = caso.id;

    card.innerHTML = `
      <div class="evidence-number">
        <span>EVIDÊNCIA Nº ${String(caso.id).padStart(2, "0")}</span>
        <span class="status-dot" aria-hidden="true"></span>
      </div>
      <div class="photo-frame">
        <img class="component-image" src="./img/mistery.png" alt="Evidência ainda não identificada">
      </div>
      <h3 class="evidence-title">CASO ${String(caso.id).padStart(2, "0")}</h3>
      <p class="evidence-clue">${caso.dica}</p>
      <input
        class="answer-input"
        type="text"
        autocomplete="off"
        spellcheck="false"
        aria-label="Resposta da evidência ${caso.id}"
        placeholder="Digite o componente..."
      >
      <p class="evidence-feedback" aria-live="polite"></p>
    `;

    const input = card.querySelector(".answer-input");
    input.addEventListener("input", () => {
      atualizarProgresso();
    });

    mural.appendChild(card);
  });

  atualizarProgresso();
}



function atualizarProgresso() {
  const inputs = [...document.querySelectorAll(".answer-input")];
  const preenchidos = inputs.filter(input => input.value.trim() !== "").length;
  document.querySelector("#progresso").innerHTML = `${preenchidos} <small>/ 16</small>`;
  document.querySelector("#barra-progresso").style.width = `${(preenchidos / casos.length) * 100}%`;

  const faltam = casos.length - preenchidos;
  document.querySelector("#status-preenchimento").textContent =
    faltam === 0 ? "Todas as evidências foram preenchidas. Você já pode conferir!" :
    `Ainda faltam ${faltam} ${faltam === 1 ? "resposta" : "respostas"}.`;

  btnConferir.disabled = preenchidos !== casos.length || investigacaoConferida;
}

function conferirInvestigacao() {
  if (investigacaoConferida) return;

  const cards = [...document.querySelectorAll(".evidence-card")];
  const todosPreenchidos = cards.every(card => card.querySelector(".answer-input").value.trim() !== "");

  if (!todosPreenchidos) {
    alert("Preencha todas as 16 evidências antes de conferir.");
    return;
  }

  investigacaoConferida = true;
  let acertos = 0;
  const resultados = [];

  cards.forEach((card, indice) => {
    const caso = casos[indice];
    const input = card.querySelector(".answer-input");
    const respostaJogador = input.value.trim();
    const respostaNormalizada = normalizar(respostaJogador);
    const correto = caso.respostas.some(opcao => normalizar(opcao) === respostaNormalizada);

    card.classList.add(correto ? "is-correct" : "is-wrong");
    input.disabled = true;
    card.querySelector(".evidence-feedback").textContent = correto
      ? "✓ Evidência identificada"
      : `✕ Resposta correta: ${caso.nome}`;

    if (correto) acertos++;

    resultados.push({
      caso,
      respostaJogador,
      correto
    });
  });

  exibirResultado(acertos, resultados);
}

function calcularPagamento(acertos) {
  if (acertos <= 3) return 1000;
  if (acertos <= 6) return 3000;
  if (acertos <= 9) return 6000;
  if (acertos <= 11) return 9000;
  return 15000;
}

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function mensagemDesempenho(acertos) {
  if (acertos <= 3) return "O diretor está preocupado. Talvez seja melhor revisar alguns conceitos antes de assumir outro caso.";
  if (acertos <= 6) return "Não foi perfeito, mas você conseguiu resolver parte dos problemas. A empresa agradece o esforço!";
  if (acertos <= 9) return "Bom trabalho! Você solucionou a maioria dos casos e ajudou a empresa a voltar aos trilhos.";
  if (acertos <= 11) return "Excelente profissional! O diretor está impressionado com sua capacidade de investigação.";
  return "ABSURDO! Você resolveu todos os casos! O diretor nunca mais vai precisar contratar outra equipe.";
}

function valorPorExtensoSimples(valor) {
  const textos = {
    1000: "Mil reais",
    3000: "Três mil reais",
    6000: "Seis mil reais",
    9000: "Nove mil reais",
    15000: "Quinze mil reais"
  };
  return textos[valor] || "Pagamento referente à investigação.";
}

function exibirResultado(acertos, resultados) {
  const pagamento = calcularPagamento(acertos);
  document.querySelector("#total-acertos").textContent = `${acertos} de 16`;
  document.querySelector("#mensagem-resultado").textContent = mensagemDesempenho(acertos);
  document.querySelector("#valor-pagamento").textContent = formatarMoeda(pagamento);
  document.querySelector("#valor-extenso").textContent = valorPorExtensoSimples(pagamento);
  document.querySelector("#acertos-cheque").textContent = `${acertos} / 16`;

  const lista = document.querySelector("#lista-relatorio");
  lista.innerHTML = "";

  resultados.forEach(resultado => {
    const item = document.createElement("article");
    item.className = `report-item ${resultado.correto ? "correct" : ""}`;
    const status = resultado.correto ? "✓ CORRETO" : "✕ INCORRETO";
    item.innerHTML = `
      <strong>${String(resultado.caso.id).padStart(2, "0")} · ${resultado.caso.nome} — ${status}</strong>
      <p>Sua resposta: ${escaparHtml(resultado.respostaJogador)}</p>
      ${resultado.correto ? "" : `<p class="correct-answer">Resposta esperada: <b>${resultado.caso.nome}</b></p>`}
    `;
    lista.appendChild(item);
  });

  document.querySelector("#resumo-relatorio").textContent = `${acertos} acertos · ${16 - acertos} erros`;
  mostrarTela(telaResultado);
}

function escaparHtml(texto) {
  return texto.replace(/[&<>"']/g, caractere => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[caractere]);
}

function reiniciarJogo() {
  investigacaoConferida = false;
  document.querySelectorAll(".answer-input").forEach(input => {
    input.value = "";
    input.disabled = false;
  });
  document.querySelectorAll(".evidence-card").forEach(card => {
    card.classList.remove("is-correct", "is-wrong");
    card.querySelector(".evidence-feedback").textContent = "";
    const imagem = card.querySelector(".component-image");
    imagem.onerror = null;
    imagem.src = imagemInterrogacao;
    imagem.alt = "Evidência ainda não identificada";
  });
  document.querySelector("#relatorio-erros").classList.add("hidden");
  atualizarProgresso();
  mostrarTela(telaInicial);
  respostaDiretor.textContent = "";
}

btnAceitar.addEventListener("click", () => {
  respostaDiretor.textContent = "";
  mostrarTela(telaInvestigacao);
});

btnRecusar.addEventListener("click", () => {
  respostaDiretor.textContent = "“Humpf! Vou procurar outro então! Não tenho tempo a perder!”";
  window.setTimeout(() => {
    respostaDiretor.textContent = "";
  }, 2800);
});

document.querySelector("#btn-voltar").addEventListener("click", () => {
  mostrarTela(telaInicial);
});

btnConferir.addEventListener("click", conferirInvestigacao);
btnReiniciar.addEventListener("click", () => {
  if (confirm("Tem certeza de que deseja limpar todas as respostas e reiniciar a investigação?")) {
    reiniciarJogo();
  }
});

document.querySelector("#btn-ver-erros").addEventListener("click", () => {
  const relatorio = document.querySelector("#relatorio-erros");
  relatorio.classList.toggle("hidden");
  if (!relatorio.classList.contains("hidden")) {
    relatorio.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

document.querySelector("#btn-jogar-novamente").addEventListener("click", reiniciarJogo);

criarCards();
