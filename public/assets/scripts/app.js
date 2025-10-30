// === FUNÇÃO PARA CARREGAR O JSON ===
async function carregarDados() {
  try {
    const response = await fetch('http://localhost:3000/criptomoedas');
    const data = await response.json();
    console.log("Dados recebidos:", data); // 👈 só para depuração
    return data; // retorna diretamente o array
  } catch (error) {
    console.error("Erro ao carregar JSON:", error);
    return [];
  }
}

// === HOME ===
async function montarHome() {
  const carouselContainer = document.getElementById('carousel-container');
  const cardsContainer = document.getElementById('cards-container');
  if (!carouselContainer || !cardsContainer) return;

  const criptomoedas = await carregarDados();

  // --- Carrossel (3 primeiros destaques) ---
  criptomoedas
    .filter(item => item.destaque)
    .slice(0, 3)
    .forEach((item, index) => {
      const activeClass = index === 0 ? 'active' : '';
      carouselContainer.innerHTML += `
        <div class="carousel-item ${activeClass}">
          <div class="text-center">
            <a href="detalhes.html?id=${item.id}" class="text-decoration-none text-dark">
              <img src="${item.imagem_principal}" class="d-block w-100 rounded" alt="${item.nome}">
              <div class="carousel-caption bg-dark bg-opacity-50 rounded p-2">
                <h5 class="text-white">${item.nome}</h5>
                <p class="text-white-50 small">${item.descricao}</p>
              </div>
            </a>
          </div>
        </div>
      `;
    });

  // --- Cards (todas as criptomoedas) ---
  criptomoedas.forEach(item => {
    const col = document.createElement('div');
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="bloco h-100 p-3 text-center">
        <a href="detalhes.html?id=${item.id}" class="text-decoration-none text-dark">
          <img src="${item.imagem_principal}" alt="${item.nome}" class="w-100 rounded mb-3">
          <h4>${item.nome}</h4>
          <p class="text-muted small">${item.descricao}</p>
        </a>
      </div>
    `;
    cardsContainer.appendChild(col);
  });
}

// === DETALHES ===
async function montarDetalhes() {
  const detalhe = document.getElementById('detalhe');
  if (!detalhe) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const criptomoedas = await carregarDados();
  const item = criptomoedas.find(i => i.id == id);

  if (item) {
    // Subtópicos formatados
    const subtopsHTML = item.subtopicos.map(sub => `
      <div class="col-md-4 mb-3">
        <div class="card h-100">
          <img src="${sub.imagem}" class="card-img-top" alt="${sub.titulo}">
          <div class="card-body">
            <h5 class="card-title">${sub.titulo}</h5>
            <p class="card-text">${sub.descricao}</p>
          </div>
        </div>
      </div>
    `).join('');

    detalhe.innerHTML = `
      <h2>${item.nome}</h2>
      <img src="${item.imagem_principal}" class="w-75 rounded my-3" alt="${item.nome}">
      <p><strong>Criador:</strong> ${item.criador}</p>
      <p><strong>Ano de criação:</strong> ${item.ano_criacao}</p>
      <p>${item.conteudo}</p>
      <hr>
      <h4 class="mt-4">Subtópicos</h4>
      <div class="row mt-3">${subtopsHTML}</div>
    `;
  } else {
    detalhe.innerHTML = "<p>Criptomoeda não encontrada.</p>";
  }
}

// === INICIALIZAÇÃO ===
document.addEventListener('DOMContentLoaded', () => {
  montarHome();
  montarDetalhes();
});
