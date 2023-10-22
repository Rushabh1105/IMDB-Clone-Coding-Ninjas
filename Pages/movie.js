let movieID = localStorage.getItem('movieID');
const movieContainer = document.querySelector('.movie-detail');

if(!JSON.parse(localStorage.getItem('FavouriteMovies'))){
    let FavouriteMovies = [];
    localStorage.setItem('FavouriteMovies', JSON.stringify(FavouriteMovies) );
}

if(!JSON.parse(localStorage.getItem('idArray'))){
    let idArray = [];
    localStorage.setItem('idArray', JSON.stringify(idArray) );
}

var FavouriteMovies = JSON.parse(localStorage.getItem('FavouriteMovies'));
let idArray = JSON.parse(localStorage.getItem('idArray'));

async function getMovie(movieID){
    const url = `http://www.omdbapi.com/?i=${movieID}&apikey=b2b1bcd6`;
    const response = await fetch(url);
    const data = await response.json();
    // displayMovie.push(data);

    // console.log(data);
    let msg = '';
    if(idArray.includes(movieID)){
        msg = 'Remove from favorites';
    }else{
        msg = 'Add to favorites';
    }
    if(data){
        await displayMovie(data, msg)
    }
}

let movieDetails;

if(movieID){
    getMovie(movieID)
}


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


async function addToFav(mv){
    const response = await fetch(`http://www.omdbapi.com/?i=${mv.id}&apikey=b2b1bcd6`);
    const data = await response.json();
    let FavouriteMovies = JSON.parse(localStorage.getItem('FavouriteMovies'));
    let flag = true;
    FavouriteMovies.forEach((movie) => {
        if(movie.imdbID === mv.id){
            FavouriteMovies.splice(movie, 1);
            idArray.splice(mv.id, 1);
            localStorage.setItem('FavouriteMovies', JSON.stringify(FavouriteMovies) );
            localStorage.setItem('idArray', JSON.stringify(idArray))
            alert('removed from favorites');
            flag = false;
            displayMovie(movie, 'Add to favorites');
        }
        
    })
    if(flag){
        FavouriteMovies.push(data);
        idArray.push(movieID);
        localStorage.setItem('FavouriteMovies', JSON.stringify(FavouriteMovies) );
        localStorage.setItem('idArray', JSON.stringify(idArray))
        alert('added to favorites list')
        getMovie(movieID)
    }
}