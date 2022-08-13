const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

// Search event from button
searchButton.addEventListener('click', () => searchMovies())

// Search event from keyboard enter
searchInput.addEventListener('keyup',  (e) => e.key === "Enter" && searchMovies())

// See details from button
const seeDetail = document.addEventListener('click', async function(e) {
    try {
        if(e.target.classList.contains('see-detail')){
            const imdbID = e.target.dataset.id
            const movieDetail = await getMovieDetail(imdbID)
            updateDetailUI(movieDetail)
        }
    } catch(err) {
        console.log(err)
        showAlert(err)
    } 
})

async function searchMovies(){
    try {
        const movies = await getMovies(searchInput.value)
        updateUI(movies)
    } catch(err) {
        console.log(err)
        showAlert(err)
    }
    //clear input value
    searchInput.value = ''
}

function showAlert(errorText) {
    const toastLiveExample = document.getElementById('liveToast')
    const toastBody = document.querySelector('.toast-body')
    const toast = new bootstrap.Toast(toastLiveExample)
    toastBody.innerText = errorText
    toast.show()
}

function getMovies(keyword){
    const movieList = document.getElementById('movie-list'); 
    return fetch('https://www.omdbapi.com/?apikey=aa676088&type=movie&s=' + keyword)
        .then(response => {
            if(!response.ok){
                throw new Error(response.statusText)
            }
            return response.json()
        })
        .then(response => {
            if(response.Response === 'False'){
                throw new Error(response.Error)
            }
            return response.Search
        })
}

function updateUI(movies) {
    let cards = ''
    movies.forEach(m => cards += showMovieList(m))
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = cards
}

function showMovieList(m) {
    return `<div class="col-md-4 col-lg-3">
        <div class="card mb-3">
            <img src="`+ m.Poster +`" class="card-img-top">
            <div class="card-body">
                <h5 class="card-title">`+ m.Title +`</h5>
                <h6 class="card-subtitle mb-2 text-muted">`+ m.Year +`</h6>
                <a href="#" class="card-link see-detail" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="`+ m.imdbID +`">See detail</a>
            </div>
        </div>
    </div>`   
}

function getMovieDetail(id) {
    return fetch('https://www.omdbapi.com/?apikey=aa676088&i=' + id)
        .then(response => {
            if(!response.ok){
                throw new Error(response.statusText)
            }
            return response.json()
        })
        .then(response => response)
}

function updateDetailUI(movies) {
    const movieDetail = showMovieDetail(movies)
    const modalDetail = document.querySelector('.movie-detail');
    modalDetail.innerHTML = movieDetail
}

function showMovieDetail(m) { 
    return `
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
                `+ m.Title +`
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4">
                        <img class="img-fluid" src="`+ m.Poster +`" class="card-img-top">
                    </div>
                    <div class="card-info col-md-8">
                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                            <strong> Year : </strong> `+ m.Year +`</li>
                            <li class="list-group-item">
                            <strong> Rated : </strong> `+ m.Rated +`</li>
                            <li class="list-group-item">
                            <strong> Director : </strong> `+ m.Director +`</li>
                            <li class="list-group-item">`+ m.Plot +`</li>
                            </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
    </div>
    `           
}

