/**
 * Luméri Perfumes Árabes - Sistema Global de Busca & Catálogo
 * Permite buscar todos os perfumes e kits da loja e direciona o usuário
 * diretamente à categoria e de frente ao card do produto.
 */

(function () {
  'use strict';

  // Helper para normalizar strings para busca e slugs (remove acentos e pontuação)
  function normalizeText(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function toSlug(str) {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  const formatPrice = (v) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Registro Completo de Todos os Perfumes e Kits do Projeto Luméri
  const CATALOG = [
    // --- LANÇAMENTOS ---
    {
      name: 'Club de Nuit Maleka',
      brand: 'Armaf',
      category: 'Lançamentos',
      categoryKey: 'lancamentos',
      targetPage: 'lancamentos.html',
      price: 389.90,
      vol: 'Eau de Parfum • 105 ml',
      notes: 'Frutas Exóticas • Jasmim • Baunilha Cristalizada',
      badge: 'Lançamento 2025/2026',
      img: 'club-de-nuit-maleka.png',
      installments: '10x de R$ 38,99 s/ juros'
    },
    {
      name: 'His Confession',
      brand: 'Lattafa',
      category: 'Lançamentos',
      categoryKey: 'lancamentos',
      targetPage: 'lancamentos.html',
      price: 379.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Fava Tonka • Pimenta Rosa • Madeira Escura & Âmbar',
      badge: 'Frasco Escultura',
      img: 'kit-his-confession.png',
      installments: '10x de R$ 37,99 s/ juros'
    },
    {
      name: 'Her Confession',
      brand: 'Lattafa',
      category: 'Lançamentos',
      categoryKey: 'lancamentos',
      targetPage: 'lancamentos.html',
      price: 369.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Tuberosa • Âmbar Nobre • Caramelo Tostado',
      badge: 'Frasco Escultura',
      img: 'kit-her-confession.png',
      installments: '10x de R$ 36,99 s/ juros'
    },
    {
      name: 'Asad Bourbon',
      brand: 'Lattafa',
      category: 'Lançamentos',
      categoryKey: 'lancamentos',
      targetPage: 'lancamentos.html',
      price: 299.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Bourbon • Canela • Cacau • Carvalho Nobre',
      badge: 'Novo Sucesso Asad',
      img: 'kit-asad-bourbon.png',
      installments: '10x de R$ 29,99 s/ juros'
    },
    {
      name: 'Club de Nuit Élite',
      brand: 'Armaf',
      category: 'Lançamentos',
      categoryKey: 'lancamentos',
      targetPage: 'lancamentos.html',
      price: 389.90,
      vol: 'Eau de Parfum • 105 ml',
      notes: 'Chá Verde • Bergamota • Rosa Centifolia & Vetiver',
      badge: 'Destaque 2026',
      img: 'club-de-nuit-elite.png',
      installments: '10x de R$ 38,99 s/ juros'
    },
    {
      name: 'Musamam White Intense',
      brand: 'Lattafa',
      category: 'Unissex',
      categoryKey: 'unissex',
      targetPage: 'unissex.html',
      price: 349.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Bergamota • Sândalo • Ylang-Ylang & Almíscar',
      badge: 'Serpente de Ouro',
      img: 'musamam-white-intense.png',
      installments: '10x de R$ 34,99 s/ juros'
    },

    // --- FEMININOS ---
    {
      name: 'Yara Rose',
      brand: 'Lattafa',
      category: 'Femininos',
      categoryKey: 'femininos',
      targetPage: 'femininos.html',
      price: 229.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Orquídea • Baunilha • Frutas Vermelhas',
      badge: 'Mais Vendido',
      img: 'yara-rose.png',
      installments: '10x de R$ 22,99 s/ juros'
    },
    {
      name: 'Fakhar Extrait Gold',
      brand: 'Lattafa',
      category: 'Femininos',
      categoryKey: 'femininos',
      targetPage: 'femininos.html',
      price: 269.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Flores Brancas • Ylang-Ylang • Fava Tonka',
      badge: 'Alta Fixação',
      img: 'fakhar-gold.png',
      installments: '10x de R$ 26,99 s/ juros'
    },
    {
      name: 'Yara Tous Sweet Exotic',
      brand: 'Lattafa',
      category: 'Femininos',
      categoryKey: 'femininos',
      targetPage: 'femininos.html',
      price: 239.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Manga Suculenta • Coco • Flor de Laranjeira',
      badge: 'Verão Gourmet',
      img: 'yara-rose.png',
      installments: '10x de R$ 23,99 s/ juros'
    },

    // --- MASCULINOS ---
    {
      name: 'Asad Black',
      brand: 'Lattafa',
      category: 'Masculinos',
      categoryKey: 'masculinos',
      targetPage: 'masculinos.html',
      price: 249.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Pimenta Preta • Tabaco Nobre • Âmbar & Café',
      badge: 'Mais Vendido',
      img: 'asad-preto.png',
      installments: '10x de R$ 24,99 s/ juros'
    },
    {
      name: 'Fakhar Black Men',
      brand: 'Lattafa',
      category: 'Masculinos',
      categoryKey: 'masculinos',
      targetPage: 'masculinos.html',
      price: 259.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Maçã Verde • Bergamota • Cedro & Gerânio',
      badge: 'Clássico Árabe',
      img: 'fakhar-black.png',
      installments: '10x de R$ 25,99 s/ juros'
    },
    {
      name: 'Club de Nuit Intense Man',
      brand: 'Armaf',
      category: 'Masculinos',
      categoryKey: 'masculinos',
      targetPage: 'masculinos.html',
      price: 349.90,
      vol: 'Eau de Parfum • 105 ml',
      notes: 'Limão Siciliano • Abacaxi • Bétula Defumada',
      badge: 'Ícone Mundial',
      img: 'asad-preto.png',
      installments: '10x de R$ 34,99 s/ juros'
    },
    {
      name: "Bade'e Al Oud Honor & Glory",
      brand: 'Lattafa',
      category: 'Masculinos',
      categoryKey: 'masculinos',
      targetPage: 'masculinos.html',
      price: 289.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Abacaxi Brûlée • Canela • Benjoim • Oud Dourado',
      badge: 'Exclusivo',
      img: 'fakhar-gold.png',
      installments: '10x de R$ 28,99 s/ juros'
    },

    // --- UNISSEX ---
    {
      name: 'Khamrah',
      brand: 'Lattafa',
      category: 'Unissex',
      categoryKey: 'unissex',
      targetPage: 'unissex.html',
      price: 329.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Canela • Noz-Moscada • Pralinê • Tâmaras & Baunilha',
      badge: 'Sucesso Mundial',
      img: 'khamrah-lattafa.png',
      installments: '10x de R$ 32,99 s/ juros'
    },
    {
      name: 'Oud for Glory Black',
      brand: 'Lattafa',
      category: 'Unissex',
      categoryKey: 'unissex',
      targetPage: 'unissex.html',
      price: 279.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Lavanda Suave • Noz-Moscada • Patchouli & Oud Real',
      badge: 'Alta Fixação',
      img: 'fakhar-black.png',
      installments: '10x de R$ 27,99 s/ juros'
    },
    {
      name: 'Al Noble Wazeer',
      brand: 'Lattafa',
      category: 'Unissex',
      categoryKey: 'unissex',
      targetPage: 'unissex.html',
      price: 299.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Menta Refrescante • Zimbro • Chocolate Branco & Íris',
      badge: 'Exclusivo',
      img: 'club-de-nuit-maleka.png',
      installments: '10x de R$ 29,99 s/ juros'
    },
    {
      name: 'Musamam Cobra Black',
      brand: 'Lattafa',
      category: 'Unissex',
      categoryKey: 'unissex',
      targetPage: 'unissex.html',
      price: 359.90,
      vol: 'Eau de Parfum • 100 ml',
      notes: 'Mandarina Italiana • Cardamomo • Gerânio & Couro',
      badge: 'Edição Luxo',
      img: 'asad-preto.png',
      installments: '10x de R$ 35,99 s/ juros'
    },

    // --- KITS & PRESENTES ---
    {
      name: 'Kit Asad Bourbon 3 Pcs',
      brand: 'Lattafa',
      category: 'Kits Presentes',
      categoryKey: 'kits',
      targetPage: 'kits-presentes.html',
      price: 449.90,
      vol: 'Estojo Luxo • 100ml + 12ml + 100ml',
      notes: 'Perfume 100ml • Travel Spray 12ml • Shower Gel 100ml',
      badge: 'Mais Desejado',
      img: 'kit-presente.png',
      installments: '10x de R$ 44,99 s/ juros'
    },
    {
      name: 'Kit Musamam White Intense 3 Pcs',
      brand: 'Lattafa',
      category: 'Kits Presentes',
      categoryKey: 'kits',
      targetPage: 'kits-presentes.html',
      price: 499.90,
      vol: 'Estojo Luxo • 100ml + 12ml + 50ml',
      notes: 'Perfume 100ml • Travel Spray 12ml • Hair Mist 50ml',
      badge: 'Serpente de Ouro',
      img: 'kit-musamam-white.png',
      installments: '10x de R$ 49,99 s/ juros'
    },
    {
      name: 'Kit His Confession 3 Pcs',
      brand: 'Lattafa',
      category: 'Kits Presentes',
      categoryKey: 'kits',
      targetPage: 'kits-presentes.html',
      price: 519.90,
      vol: 'Estojo Luxo • 100ml + 12ml + 100ml',
      notes: 'Perfume 100ml • Travel Spray 12ml • Shower Gel 100ml',
      badge: 'Frasco Escultura',
      img: 'kit-his-confession.png',
      installments: '10x de R$ 51,99 s/ juros'
    },
    {
      name: 'Kit Her Confession 3 Pcs',
      brand: 'Lattafa',
      category: 'Kits Presentes',
      categoryKey: 'kits',
      targetPage: 'kits-presentes.html',
      price: 519.90,
      vol: 'Estojo Luxo • 100ml + 12ml + 50ml',
      notes: 'Perfume 100ml • Travel Spray 12ml • Hair Mist 50ml',
      badge: 'Frasco Escultura',
      img: 'kit-her-confession.png',
      installments: '10x de R$ 51,99 s/ juros'
    },
    {
      name: 'Kit Duo Yara Rose & Yara Tous',
      brand: 'Lattafa',
      category: 'Kits Presentes',
      categoryKey: 'kits',
      targetPage: 'kits-presentes.html',
      price: 399.90,
      vol: 'Kit Presente • 2 Frascos de 100ml',
      notes: 'Yara Rose 100ml + Yara Tous 100ml em Caixa Dourada',
      badge: 'Dupla Perfeita',
      img: 'yara-rose.png',
      installments: '10x de R$ 39,99 s/ juros'
    },
    {
      name: 'Kit Coleção Black & Gold',
      brand: 'Lattafa',
      category: 'Kits Presentes',
      categoryKey: 'kits',
      targetPage: 'kits-presentes.html',
      price: 469.90,
      vol: 'Kit Presente • 2 Frascos de 100ml',
      notes: 'Fakhar Gold Extrait 100ml + Fakhar Black Men 100ml',
      badge: 'Edição Casal',
      img: 'fakhar-gold.png',
      installments: '10x de R$ 46,99 s/ juros'
    }
  ];

  // Adiciona o slug, URL de destino e caminho correto de imagem para cada item do catálogo
  CATALOG.forEach((item) => {
    item.slug = toSlug(item.name);
    item.cardId = 'prod-' + item.slug;
    item.targetUrl = item.targetPage + '#' + item.cardId;
    if (item.img && !item.img.startsWith('http') && !item.img.startsWith('../')) {
      item.img = '../img/' + item.img;
    }
  });

  // Estado da Busca
  let currentFilter = 'todos';
  let searchOverlay = null;
  let searchInput = null;
  let clearBtn = null;
  let resultsArea = null;
  let activeHighlightTimer = null;

  // Cria a interface HTML do Modal de Busca
  function createSearchModal() {
    if (document.getElementById('lumeri-search-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'lumeri-search-modal-overlay';
    overlay.className = 'lumeri-search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Buscar Perfumes e Kits');

    overlay.innerHTML = `
      <div class="lumeri-search-modal" id="lumeri-search-modal">
        <div class="search-modal-header">
          <div class="search-input-wrapper">
            <svg class="search-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              class="search-modal-input" 
              id="search-input-field" 
              placeholder="Buscar perfume, marca ou kit (ex: Yara, Asad, Khamrah)..." 
              autocomplete="off"
              spellcheck="false"
            />
            <button class="search-clear-btn" id="search-clear-btn" aria-label="Limpar pesquisa">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <button class="search-close-btn" id="search-close-btn" aria-label="Fechar busca">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div class="search-categories-bar" id="search-categories-bar">
          <button class="search-cat-pill active" data-cat="todos">Todos (${CATALOG.length})</button>
          <button class="search-cat-pill" data-cat="lancamentos">Lançamentos</button>
          <button class="search-cat-pill" data-cat="femininos">Femininos</button>
          <button class="search-cat-pill" data-cat="masculinos">Masculinos</button>
          <button class="search-cat-pill" data-cat="unissex">Unissex</button>
          <button class="search-cat-pill" data-cat="kits">Kits & Presentes</button>
        </div>

        <div class="search-results-area" id="search-results-area">
          <!-- Renderizado via JS -->
        </div>

        <div class="search-modal-footer">
          <span>Luméri • Alta Perfumaria Árabe</span>
          <div class="search-keyboard-hints">
            <span><kbd class="search-kbd">↑</kbd> <kbd class="search-kbd">↓</kbd> navegar</span>
            <span><kbd class="search-kbd">ENTER</kbd> selecionar</span>
            <span><kbd class="search-kbd">ESC</kbd> fechar</span>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    searchOverlay = overlay;
    searchInput = document.getElementById('search-input-field');
    clearBtn = document.getElementById('search-clear-btn');
    resultsArea = document.getElementById('search-results-area');

    // Eventos do modal
    document.getElementById('search-close-btn').addEventListener('click', closeSearch);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeSearch();
    });

    clearBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearBtn.classList.remove('visible');
      searchInput.focus();
      renderResults('');
    });

    searchInput.addEventListener('input', () => {
      const q = searchInput.value;
      if (q.trim().length > 0) {
        clearBtn.classList.add('visible');
      } else {
        clearBtn.classList.remove('visible');
      }
      renderResults(q);
    });

    // Filtros de Categoria
    document.getElementById('search-categories-bar').addEventListener('click', (e) => {
      const pill = e.target.closest('.search-cat-pill');
      if (!pill) return;
      document.querySelectorAll('.search-cat-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.cat || 'todos';
      renderResults(searchInput.value);
    });

    // Render Inicial (Populares e mais buscados)
    renderResults('');
  }

  // Filtragem de Produtos
  function filterProducts(query, category) {
    const normQ = normalizeText(query);
    return CATALOG.filter((item) => {
      // Filtro de categoria
      if (category !== 'todos') {
        if (category === 'kits' && item.categoryKey !== 'kits') return false;
        if (category === 'lancamentos' && item.categoryKey !== 'lancamentos') return false;
        if (category === 'femininos' && item.categoryKey !== 'femininos') return false;
        if (category === 'masculinos' && item.categoryKey !== 'masculinos') return false;
        if (category === 'unissex' && item.categoryKey !== 'unissex') return false;
      }

      // Se não digitou nada, passa pelo filtro de categoria
      if (!normQ) return true;

      // Busca por nome, marca, notas ou categoria
      const haystack = normalizeText(`${item.name} ${item.brand} ${item.notes} ${item.category} ${item.badge}`);
      return haystack.includes(normQ);
    });
  }

  // Renderiza a lista de resultados no modal
  function renderResults(query) {
    if (!resultsArea) return;
    const cleanQ = query ? query.trim() : '';
    const filtered = filterProducts(cleanQ, currentFilter);

    if (filtered.length === 0) {
      resultsArea.innerHTML = `
        <div class="search-empty-state">
          <svg class="search-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
          <div class="search-empty-title">Nenhum perfume encontrado</div>
          <div class="search-empty-text">Não encontramos resultados para "<b>${escapeHtml(cleanQ)}</b>". Experimente pesquisar por uma marca ou outro termo:</div>
          <div class="search-chips-title">Sugestões rápidas:</div>
          <div class="search-chips">
            <button class="search-chip-btn" data-search="Yara">Yara Rose</button>
            <button class="search-chip-btn" data-search="Asad">Asad</button>
            <button class="search-chip-btn" data-search="Khamrah">Khamrah</button>
            <button class="search-chip-btn" data-search="Maleka">Club de Nuit</button>
            <button class="search-chip-btn" data-search="Kit">Kits de Presente</button>
          </div>
        </div>
      `;

      resultsArea.querySelectorAll('.search-chip-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          searchInput.value = btn.dataset.search;
          clearBtn.classList.add('visible');
          searchInput.focus();
          renderResults(btn.dataset.search);
        });
      });
      return;
    }

    const metaText = cleanQ
      ? `<span><b>${filtered.length}</b> ${filtered.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}</span>`
      : `<span>Perfumes & Kits em Destaque (${filtered.length})</span>`;

    const html = `
      <div class="search-results-meta">
        ${metaText}
        <span>Clique para ir ao card</span>
      </div>
      <div class="search-results-list">
        ${filtered.map((item) => `
          <a href="${item.targetUrl}" class="search-result-item" data-slug="${item.slug}" data-target-url="${item.targetUrl}">
            <div class="search-result-thumb">
              <img src="${item.img}" alt="${item.name}" loading="lazy" />
            </div>
            <div class="search-result-info">
              <div class="search-result-top">
                <span class="search-result-brand">${item.brand}</span>
                <span class="search-result-category">${item.category}</span>
              </div>
              <h4 class="search-result-name">${highlightMatch(item.name, cleanQ)}</h4>
              <div class="search-result-notes">${item.notes}</div>
              <div class="search-result-pricing">
                <span class="search-result-price">${formatPrice(item.price)}</span>
                <span class="search-result-installment">${item.installments}</span>
              </div>
            </div>
            <div class="search-result-action">
              <span>Ver Produto</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </a>
        `).join('')}
      </div>
    `;

    resultsArea.innerHTML = html;

    // Vincula clique em cada resultado
    resultsArea.querySelectorAll('.search-result-item').forEach((elem) => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        const targetUrl = elem.dataset.targetUrl;
        const slug = elem.dataset.slug;
        handleSelectProduct(slug, targetUrl);
      });
    });
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const escaped = escapeHtml(text);
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return escaped.replace(regex, '<span style="color:#b8892f;text-decoration:underline;font-weight:700;">$1</span>');
  }

  // Ação ao selecionar um produto da busca:
  // Se estiver na mesma página: rola suavemente até o card e destaca!
  // Se estiver em outra página: navega para a URL destino e a outra página executa o scroll e destaque!
  function handleSelectProduct(slug, targetUrl) {
    closeSearch();

    const targetCardId = 'prod-' + slug;
    const currentCard = document.getElementById(targetCardId);

    if (currentCard) {
      // O card já existe na página atual!
      history.replaceState(null, null, '#' + targetCardId);
      spotlightCard(currentCard);
    } else {
      // Navega para a categoria correspondente com a âncora
      window.location.href = targetUrl;
    }
  }

  // Destaque e Centralização do Card de Frente ao Usuário
  function spotlightCard(card) {
    if (!card) return;

    // Rola suavemente deixando o card perfeitamente centralizado na tela
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Remove destaque anterior se houver
    document.querySelectorAll('.card-highlight').forEach((c) => c.classList.remove('card-highlight'));
    document.querySelectorAll('.search-found-badge').forEach((b) => b.remove());

    // Aplica o brilho dourado e a tag de destaque
    card.classList.add('card-highlight');

    const badge = document.createElement('div');
    badge.className = 'search-found-badge';
    badge.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
      <span>Encontrado na Busca</span>
    `;
    card.appendChild(badge);

    if (activeHighlightTimer) clearTimeout(activeHighlightTimer);
    activeHighlightTimer = setTimeout(() => {
      card.classList.remove('card-highlight');
      if (badge && badge.parentNode) {
        badge.style.transition = 'opacity 0.6s ease';
        badge.style.opacity = '0';
        setTimeout(() => badge.remove(), 600);
      }
    }, 4500);
  }

  // Abre o Modal de Busca
  function openSearch() {
    createSearchModal();
    if (!searchOverlay) return;
    searchOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }, 100);
  }

  // Fecha o Modal de Busca
  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Verifica se a URL tem #prod-... e destaca o card
  function checkUrlHashForCard() {
    const hash = window.location.hash;
    if (!hash || !hash.startsWith('#prod-')) return;

    const cardId = hash.substring(1);

    // Tenta encontrar o card imediatamente ou aguarda alguns milissegundos
    function tryFind(attemptsLeft) {
      let card = document.getElementById(cardId);
      if (!card) {
        // Fallback: busca pelo nome do produto nos cards
        const slugPart = cardId.replace('prod-', '');
        const allCards = document.querySelectorAll('article.card, .card');
        for (const c of allCards) {
          const title = c.querySelector('h3.t, h3, .t');
          const btn = c.querySelector('.btn-add');
          const name = (title ? title.textContent : '') || (btn ? btn.dataset.n : '');
          if (toSlug(name) === slugPart) {
            card = c;
            card.id = cardId;
            break;
          }
        }
      }

      if (card) {
        setTimeout(() => {
          spotlightCard(card);
        }, 150);
      } else if (attemptsLeft > 0) {
        setTimeout(() => tryFind(attemptsLeft - 1), 100);
      }
    }

    tryFind(10);
  }

  // Modal de Aviso: Área do Usuário em Desenvolvimento
  let userOverlay = null;

  function createUserModal() {
    if (document.getElementById('lumeri-user-modal-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'lumeri-user-modal-overlay';
    overlay.className = 'lumeri-user-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Área do Cliente em Desenvolvimento');

    overlay.innerHTML = `
      <div class="lumeri-user-modal-card">
        <button class="lumeri-user-close-btn" id="lumeri-user-modal-close" aria-label="Fechar janela">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="lumeri-user-icon-circle">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>

        <span class="lumeri-user-badge">Recurso em Desenvolvimento</span>

        <h3 class="lumeri-user-title">Área do Cliente em Breve</h3>

        <p class="lumeri-user-desc">
          A função de <b>login e cadastro de conta</b> ainda está sendo desenvolvida pela nossa equipe para oferecer a você a melhor experiência, com rastreio de pedidos, histórico de compras e benefícios VIP exclusivos.
          <br><br>
          Por enquanto, para tirar dúvidas, consultar pedidos ou receber atendimento exclusivo, fale diretamente com o nosso <b>WhatsApp Concierge Oficial</b>!
        </p>

        <a href="https://wa.me/5511976547465?text=Ol%C3%A1%2C%20gostaria%20de%20atendimento%20ou%20informa%C3%A7%C3%B5es%20sobre%20pedidos%20na%20Lum%C3%A9ri" target="_blank" rel="noopener noreferrer" class="lumeri-user-btn-whatsapp">
          <svg viewBox="0 0 24 24"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.21 8.21 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.19 8.19 0 0 1-1.26-4.37c0-4.54 3.7-8.24 8.25-8.24z"/></svg>
          <span>FALAR COM O CONCIERGE NO WHATSAPP</span>
        </a>

        <button type="button" class="lumeri-user-btn-back" id="lumeri-user-btn-back">
          Fechar e continuar navegando
        </button>
      </div>
    `;

    document.body.appendChild(overlay);
    userOverlay = overlay;

    document.getElementById('lumeri-user-modal-close').addEventListener('click', closeUserModal);
    document.getElementById('lumeri-user-btn-back').addEventListener('click', closeUserModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeUserModal();
    });
  }

  function openUserModal() {
    createUserModal();
    if (!userOverlay) return;
    userOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeUserModal() {
    if (!userOverlay) return;
    userOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Conecta os botões da barra de navegação com a lupa e com o usuário
  function bindTriggers() {
    // Procura todos os botões de busca do header ou links
    const searchSelectors = [
      'button[aria-label="Buscar"]',
      'a[aria-label="Buscar Perfumes"]',
      'button[aria-label="Buscar Perfumes"]',
      '#btn-search-trigger'
    ];

    document.querySelectorAll(searchSelectors.join(',')).forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
      });
    });

    // Procura todos os botões de usuário / minha conta do header
    const userSelectors = [
      'button[aria-label="Minha conta"]',
      'a[aria-label="Minha conta"]',
      'button[aria-label*="conta"]',
      'a[aria-label*="conta"]',
      'a[aria-label="Atendimento Concierge"]',
      '#btn-user-trigger'
    ];

    document.querySelectorAll(userSelectors.join(',')).forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openUserModal();
      });
    });

    // Fallback: Qualquer .tool-btn contendo data-lucide="user" ou svg.lucide-user
    document.querySelectorAll('.tool-btn').forEach((btn) => {
      const hasUser = btn.querySelector('[data-lucide="user"]') || btn.querySelector('svg.lucide-user');
      if (hasUser) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          openUserModal();
        });
      }
    });

    // Tecla de atalho: "/" ou "Ctrl+K" ou "Cmd+K" abre a busca; "Escape" fecha os modais
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeSearch();
        closeUserModal();
      } else if ((e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) && !isInputFocused()) {
        e.preventDefault();
        openSearch();
      }
    });
  }

  function isInputFocused() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable);
  }

  // Garante que os cards na página tenham os IDs padronizados
  function ensureCardIds() {
    const cards = document.querySelectorAll('article.card, .card');
    cards.forEach((card) => {
      if (!card.id || !card.id.startsWith('prod-')) {
        const title = card.querySelector('h3.t, h3, .t');
        const btn = card.querySelector('.btn-add');
        const name = (title ? title.textContent : '') || (btn ? btn.dataset.n : '');
        if (name) {
          card.id = 'prod-' + toSlug(name);
        }
      }
    });
  }

  // Inicialização
  function init() {
    bindTriggers();
    ensureCardIds();
    checkUrlHashForCard();

    window.addEventListener('hashchange', checkUrlHashForCard);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Exporta globalmente para debug ou uso programático se necessário
  window.LumeriSearch = {
    open: openSearch,
    close: closeSearch,
    openUserModal: openUserModal,
    closeUserModal: closeUserModal,
    catalog: CATALOG,
    toSlug: toSlug,
    spotlightCard: spotlightCard
  };
})();
