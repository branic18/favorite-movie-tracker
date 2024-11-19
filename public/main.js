var trash = document.querySelectorAll(".fa-trash-o");
var thumbIcons = document.querySelectorAll(".fa-thumbs-up, .fa-thumbs-down");


Array.from(thumbIcons).forEach(function(element) {
    element.addEventListener('click', function() {

        const movieId = this.closest('form').getAttribute('data-id');

        const thumbUpCountElement = this.closest('.movie').querySelector('.thumbUp');
        let currentThumbUpCount = parseInt(thumbUpCountElement.innerText) || 0;  // Default to 0 if empty

        console.log('movieId:', movieId);
        console.log('currentThumbUpCount:', currentThumbUpCount);

  
        if (this.classList.contains('fa-thumbs-up')) {
            currentThumbUpCount += 1; 

        } else if (this.classList.contains('fa-thumbs-down')) {
            currentThumbUpCount -= 1; 
        }


        console.log('Updated thumbUp count:', currentThumbUpCount);

        fetch(`/profile/${movieId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                thumbUp: currentThumbUpCount  // Only update thumbUp
            })
        })
        .then(response => response.json())  
        .then(data => {
            console.log('Updated movie data:', data);  
            thumbUpCountElement.innerText = currentThumbUpCount;
        })
        .catch(error => console.error('Error updating thumb count:', error));  
    });
});





Array.from(trash).forEach(function(element) {
    element.addEventListener('click', function() {
        // Get the movie's _id (usually it should be stored in a data attribute on the form or an element)
        const movieId = element.closest('form').dataset.id;  // Assuming the _id is stored in a form's data-id attribute
        
        // Send a DELETE request to delete the movie
        fetch(`/profile/${movieId}`, {
            method: 'DELETE', // DELETE method to delete the resource
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            // On successful deletion, remove the movie from the DOM (without reloading the page)
            if (response.ok) {
                const movieItem = element.closest('li'); // Get the list item containing the movie
                movieItem.remove(); // Remove it from the list
            }
        })
        .catch(function(error) {
            console.error('Error deleting movie:', error);
        });
    });
});


// This is for displaying movie detail
document.addEventListener('DOMContentLoaded', function() {

  const movieItems = document.querySelectorAll('.movie');  // Select all the '.movie' list items

  const movieDetailsSection = document.getElementById('movieDetails');
  if (!movieDetailsSection) {
    console.error('movieDetailsSection element not found in DOM');
    return;
  }

  movieItems.forEach(item => {
      item.addEventListener('click', function() {
          const movieId = this.dataset.id;

          fetch(`/movies/${movieId}`)
              .then(response => response.json())
              .then(movie => {
                console.log('Fetched movie:', movie);

                if (!movie) {
                  console.log('Movie data not found');
                  return;
                }

                  document.getElementById('movieTitle').innerText = `Title: ${movie.movieName}`;
                  document.getElementById('movieGenre').innerHTML = `Genre: ${movie.genre}`;
                  document.getElementById('movieDescription').textContent = `Description: ${movie.description}`;
                  document.getElementById('movieReleaseDate').textContent = `Release Date: ${movie.releaseDate}`;
                  document.getElementById('movieRating').textContent = `Rating: ${movie.rating}`;

                  movieDetailsSection.style.display = 'block';  // Makes this section visible
              })
              .catch(err => console.log('Error fetching movie details:', err));
      });
  });
});


