//Busca Dados de uma API publica da nasa.
async function fetchImages(query, maxResults = 15) {
    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erro ao buscar imagens da NASA');
    const data = await res.json();

    //filtra os resultados e exibe de acordo com a busca do usuario.
    const items = data.collection.items
        .filter(item => item.links && item.links.length > 0)
        .slice(0, maxResults);

        //busca descricao, imagem e titulo dos dados enviados pela nasa.
    return items.map(item => ({
        title: item.data[0].title,
        description: item.data[0].description,
        imageUrl: item.links[0].href
    }));
}

//um dicionario pra fazer com que o usuario possa digitar em portugues.
const dicionario = {
        "buraco negro": "black hole",
        "buracos negros": "black hole",
        "supernova": "supernova",
        "supernovas": "supernova",
        "meteoro": "meteor",
        "meteoros": "meteor",
        "nebulosa": "nebula",
        "nebulosas": "nebula",
        "galáxia": "galaxy",
        "galáxias": "galaxy",
        "estrela": "star",
        "estrelas": "star",
        "constelação": "constellation",
        "constelações": "constellation",
        "lua": "moon",
        "luas": "moon",
        "sol": "sun",
        "cometa": "comet",
        "cometas": "comet",
        "planeta": "planet",
        "planetas": "planet",
        "satélite natural": "natural satellite",
        "satélites naturais": "natural satellite",
        "sistema solar": "solar system",
      
        // Planetas
        "mercúrio": "mercury",
        "vênus": "venus",
        "terra": "earth",
        "marte": "mars",
        "júpiter": "jupiter",
        "saturno": "saturn",
        "urano": "uranus",
        "netuno": "neptune",
        "plutão": "pluto",
      
        // Outros corpos
        "asteroide": "asteroid",
        "asteroides": "asteroid",
        "cinturão de asteroides": "asteroid belt",
        "exoplaneta": "exoplanet",
        "exoplanetas": "exoplanet",
        "galáxia anã": "dwarf galaxy",
        "galáxias anãs": "dwarf galaxy",
        "planeta anão": "dwarf planet",
        "planetas anões": "dwarf planet",
      
        // Fenômenos
        "eclipse solar": "solar eclipse",
        "eclipse lunar": "lunar eclipse",
        "aurora boreal": "northern lights",
        "aurora austral": "southern lights",
        "translação": "revolution",
        "rotação": "rotation",
      
        // Telescópios e exploração
        "telescópio": "telescope",
        "telescópio espacial hubble": "hubble space telescope",
        "telescópio james webb": "james webb telescope",
        "sonda espacial": "space probe",
        "foguete": "rocket",
        "estação espacial internacional": "international space station",
      
        // Missões e veículos
        "apolo 11": "apollo 11",
        "perseverance": "perseverance",
        "curiosity": "curiosity",
        "voyager": "voyager",
        "cassini": "cassini"
};

//uma funçao pronta pra caso queira traduzir o site com API, porem é paga.
function traduzirLocalmente(termo) {
    return dicionario[termo.toLowerCase()] || termo;
}

//funcao que busca todos os dados prontos da API em json e transforma em HTML, e exibe na sua tela.
async function searchBuscas() {
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

//se o servidor da nasa nao enviar as imagens a tempo, mostra mensagem de erro.
    } catch (error) {
        gallery.innerHTML = `<p>Erro ao carregar imagens: ${error.message}</p>`;
        console.error(error);
    }

}

//Cria um evento que ao pressionar tecla enter chama a funcao de busca.
const inputSearch = document.getElementById('searchInput');

inputSearch.addEventListener('keydown', function(tecla){
    if (tecla.key === 'Enter') {
        search();
    }
})
