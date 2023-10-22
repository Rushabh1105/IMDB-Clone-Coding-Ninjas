const favContainer = document.querySelector('#movie-box');

var FavouriteMovies = JSON.parse(localStorage.getItem('FavouriteMovies'));
let idArray = JSON.parse(localStorage.getItem('idArray'));

console.log(FavouriteMovies)
// fetchMoviesToDisplay(FavouriteMovies);
// // displayMovieFavourite(movies);
// var movies = new Array(FavouriteMovies.length)
displayMovieFavourite(FavouriteMovies)

function displayMovieFavourite(movie) {
    let child = '';
    
    movie.forEach( (movie, idx) => {
        // console.log(mv)
        child += `<div class="movie">
                <div class="movie-poster">
                    <img src="${movie.Poster}" alt="poster">
                </div>

                <div class="movie-desc">
                    <h1>${movie.Title}</h1>
                    <p><b>Plot :</b> ${movie.Plot}</p>
                    <p><b>Language :</b>${movie.Language}</p>
                </div>

                <div class="delete-btn">
                    <button id="submit" onclick="deleteMovie(${idx})">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>`
    })

    favContainer.innerHTML = child;
}


function deleteMovie(idx){
    FavouriteMovies.splice(idx, 1);
    idArray.splice(idx, 1);
    localStorage.setItem('idArray', JSON.stringify(idArray) );
    localStorage.setItem('FavouriteMovies', JSON.stringify(FavouriteMovies) );
    displayMovieFavourite(FavouriteMovies)
}