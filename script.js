const searchInput = document.querySelector('.search-input input'); //Get the value of the search
const searchList = document.querySelector('#search-list'); //Append the search list to the search input
const movies = document.querySelector('.movies'); //Append the movies to the movie cards to display to user
const addToFavorites = document.querySelector('.add-favourite');//To add movie to favorites list

let searchResults = JSON.parse(localStorage.getItem('searchResults'));


// Local Storage for Favourite Movies List
if(!JSON.parse(localStorage.getItem('FavouriteMovies'))){
    let FavouriteMovies = [];
    localStorage.setItem('FavouriteMovies', JSON.stringify(FavouriteMovies) );
}

// Local Storage for Movies id to give some additional functionalities
if(!JSON.parse(localStorage.getItem('idArray'))){
    let idArray = [];
    localStorage.setItem('idArray', JSON.stringify(idArray) );
}

if(!JSON.parse(localStorage.getItem('searchResults'))){
    let searchResults = [];
    localStorage.setItem('searchResults', JSON.stringify(searchResults) );
}

// Fetch the movies from the database of OMDB using api key
async function fetchMovies(searchInput){
    const url = `https://www.omdbapi.com/?s=${searchInput}&apikey=b2b1bcd6`;
    const response = await fetch(url);

    const data = await response.json();
    return data || [];
}

// Temporarily storage for storing results to give some additional features 
let movieData = [];
if (searchResults && searchResults.length > 0) {
    movieData = searchResults;
    showCards(searchResults);
}
// Function for getting input from user and display data accordingly
searchInput.addEventListener( 'keyup', async (e) => {
    let movie = searchInput.value.trim();
    // let searchResults = JSON.parse(localStorage.getItem('searchResults'));

    // Show suggested movies to the user
    if(movie.length > 2){
        searchList.classList.remove('hide-list'); // Show the suggestion list
        let data = await fetchMovies(movie);//Get Data from API
        // console.log(data);
        if(data.Response === 'True'){ // Show the suggestion list
            movieData = data.Search;
            showList(movieData);
        }else{
            searchList.classList.add('hide-list') // hide the suggestion list
        }
    }else{
        searchList.classList.add('hide-list')
    }

    // Show all the related search movies to the user
    if(e.key == 'Enter' && movie ){
        searchList.classList.add('hide-list')
        let data = await fetchMovies(movie);//Get Data from API
        // 
        if(data.Response === 'True' && data){ //Display result in the form of cards to the user
            movieData = data.Search;
            searchResults = data.Search;
            showCards(movieData);
            localStorage.setItem('searchResults', JSON.stringify(searchResults) );
        }else{
            let list = "<h1>No Movie Found</h1>";
            movies.innerHTML = list;
        }
        searchInput.value = '';
    }
})

// Function for showing the suggested list of movies
function showList(data){
    let list = "";

     data.forEach((mv, idx) => {
        let id = JSON.stringify(mv.imdbID);
        list += `
                <div class="search-list-item" id="${mv.imdbID}" onclick="viewMovie(${this.imdbID, idx})">
                    <div class="search-logo">
                        <img  src="${mv.Poster}" />
                    </div>      
                    <div class="search-item-info" >
                        <h3 >${mv.Title}</h3>
                    </div>
                </div>      
        `
    });
    // viewMovie();
    searchList.innerHTML = list; //Append to the suggestion list
}

// Functions to display search results to the user
async function showCards(data){
    let list = "";
    let idArray = JSON.parse(localStorage.getItem('idArray'));
    let msg = '';
    await data.forEach( (mv, idx) => {
        if( idArray.includes(mv.imdbID)){
            msg = 'Already added to favorites';
        }else{
            msg = 'Add to favorites';
        }

        list += `
                <div class="card" key="${mv.id}">
                    <div class="movie-poster">
                        <img src="${mv.Poster}" alt="">
                    </div>
                    <hr/>
                    <div class="movie-header">
                        <h3>${mv.Title}</h3>
                    </div>
                    <div class="movie-desc">
                        <p>${mv.Year}</p>
                        <p>Type: ${mv.Type}</p>
                    </div>
                    <hr/>
                    <div class="btns">
                        <button class="view" onclick="viewMovie(${this.imdbID, idx})" > More Detaile </button>
                        <button class="add-favourite" onclick="addToFav(${this.imdbID, idx})" > <span>${msg}</span></button>
                    </div>
                </div>
        `
    });
    movies.innerHTML = list; //Append to the result list
}

// This function shows the movie details page
function viewMovie(mv){
    console.log(mv);
    let id = movieData[mv].imdbID;
    console.log(id);
    searchInput.value = '';
    searchList.classList.add('hide-list');
    localStorage.setItem('movieID', id ); // set the movie id in localStorage
    window.location.href = './Pages/movie.html';
}

// Hide search results if user clicks somewhere in the screen
window.addEventListener( "click", (e) => {
    searchList.classList.add('hide-list');
});

async function getMovieDetails(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=b2b1bcd6`);
    const data = await response.json();
    if(data.Response === 'True'){
        return data
    }else{
        return null;
    }
}


// Function to add movie to favourites list
async function addToFav(mv, idx){
    let id = movieData[mv].imdbID
    let data = await getMovieDetails(id);
    let FavouriteMovies = JSON.parse(localStorage.getItem('FavouriteMovies')); //Get Favourite Movies list from local storage
    let idArray = JSON.parse(localStorage.getItem('idArray'));
    
    let flag = true;
    FavouriteMovies.forEach((movie) => {
        // Update the button text according to the favourite movie list
        if(movie.imdbID === id){
            alert('Already added to favorites');
            flag = false;
            data = movie;
            showCards(movieData);
        }
        
    })
    // If not present in favorites the add to favorites
    if(flag == true && data){
        FavouriteMovies.push(data);
        idArray.push(data.imdbID);
        localStorage.setItem('FavouriteMovies', JSON.stringify(FavouriteMovies) );
        localStorage.setItem('idArray', JSON.stringify(idArray) );
        alert('added to favorites list');
        showCards(movieData);
    }
}
