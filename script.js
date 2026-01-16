const precos = {
  q1: 40,
  q2: 28,
  q3: 65,
  q4: 30,
};

const fretes = {
  "Louveira": 0,
  "Vinhedo": 0,
  "Campinas": 0,
  "Jundiaí": 0,
  "Valinhos": 0,
};

document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("change", atualizarValores);
});

const produtosRef = database.ref("produtos");

produtosRef.on("value", snapshot => {
  const produtos = snapshot.val();
  console.log("Dados recebidos do Firebase:", produtos);
  if (!produtos) return;

  Object.keys(produtos).forEach(id => {
    const estoque = produtos[id].estoque;
    const input = document.getElementById(id);

    if (!input) return;

    input.max = estoque;

    const productDiv = input.closest('.product');
    const spanNome = productDiv ? productDiv.querySelector('span') : null;

    let label = document.getElementById(`estoque-${id}`);

    if (!label && spanNome) {
      label = document.createElement("small");
      label.id = `estoque-${id}`;
      spanNome.appendChild(label);
    }

    if (label) {
      if (estoque <= 0) {
        label.innerText = "• ESGOTADO";
        label.style.color = "red";
        input.disabled = true;
      } else {
        label.innerText = ` • Disponível: ${estoque}`;
        label.style.color = "green";
        input.disabled = false;
      }
    }
  });
});

function atualizarValores() {
  let subtotal = 0;

  for (let id in precos) {
    subtotal += document.getElementById(id).value * precos[id];
  }

  const cidade = document.getElementById("cidade").value;
  const frete = fretes[cidade];

  document.getElementById("subtotal").innerText = `R$${subtotal}`;
  document.getElementById("frete").innerText = `R$${frete}`;
  document.getElementById("total").innerText = `R$${subtotal + frete}`;
}

function finalizarPedido() {
  const nome = document.getElementById("nome").value;
  const rua = document.getElementById("rua").value;
  const numero = document.getElementById("numero").value;
  const bairro = document.getElementById("bairro").value;
  const cidade = document.getElementById("cidade").value;
  const pagamento = document.getElementById("pagamento").value;

  let pedido = "";
  if (q1.value > 0) pedido += `- Queijo Minas (${q1.value}x)\n`;
  if (q2.value > 0) pedido += `- Queijo Cabacinha (${q2.value}x)\n`;
  if (q3.value > 0) pedido += `- Requeijão Caseiro (${q3.value}x)\n`;
  if (q4.value > 0) pedido += `- Tranças (${q4.value}x)\n`;

  if (pedido === "") {
    alert("Selecione a quantidade de pelo menos um item que você deseja pedir.");
    return;
  }

  const subtotal = document.getElementById("subtotal").innerText;
  const frete = document.getElementById("frete").innerText;
  const total = document.getElementById("total").innerText;

  const mensagem =
    `🧀 NOVO PEDIDO

👤 Cliente: ${nome}
📍 Endereço: ${rua}, ${numero} - ${bairro}
🏙 Cidade: ${cidade}

🧾 Pedido:
${pedido}
💰 Subtotal: ${subtotal}
🚚 Frete: ${frete}
💵 Total: ${total}
💳 Pagamento: ${pagamento}`;

  const numeroWhatsApp = "553898285073";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

function finalizarItemFaltante() {

  const nome = document.getElementById("nome").value;
  const cidade = document.getElementById("cidade").value;


  const q1 = document.getElementById("q1");
  const q2 = document.getElementById("q2");
  const q3 = document.getElementById("q3");
  const q4 = document.getElementById("q4");

  if (!nome) {
    alert("Por favor, preencha seu nome antes de enviar.");
    return;
  }

  let pedido = "";
  if (parseInt(q1.value) > 0) pedido += `- Queijo Minas (${q1.value}x)\n`;
  if (parseInt(q2.value) > 0) pedido += `- Queijo Cabacinha (${q2.value}x)\n`;
  if (parseInt(q3.value) > 0) pedido += `- Requeijão Caseiro (${q3.value}x)\n`;
  if (parseInt(q4.value) > 0) pedido += `- Tranças (${q4.value}x)\n`;

  if (pedido === "") {
    alert("Selecione a quantidade de pelo menos um item que você deseja pedir.");
    return;
  }

  const mensagem =
    `🧀 *AVISE-ME QUANDO CHEGAR*

👤 *Cliente:* ${nome}
🏙 *Cidade:* ${cidade}

📋 *Tenho interesse em:*
${pedido}
⚠️ _Gostaria de ser avisado quando esses itens voltarem ao estoque._`;

  const numeroWhatsApp = "553898285073";
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}

function alterar(id, delta) {
  const input = document.getElementById(id);
  let valor = parseInt(input.value) || 0;

  const min = parseInt(input.min) || 0;
  const max = parseInt(input.max) || 999;

  valor += delta;

  if (valor < min) valor = min;
  if (valor > max) valor = max;

  input.value = valor;

  atualizarValores();
}

function mostrarStep(id) {
  document.querySelectorAll(".step").forEach(step => {
    step.classList.add("hidden");
  });

  document.getElementById(id).classList.remove("hidden");
}

function irParaDados() {
  mostrarStep("step-dados");
}

function irParaResumo() {
  atualizarValores();
  mostrarStep("step-resumo");
}


function voltarParaProdutos() {
  mostrarStep("step-produtos");
}

function voltarParaDados() {
  mostrarStep("step-dados");
}
