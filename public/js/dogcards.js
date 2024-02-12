document.addEventListener('DOMContentLoaded', () => {
  const carouselContent = document.querySelector('.carousel-content');
  const savedPetsContainer = document.getElementById('saved-pets-container');
  const savedPetsSection = document.getElementById('saved-pets-section');

  // Function to update the display of the saved pets section
  function updateSavedPetsDisplay() {
    if (savedPetsSection && savedPetsContainer) {
      savedPetsSection.style.display = savedPetsContainer.children.length > 0 ? 'block' : 'none';
    }
  }


  moreInfoButtons = document.querySelectorAll('.more-info');

  moreInfoButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const name = e.target.getAttribute('data-name');
      const additionalInfo = document.getElementById(`additional-info-${name}`);
      additionalInfo.classList.toggle('is-hidden');
      // Toggle button text
      e.target.textContent = e.target.textContent === 'More Info' ? 'Less Info' : 'More Info';
    });
  });

  // For the carousel arrows
document.querySelector('.left-arrow').addEventListener('click', () => {
  // Scroll the carousel to the left
  carouselContent.scrollBy({ left: -carouselContent.offsetWidth, behavior: 'smooth' });
});

document.querySelector('.right-arrow').addEventListener('click', () => {
  // Scroll the carousel to the right
  carouselContent.scrollBy({ left: carouselContent.offsetWidth, behavior: 'smooth' });
});

  // Function to toggle favorite status and move card
  function toggleFavoriteAndMoveCard(heartBtn, petCard) {
    heartBtn.classList.toggle('saved');
    const isSaved = heartBtn.classList.contains('saved');
    heartBtn.innerHTML = isSaved ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';

    if (isSaved) {
      savedPetsContainer.appendChild(petCard);
      savedPetsSection.style.display = 'block';
    } else {
      carouselContent.appendChild(petCard);
      if (savedPetsContainer.children.length === 0) {
        savedPetsSection.style.display = 'none';
      }
    }
    updateSavedPetsDisplay();
  }

  // Event delegation for the carousel content area
  carouselContent.addEventListener('click', (event) => {
    const target = event.target;
    const petCard = target.closest('.card');
    if (petCard) {
      if (target.matches('.heart-button, .heart-button *')) {
        toggleFavoriteAndMoveCard(target.closest('.heart-button'), petCard);
      }
    }
  });

  // Initial call to update the display of the saved pets section
  updateSavedPetsDisplay();
});