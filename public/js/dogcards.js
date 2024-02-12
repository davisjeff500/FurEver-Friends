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

  // Function to toggle favorite status and move card
  function toggleFavoriteAndMoveCard(heartBtn, petCard) {
    heartBtn.classList.toggle('saved');
    const isSaved = heartBtn.classList.contains('saved');
    heartBtn.innerHTML = isSaved ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';

    if (isSaved) {
      savedPetsContainer.appendChild(petCard);
      savedPetsSection.style.display = 'block';
    } else {
      // If the pet is unsaved, move it back to the main carousel and hide the section if it's empty
      carouselContent.appendChild(petCard);
      if (savedPetsContainer.children.length === 0) {
        savedPetsSection.style.display = 'none';
      }
    }
  }

  // Event delegation for handling clicks within the carousel content area
  carouselContent.addEventListener('click', async (event) => {
    const target = event.target;
    const petCard = target.closest('.card');
    if (petCard) {
      const petName = petCard.dataset.name;
      const additionalInfoDiv = petCard.querySelector('.additional-info');

      if (target.matches('.heart-button, .heart-button *')) {
        if (savedPetsContainer) {
          toggleFavoriteAndMoveCard(target.closest('.heart-button'), petCard);
        }
      } else if (target.matches('.more-info')) {
      }
    }
  });

  // Call saved pets in case there are pets in there 
  if (savedPetsContainer) {
    updateSavedPetsDisplay();
  }
});