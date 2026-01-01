const precos = {
  q1: 40,
  q2: 28,
  q3: 65,
  q4: 30,
};

const fretes = {
  "Louveira": 0,
  "Vinhedo": 15,
  "Campinas": 25,
  "Jundiaí": 20,
  "Valinhos": 25,
};

document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("change", atualizarValores);
});

const produtosRef = database.ref("produtos");

produtosRef.on("value", snapshot => {
  const produtos = snapshot.val();

  Object.keys(produtos).forEach(id => {
    const estoque = produtos[id].estoque;
    const input = document.getElementById(id);

    if (!input) return;

    input.max = estoque;

    let label = document.getElementById(`estoque-${id}`);
    if (!label) {
      label = document.createElement("small");
      label.id = `estoque-${id}`;
      input.parentElement.querySelector("span").appendChild(label);
    }

    if (estoque <= 0) {
      label.innerText = " • ESGOTADO";
      label.style.color = "red";
      input.disabled = true;
    } else {
      label.innerText = ` • Disponível: ${estoque}`;
      label.style.color = "green";
      input.disabled = false;
    }
  });
});

function avisar(produtoId) {
  const nome = prompt("Digite seu nome:");
  const telefone = prompt("Digite seu WhatsApp:");

  if (!nome || !telefone) return;

  database.ref("avisos").push({
    produto: produtoId,
    nome,
    telefone,
    data: new Date().toISOString()
  });

  alert("Perfeito! Avisaremos quando o produto estiver disponível.");
}


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
