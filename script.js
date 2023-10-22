const searchInput = document.querySelector('.search-input input');
const searchList = document.querySelector('#search-list');
const movies = document.querySelector('.movies');
const addToFavorites = document.querySelector('.add-favourite');


if(!JSON.parse(localStorage.getItem('FavouriteMovies'))){
    let FavouriteMovies = [];
    localStorage.setItem('FavouriteMovies', JSON.stringify(FavouriteMovies) );
}

if(!JSON.parse(localStorage.getItem('idArray'))){
    let idArray = [];
    localStorage.setItem('idArray', JSON.stringify(idArray) );
}

async function fetchMovies(searchInput){
    const url = `http://www.omdbapi.com/?s=${searchInput}&apikey=b2b1bcd6`;
    const response = await fetch(url);

    const data = await response.json();
    return data;
}

let movieData = [];
searchInput.addEventListener( 'keyup', async (e) => {
    let movie = searchInput.value.trim();
    let FavouriteMovies = JSON.parse(localStorage.getItem('FavouriteMovies'));


    if(movie.length > 2){
        searchList.classList.remove('hide-list');
        let data = await fetchMovies(movie);
        temp = data;
        // console.log(data);
        if(data.Response === 'True'){
            await showList(data.Search);
            movieData = data.Search;
        }else{
            searchList.classList.add('hide-list')
        }
    }else{
        searchList.classList.add('hide-list')
    }

    if(e.key == 'Enter' && movie ){
        searchList.classList.add('hide-list')
        let data = await fetchMovies(movie);
        // 
        temp = data;
        if(data.Response === 'True'){
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
    searchList.innerHTML = list;
}


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
    movies.innerHTML = list;
}


function viewMovie(mv){
    searchInput.value = '';
    searchList.classList.add('hide-list');
    localStorage.setItem('movieID', mv.id);
    window.location.href = './Pages/movie.html';
}

window.addEventListener( "click", (e) => {
    searchList.classList.add('hide-list');
});


async function addToFav(mv){
    const response = await fetch(`http://www.omdbapi.com/?i=${mv.id}&apikey=b2b1bcd6`);
    const data = await response.json();
    let FavouriteMovies = JSON.parse(localStorage.getItem('FavouriteMovies'));
    let idArray = JSON.parse(localStorage.getItem('idArray'));

    let flag = true;
    FavouriteMovies.forEach((movie) => {
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
    if(flag == true){
        const response = await fetch(`http://www.omdbapi.com/?i=${mv.id}&apikey=b2b1bcd6`);
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