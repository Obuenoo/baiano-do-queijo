
const precos = {
  q1: 40, q2: 28, q3: 65, q4: 30, q5: 18,
  q6: 30, q7: 35, q8: 16, q9: 8,
};

const nomesProdutos = {
  q1: "Queijo Minas 1kg", q2: "Queijo Cabacinha", q3: "Requeijão Caseiro 1kg",
  q4: "Pacote de Tranças", q5: "Doce de Leite 300ml", q6: "Doce de Leite 600ml",
  q7: "Requeijão Caseiro 500g", q8: "Salame Seara Gourmet", q9: "Doce de Leite de Corte"
};

const fretes = {
  "Louveira": 0, "Vinhedo": 0, "Campinas": 0,
  "Jundiaí": 0, "Valinhos": 0,
};


const getVal = (id) => {
  const el = document.getElementById(id);
  return el ? parseInt(el.value) || 0 : 0;
};


const obterDataHora = () => {
  const agora = new Date();
  return {
    data: agora.toLocaleDateString('pt-BR'),
    hora: agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
};



function atualizarValores() {
  let subtotal = 0;

  
  for (let id in precos) {
    subtotal += getVal(id) * precos[id];
  }

  const cidade = document.getElementById("cidade").value;
  const frete = fretes[cidade] || 0;

  document.getElementById("subtotal").innerText = `R$ ${subtotal}`;
  document.getElementById("frete").innerText = `R$ ${frete}`;
  document.getElementById("total").innerText = `R$ ${subtotal + frete}`;
}


document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("change", atualizarValores);
});



const produtosRef = database.ref("produtos");

produtosRef.on("value", snapshot => {
  const produtos = snapshot.val();
  if (!produtos) return;

  Object.keys(produtos).forEach(id => {
    const estoque = produtos[id].estoque;
    const input = document.getElementById(id);
    if (!input) return;

    
    const cardProduto = input.closest('.item-escondivel'); 

   
    if (cardProduto) {
      if (estoque > 0) {
        cardProduto.style.display = "none"; 
      } else {
        cardProduto.style.display = "block"; 
      }
    }

   
    const productInfo = input.closest('.product-info');
    const spanNome = productInfo ? productInfo.querySelector('.nome') : null;

    let label = document.getElementById(`estoque-${id}`);
    if (!label && spanNome) {
      label = document.createElement("small");
      label.id = `estoque-${id}`;
      label.style.display = "block"; 
      spanNome.appendChild(label);
    }

    if (label) {
      if (estoque <= 0) {
        label.innerText = " • ESGOTADO";
        label.style.color = "red";
        input.disabled = false;
        input.max = 99;
      } else {
        label.innerText = ` • DISPONÍVEL: ${estoque}`;
        label.style.color = "green";
        input.disabled = false;
        input.max = estoque;
      }
    }
  });
});



function mostrarStep(id) {
  document.querySelectorAll(".step").forEach(step => step.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  window.scrollTo(0, 0);
}

function irParaDados() {
  mostrarStep("step-dados");
}

function irParaResumo() {
  atualizarValores();
  mostrarStep("step-resumo");
}

function voltarParaProdutos() { mostrarStep("step-produtos"); }
function voltarParaDados() { mostrarStep("step-dados"); }


function finalizarPedido() {
  const { data, hora } = obterDataHora();
  const nome = document.getElementById("nome").value;
  const rua = document.getElementById("rua").value;
  const numero = document.getElementById("numero").value;
  const bairro = document.getElementById("bairro").value;
  const cidade = document.getElementById("cidade").value;
  const pagamento = document.getElementById("pagamento").value;

  if (!nome.trim()) return alert("Por favor, informe seu nome.");

  let pedidoTexto = "";
  for (let id in nomesProdutos) {
    const qtd = getVal(id);
    if (qtd > 0) {
      pedidoTexto += `🔹 ${nomesProdutos[id]} (${qtd}x)\n`;
    }
  }

  if (!pedidoTexto) return alert("Selecione ao menos um item.");

  const mensagem = `*🧀 BAIANO DO QUEIJO - NOVO PEDIDO* \n` +
    `_Pedido em ${data} às ${hora}_ \n` +
    `──────────────────────\n\n` +
    `👤 *CLIENTE:* ${nome}\n` +
    `📍 *ENDEREÇO:* ${rua}, ${numero}\n` +
    `🏙 *CIDADE:* ${cidade} (${bairro})\n\n` +
    `📦 *ITENS:* \n${pedidoTexto}\n` +
    `💳 *PAGAMENTO:* ${pagamento}\n\n` +
    `──────────────────────\n` +
    `💰 *TOTAL: ${document.getElementById("total").innerText}*\n` +
    `──────────────────────\n\n` +
    `✅ *Aguardando confirmação.*`;

  window.open(`https://wa.me/553898285073?text=${encodeURIComponent(mensagem)}`, "_blank");
}

function finalizarItemFaltante() {
  const { data, hora } = obterDataHora();
  const nome = document.getElementById("nome").value;
  const cidade = document.getElementById("cidade").value;

  if (!nome) return alert("Preencha seu nome para avisarmos você.");

  let itensInteresse = "";
  for (let id in nomesProdutos) {
    const qtd = getVal(id);
    if (qtd > 0) {
      itensInteresse += `🔸 ${nomesProdutos[id]} (${qtd}x)\n`;
    }
  }

  if (!itensInteresse) return alert("Escolha o item que você deseja.");

  const mensagem = `*🔔 AVISE-ME QUANDO CHEGAR*\n` +
    `_Solicitado em ${data} às ${hora}_\n` +
    `──────────────────────\n\n` +
    `👤 *CLIENTE:* ${nome}\n` +
    `🏙 *CIDADE:* ${cidade}\n\n` +
    `📋 *INTERESSE EM:*\n${itensInteresse}\n` +
    `──────────────────────\n\n` +
    `✅ *Solicitação enviada.*`;

  window.open(`https://wa.me/553898285073?text=${encodeURIComponent(mensagem)}`, "_blank");
}


function alterar(id, delta) {
  const input = document.getElementById(id);
  let valor = (parseInt(input.value) || 0) + delta;

  const min = parseInt(input.min) || 0;
  const max = parseInt(input.max) || 999;

  if (valor < min) valor = min;
  if (valor > max) valor = max;

  input.value = valor;
  atualizarValores();
}
