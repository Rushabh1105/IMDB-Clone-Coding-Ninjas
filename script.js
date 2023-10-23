const searchInput = document.querySelector('.search-input input'); //Get the value of the search
const searchList = document.querySelector('#search-list'); //Append the search list to the search input
const movies = document.querySelector('.movies'); //Append the movies to the movie cards to display to user
const addToFavorites = document.querySelector('.add-favourite');//To add movie to favorites list


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

// Fetch the movies from the database of OMDB using api key
async function fetchMovies(searchInput){
    const url = `https://www.omdbapi.com/?s=${searchInput}&apikey=b2b1bcd6`;
    const response = await fetch(url);

    const data = await response.json();
    return data;
}

// Temporarily storage for storing results to give some additional features 
let movieData = [];

// Function for getting input from user and display data accordingly
searchInput.addEventListener( 'keyup', async (e) => {
    let movie = searchInput.value.trim();
    let FavouriteMovies = JSON.parse(localStorage.getItem('FavouriteMovies'));

    // Show suggested movies to the user
    if(movie.length > 2){
        searchList.classList.remove('hide-list'); // Show the suggestion list
        let data = await fetchMovies(movie);//Get Data from API
        temp = data;
        // console.log(data);
        if(data.Response === 'True'){ // Show the suggestion list
            await showList(data.Search);
            movieData = data.Search;
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
        temp = data;
        if(data.Response === 'True'){ //Display result in the form of cards to the user
            console.log(data)
            showCards(data.Search);
            movieData = data.Search;
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
                <div class="search-list-item" id="${mv.imdbID}" onclick="viewMovie(${mv.imdbID})">
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
            msg = 'Remove from favorites';
        }else{
            msg = 'Add to favorites';
        }
        list += `
                <div class="card">
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
                        <button class="view" onclick="viewMovie(${mv.imdbID})" > More Detaile </button>
                        <button class="add-favourite" onclick="addToFav(${mv.imdbID})" > <span>${msg}</span></button>
                    </div>
                </div>
        `
    });
    movies.innerHTML = list; //Append to the result list
}

// This function shows the movie details page
function viewMovie(mv){
    searchInput.value = '';
    searchList.classList.add('hide-list');
    localStorage.setItem('movieID', mv.id); // set the movie id in localStorage
    window.location.href = './Pages/movie.html';
}

// Hide search results if user clicks somewhere in the screen
window.addEventListener( "click", (e) => {
    searchList.classList.add('hide-list');
});

// Function to add movie to favourites list
async function addToFav(mv){
    const response = await fetch(`https://www.omdbapi.com/?i=${mv.id}&apikey=b2b1bcd6`);
    const data = await response.json();
    let FavouriteMovies = JSON.parse(localStorage.getItem('FavouriteMovies')); //Get Favourite Movies list from local storage
    let idArray = JSON.parse(localStorage.getItem('idArray'));

    let flag = true;
    FavouriteMovies.forEach((movie) => {
        // Update the button text according to the favourite movie list
        if(movie.imdbID === mv.id){
            console.log('here')
            FavouriteMovies.splice(movie, 1);
            idArray.splice(mv.id, 1);
            localStorage.setItem('FavouriteMovies', JSON.stringify(FavouriteMovies) );
            localStorage.setItem('idArray', JSON.stringify(idArray) );
            alert('removed from favorites');
            flag = false;
            console.log(movieData)
            showCards(movieData);
        }
        
    })
    // If not present in favorites the add to favorites
    if(flag == true){
        const response = await fetch(`https://www.omdbapi.com/?i=${mv.id}&apikey=b2b1bcd6`);
        const data = await response.json();
        FavouriteMovies.push(data);
        idArray.push(mv.id);
        localStorage.setItem('FavouriteMovies', JSON.stringify(FavouriteMovies) );
        localStorage.setItem('idArray', JSON.stringify(idArray) );
        alert('added to favorites list');
        showCards(movieData,);
    }
}

showCards(movieData);