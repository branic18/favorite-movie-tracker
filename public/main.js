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
        
        const movieId = element.closest('form').dataset.id; 
  
        fetch(`/profile/${movieId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                const movieItem = element.closest('li'); // Getting the list item containing the movie
                movieItem.remove();
            }
        })
        .catch(function(error) {
            console.error('Error deleting movie:', error);
        });
    });
});


//////// This is for displaying movie details

  document.addEventListener("DOMContentLoaded", function() {

    const movieItems = document.querySelectorAll('li[data-id]');
  
    const movieDetailsSection = document.getElementById('movieDetailsSection');
    const movieTitle = document.getElementById('movieTitle');
    const movieGenre = document.getElementById('movieGenre');
    const moviePlot = document.getElementById('moviePlot');
    const movieDuration = document.getElementById('movieDuration');
    const movieWhy = document.getElementById('movieWhy');
    
    movieItems.forEach(item => {
      item.addEventListener('click', function() {
    
        console.log("Clicked movie data:", item.dataset);
        
        // Getting the data from the clicked movie item
        const movieName = item.getAttribute('data-name');
        const movieGenreText = item.getAttribute('data-genre');
        const moviePlotText = item.getAttribute('data-plot');
        const movieDurationText = item.getAttribute('data-duration');
        const movieWhyText = item.getAttribute('data-why');
        
        // Logging the values to display so I know what's going to be displayed
        console.log("Movie name:", movieName);
        console.log("Movie genre:", movieGenreText);
        console.log("Movie plot:", moviePlotText);
        console.log("Movie duration:", movieDurationText);
        console.log("Movie why:", movieWhyText);

        // The data shouldn't be null or undefined
        if (movieName && movieGenreText && moviePlotText && movieDurationText && movieWhyText) {
          // Adding movie details to the browser
          movieTitle.textContent = movieName;
          movieGenre.textContent = "Genre: " + movieGenreText;
          moviePlot.textContent = "Plot: " + moviePlotText;
          movieDuration.textContent = "Duration: " + movieDurationText;
          movieWhy.textContent = "Why I love this movie: " + movieWhyText;

          // Show the movie details section
          movieDetailsSection.style.display = 'block';
        } else {
          console.error("Missing movie data.");
        }
      });
    });
  });


