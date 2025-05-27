async function fetchImages(query, maxResults = 20) {
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao buscar imagens da NASA');
    const data = await res.json();

    const items = data.collection.items
        .filter(item => item.links && item.links.length > 0)
        .slice(0, maxResults);

    return items.map(item => ({
        title: item.data[0].title,
        description: item.data[0].description,
        imageUrl: item.links[0].href
    }));
}

const dicionario = {
    "buraco negro": "black hole",
    "supernova": "supernova",
    "meteoro": "meteor",
    "nebulosa": "nebula",
    "galáxia": "galaxy",
    "estrela": "star",
    "lua": "moon",
    "planeta": "planet",
    "cometa": "comet"
};

function traduzirLocalmente(termo) {
    return dicionario[termo.toLowerCase()] || termo;
}

async function traduzirLibre(texto) {
    const response = await fetch('http://localhost:3000/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            q: texto,
            source: 'en',
            target: 'pt',
            format: 'text'
        })
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
    }

    const data = await response.json();
    return data.translatedText;
}

async function search() {
    const termo = document.getElementById('searchInput').value.trim();
    const query = traduzirLocalmente(termo);

    const gallery = document.getElementById('gallery');
    if (!query) {
        gallery.innerHTML = '<p>Por favor, digite um termo para buscar.</p>';
        return;
    }

    gallery.innerHTML = '<p>Carregando imagens...</p>';

    try {
        const images = await fetchImages(query);
        if (images.length === 0) {
            gallery.innerHTML = `<p>Nenhuma imagem encontrada para "<strong>${query}</strong>".</p>`;
            return;
        }

        gallery.innerHTML = ''; // limpa galeria

        for (const item of images) {
    const div = document.createElement('div');
    div.className = 'image-item';

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.title;

    const p = document.createElement('p');
    let descricao = item.description ? item.description.substring(0, 500) : '';
    let descTraduzida = '';

    if (descricao) {
        try {
            descTraduzida = await traduzirLibre(descricao);
        } catch (e) {
            console.error('Erro ao traduzir:', descricao, e);
            descTraduzida = descricao; // mostra o original se falhar
        }
    }

    p.innerHTML = `<strong>${item.title}</strong><br>${descTraduzida}`;

    div.appendChild(img);
    div.appendChild(p);
    gallery.appendChild(div);
}


    } catch (error) {
        gallery.innerHTML = `<p>Erro ao carregar imagens: ${error.message}</p>`;
        console.error(error);
    }

}

