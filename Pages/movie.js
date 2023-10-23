let movieID = localStorage.getItem('movieID');//Get the movieID from the localStorage
const movieContainer = document.querySelector('.movie-detail');//get the movieContainer from the document

// Get Favourites movies from the local storage
if(!JSON.parse(localStorage.getItem('FavouriteMovies'))){
    let FavouriteMovies = [];
    localStorage.setItem('FavouriteMovies', JSON.stringify(FavouriteMovies) );
}
// Get the list of id's for the favourite movies list
if(!JSON.parse(localStorage.getItem('idArray'))){
    let idArray = [];
    localStorage.setItem('idArray', JSON.stringify(idArray) );
}

var FavouriteMovies = JSON.parse(localStorage.getItem('FavouriteMovies'));
let idArray = JSON.parse(localStorage.getItem('idArray'));
//  Fetch the data from OMDB api using API key
async function getMovie(movieID){
    const url = `https://www.omdbapi.com/?i=${movieID}&apikey=b2b1bcd6`;
    const response = await fetch(url);
    const data = await response.json();

    // Display the button content according to the data
    let msg = 'Add to favorites';
    if(idArray.includes(movieID)){
        msg = 'Added to favorites';
    }else{
        msg = 'Add to favorites';
    }
    // Display the movie details page
    if(data){
        await displayMovie(data, msg)
    }
}

let movieDetails;

if(movieID){
    getMovie(movieID)
}

//  Add the movie to the html document
const displayMovie = async (mv, msg) => {
    const movie = `
                    <div class="movie-container">
                        <div class="movie-poster">
                            <img src="${mv.Poster}" alt="poster">
                        </div>

                        <div class="movie-desc">
                            <h1>${mv.Title}</h1>
                            <div class="info">
                                <span><b>Relese :</b> ${mv.Released}</span>
                                <span class="rating"><b>Rating: ${mv.Rated}</b></span>
                                <span>Runtime: ${mv.Runtime}</span>
                            </div>

                            <div class="persons">
                                <p><b>Director:</b> ${mv.Director}</p>
                                <p><b>Writer:</b> ${mv.Writer}</p>
                                <p><b>Actors:</b> ${mv.Actors}</p>
                                <span><b>Genre:</b> ${mv.Genre}</span>
                            </div>

                            <div class="plot">
                                <p>
                                    <b>Plot:</b> ${mv.Plot}
                                </p>
                            </div>

                            <div class="other-info">
                                <p><b>Language:</b> ${mv.Language}</p>
                                <p><b>Country:</b> ${mv.Country}</p>
                                <p><b>Awords:</b> ${mv.Awards}</p>
                                <p><b>IMDB Rating:</b> ${mv.imdbRating}</p>
                                <p><b>Box Office:</b> ${mv.BoxOffice}</p>
                            </div>
                        </div>    
                    </div> 
                    
                    <div class="btn">
                        <button id="${mv.imdbID}" onclick="addToFav(${mv.imdbID})" >${msg}</button>
                    </div>
                `

    movieContainer.innerHTML = movie;
}

// Function for adding and removing movie from favorites movies list
async function addToFav(mv){
    const response = await fetch(`https://www.omdbapi.com/?i=${mv.id}&apikey=b2b1bcd6`);
    const data = await response.json();
    let FavouriteMovies = JSON.parse(localStorage.getItem('FavouriteMovies'));
    let idArray = JSON.parse(localStorage.getItem('idArray'));
    let flag = true;
    // Remove from favourites list
    FavouriteMovies.forEach((movie) => {
        // Update the button text according to the favourite movie list
        if(movie.imdbID === mv.id){
            alert('Already added to favorites');
            flag = false;
            displayMovie(movie, 'Added to favorites');
        }
        
    })
    // Add to the favorites list
    if(flag == true){
        FavouriteMovies.push(data);
        idArray.push(movieID);
        localStorage.setItem('FavouriteMovies', JSON.stringify(FavouriteMovies) );
        localStorage.setItem('idArray', JSON.stringify(idArray))
        alert('added to favorites list')
        displayMovie(data, 'Added to favorites list')
    }
}