document.addEventListener('DOMContentLoaded', () => {
  //Mock Dog Data for Example, can be changed/seeded from a library when that's up and running//
  const petsData = [
    {
      name: 'Buddy',
      age: '5 years',
      breed: 'Golden Retriever',
      description: 'Friendly and energetic, great with kids!',
      saved: false, // initial "saved" state
    },
    {
      name: 'Misty',
      age: '3 years',
      breed: 'Border Collie',
      description: 'Loves to play fetch and is very intelligent.',
      saved: false,
    },
    {
      name: 'Whiskers',
      age: '2 years',
      breed: 'Mix',
      description: 'Curious and playful, always up for an adventure.',
      saved: false,
    },
    {
      name: 'Wyoming',
      age: '9 years',
      breed: 'Cattle Dog',
      description: 'Hates sheep, loves people!',
      saved: false,
    },
  ];

  // Create an array that will hold pet name and associated breed
  const petBreed = [];
  // Loop through the petsData array and push the name and breed to the petBreed array
  petsData.forEach((pet) => {
    petBreed.push({ name: pet.name, breed: pet.breed });
  });

  //Creating Cards//

  // Select the carousel content div
  const carouselContent = document.querySelector('.carousel-content');
  carouselContent.innerHTML = ''; // Clear existing content

  // Function to create card
  function createCard(pet) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <header class="card-header">
          <p class="card-header-title">
            ${pet.name}
          </p>
          <button class="heart-button ${pet.saved ? 'saved' : ''}">
            <i class="far fa-heart"></i> <!-- Font Awesome Heart Icon -->
          </button>
        </header>
        <div class="card-image">
          <figure class="image is-4by3">
            <img src="path-to-your-image.jpg" alt="Pet image for ${pet.name}">
          </figure>
        </div>
        <div class="card-content">
          <div class="content">
            <strong>Age:</strong> ${pet.age}<br>
            <strong>Breed:</strong> ${pet.breed}<br>
            <strong>Description:</strong> ${pet.description}
          </div>
        </div>
      `;

    // Add event listener to heart button
    const heartBtn = card.querySelector('.heart-button');
    heartBtn.addEventListener('click', () => {
      pet.saved = !pet.saved; // Toggle the "saved" state
      heartBtn.classList.toggle('saved', pet.saved);
      heartBtn.innerHTML = pet.saved
        ? '<i class="fas fa-heart"></i>'
        : '<i class="far fa-heart"></i>';
    });

    return card;
  }

  petsData.forEach((pet) => {
    const petCard = createCard(pet);
    carouselContent.appendChild(petCard);
  });

  //carousel functionality//
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  const moreInfo = document.querySelector('.more-info'); // Evan's more info button
  // When the more info button is created, it needs an id that matches the dog's name and a class of more-info
  let currentIndex = 0;

  leftArrow.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel();
  });

  rightArrow.addEventListener('click', () => {
    currentIndex = Math.min(
      currentIndex + 1,
      carouselContent.children.length - 1
    );
    updateCarousel();
  });

  // Evan's more info button event listener
  moreInfo.addEventListener('click', () => {
    const dogName = event.target.id; // Gets the name of the specific dog
    // Gets the breed of the specific dog
    const breed = () => {
      for (let i = 0; i < petBreed.length; i++) {
        if (petBreed[i].name === dogName) {
          return petBreed[i].breed;
        }
      }
    };
    url = 'http://localhost:3001/api/dogInfo/'; // This is the route that will be created in the backend

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(breed),
    }).then((response) => {
      // Parse the response
      const breedInfo = {
        weight: response.weight,
        height: response.height,
        life_span: response.life_span,
        temperament: response.temperament,
      };

      // Create a drop down with breed info
      const breedInfoDiv = document.createElement('div');
      breedInfoDiv.className = 'breed-info';
      breedInfoDiv.innerHTML = `
        <div class="breed-info-content">
          <div class="breed-info-content">
            <strong>Average Weight:</strong> ${breedInfo.weight}<br>
            <strong>Average Height:</strong> ${breedInfo.height}<br>
            <strong>Typical Life Span:</strong> ${breedInfo.life_span}<br>
            <strong>Temperament:</strong> ${breedInfo.temperament}
          </div>
        </div>
      `;
    });
  });

  function updateCarousel() {
    const cardWidth = document.querySelector('.card').offsetWidth;
    const newTransform = currentIndex * -(cardWidth + 20);
    carouselContent.style.transform = `translateX(${newTransform}px)`;

    // Update classes for centered card
    document
      .querySelectorAll('.carousel-content .card')
      .forEach((card, index) => {
        if (index === currentIndex) {
          card.classList.add('is-centered');
        } else {
          card.classList.remove('is-centered');
        }
      });
  }

  updateCarousel();
});
