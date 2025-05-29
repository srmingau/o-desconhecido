const menu = document.getElementById('menulateral');
const h2menu = document.querySelectorAll('.h2menu');
const valorInput = document.getElementById('searchInput');

h2menu.forEach(h2 => {
    h2.addEventListener('click', function() {
        valorInput.value = h2.textContent.toLocaleLowerCase();
        searchBuscas(h2menu);
    });
});