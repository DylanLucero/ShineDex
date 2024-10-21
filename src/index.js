document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('pokemon-info-modal');
    const closeButton = document.querySelector('.close-button');
    const searchInput = document.getElementById('search');
    const pokemonContainer = document.getElementById('pokemon-container');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const loadingSpinner = document.getElementById('loading-spinner');

    let pokedex = [];
    let shinyState = JSON.parse(localStorage.getItem('shinyState')) || {};

    // Load dark mode state from localStorage
    const darkModeState = JSON.parse(localStorage.getItem('darkModeState')) || false;
    if (darkModeState) {
        document.body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    loadingSpinner.style.display = 'block';

    // Toggle dark mode
    darkModeToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkModeState', JSON.stringify(darkModeToggle.checked));
    });

    // Fetch the pokedex data
    fetch('./assets/datasets/pokedex.json')
        .then(response => response.json())
        .then(data => {
            pokedex = data;

            // Display all Pokémon initially
            displayFilteredPokemon(pokedex);

            // Hide the loading spinner
            loadingSpinner.style.display = 'none';

            // Add scroll event listener to apply fade-in animation
            window.addEventListener('scroll', checkVisibility);
            checkVisibility(); // Initial check
        });

    // Function to display Pokémon information
// Function to display Pokémon information
function displayPokemonInfo(pokemon) {
    const infoContainer = document.getElementById('pokemon-info');
    infoContainer.innerHTML = `
        <h2>${pokemon.name.english}</h2>
        <img src="./assets/images/${pokemon.id.toString().padStart(3, '0')}.png" alt="${pokemon.name.english}">
        <img src="./assets/sprites/${pokemon.id.toString().padStart(3, '0')}.png" alt="${pokemon.id}">
        <p><strong>Japanese:</strong> ${pokemon.name.japanese}</p>
        <p><strong>Chinese:</strong> ${pokemon.name.chinese}</p>
        <p><strong>French:</strong> ${pokemon.name.french}</p>
        <p><strong>Type:</strong> ${pokemon.type.join(', ')}</p>
        <p><strong>Base Stats:</strong></p>
        <ul>
            <li>HP: ${pokemon.base.HP}</li>
            <li>Attack: ${pokemon.base.Attack}</li>
            <li>Defense: ${pokemon.base.Defense}</li>
            <li>Sp. Attack: ${pokemon.base["Sp. Attack"]}</li>
            <li>Sp. Defense: ${pokemon.base["Sp. Defense"]}</li>
            <li>Speed: ${pokemon.base.Speed}</li>
        </ul>
    `;
}

    // Close the modal when the close button is clicked
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Close the modal when clicking outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Add event listener to the search input
    searchInput.addEventListener('input', function() {
        const query = searchInput.value.toLowerCase();
        const filteredPokemon = pokedex.filter(pokemon => 
            pokemon.name.english.toLowerCase().includes(query) ||
            pokemon.name.japanese.toLowerCase().includes(query) ||
            pokemon.name.chinese.toLowerCase().includes(query) ||
            pokemon.name.french.toLowerCase().includes(query)
        );

        // Display the filtered Pokémon
        displayFilteredPokemon(filteredPokemon);
    });

    // Function to display filtered Pokémon
    function displayFilteredPokemon(pokemonList) {
        pokemonContainer.innerHTML = ''; // Clear existing Pokémon

        pokemonList.forEach(pokemon => {
            const pokemonCard = document.createElement('div');
            pokemonCard.classList.add('pokemon-card');

            const pokemonLink = document.createElement('a');
            pokemonLink.href = '#';
            pokemonLink.classList.add('pokemon-link');
            pokemonLink.setAttribute('data-id', pokemon.id);

            const pokemonImg = document.createElement('img');
            pokemonImg.classList.add('pokemon-img');
            pokemonImg.src = `./assets/thumbnails/${pokemon.id.toString().padStart(3, '0')}.png`;
            pokemonImg.alt = pokemon.name.english;

            const pokemonInfo = document.createElement('div');
            pokemonInfo.classList.add('pokemon-info');
            pokemonInfo.textContent = pokemon.name.english;

            const pokemonId = document.createElement('div');
            pokemonId.classList.add('pokemon-id');
            pokemonId.textContent = `No. ${pokemon.id}`;

            const shinyStar = document.createElement('span');
            shinyStar.classList.add('shiny-star');
            shinyStar.innerHTML = '&#9733;'; // Star character

            // Set shiny state from localStorage
            if (shinyState[pokemon.id]) {
                shinyStar.classList.remove('inactive');
            } else {
                shinyStar.classList.add('inactive');
            }

            shinyStar.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent triggering the link click
                shinyStar.classList.toggle('inactive');
                shinyState[pokemon.id] = !shinyState[pokemon.id];
                localStorage.setItem('shinyState', JSON.stringify(shinyState));
            });

            pokemonLink.appendChild(pokemonImg);
            pokemonLink.appendChild(pokemonInfo);
            pokemonCard.appendChild(pokemonId);
            pokemonCard.appendChild(pokemonLink);
            pokemonCard.appendChild(shinyStar);
            pokemonContainer.appendChild(pokemonCard);

            // Add event listener to the new Pokémon link
            pokemonLink.addEventListener('click', function(event) {
                event.preventDefault(); // Prevent default anchor behavior
                displayPokemonInfo(pokemon);
                modal.style.display = 'block';
            });
        });

        // Check visibility of new images
        checkVisibility(); // Initial check
    }

    // Function to check visibility of Pokémon images
    function checkVisibility() {
        const pokemonImages = document.querySelectorAll('.pokemon-img');
        pokemonImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                img.classList.add('visible');
            } else {
                img.classList.remove('visible');
            }
        });
    }
});