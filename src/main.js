import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const searchForm = document.querySelector('.search-form');
const imageList = document.querySelector('.gallery');
const nextBtn = document.querySelector('.next-btn');
const loader = document.querySelector('.loader');
    
let currentPage = 0;
let searchValue = '';
    
const gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

searchForm.addEventListener('submit', handleSearch);
nextBtn.addEventListener('click', nextPage);
  
async function handleSearch(event) {
    event.preventDefault();
    searchValue = event.currentTarget.elements.query.value.trim();
    currentPage = 1;
    showLoader();     
    nextBtn.classList.add('is-hidden');
    imageList.innerHTML = '';
if (!searchValue) {
iziToast.show({
    title: '❕',
    theme: 'light',
    message: `Please, fill in the search field`,
    messageSize: '20px',
    messageColor: '#808080',
    backgroundColor: '#e7fc44',
    position: 'topLeft',
    timeout: 3000,
});
    return;
}
try {
    const response = await fetchImages(searchValue, currentPage);
if (response.hits.length === 0) {
iziToast.show({
    message:
     'Sorry, there are no images matching your search query. Please try again!',
    messageSize: '16px',
    messageColor: 'white',
    backgroundColor: '#EF4040',
    position: 'topRight',
    timeout: 5000,
});
searchForm.reset();
    return;
}
imageList.insertAdjacentHTML('beforeend', createMarkup(response.hits));
gallery.refresh();
            
if (response.hits.length >= 40) {
    nextBtn.classList.remove('is-hidden');
}  else {
iziToast.show({
    title: '❕',
    theme: 'dark',
    message: "We're sorry, but you've reached the end of search results.",
    messageSize: '16px',
    messageColor: 'white',
    backgroundColor: '#4e75ff',
    position: 'topRight',
    timeout: 5000,
});
  }
  searchForm.reset();
} catch (err) {
    handleError(err);
} finally {
    hideLoader();
}
}

async function fetchImages(query, page) {
    const BASE_URL = 'https://pixabay.com/api/';
    const KEY = '41927866-cfb01af7ede59fae11104cea9';

const res = await axios.get(BASE_URL, {
    params: {
        key: KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        per_page: 40,
        page: page,
    },
});
      
    return res.data;
}

function createMarkup(hits) {
return hits
    .map(
    ({
        comments,
        downloads,
        largeImageURL,
        likes,
        webformatURL,
        tags,
        views,
    }) =>
    `<li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}">
            <ul class="gallery-description">
              <li class="gallery-description-item">Likes: <span class="discrp-item">${likes}</span> </li>
              <li class="gallery-description-item">Views: <span class="discrp-item">${views}</span></li>
              <li class="gallery-description-item">Downloads: <span class="discrp-item">${downloads}</span></li>
              <li class="gallery-description-item">Comments: <span class="discrp-item">${comments}</span></li>
            </ul>
        </a>
    </li>`
    )
    .join('');
  }

function handleError(err) {
console.error(err);
imageList.innerHTML = '';
iziToast.show({
    // iconUrl: icon,
    theme: 'dark',
    message: err.stack,
    messageSize: '16px',
    messageColor: 'white',
    backgroundColor: '#EF4040',
    position: 'topRight',
    timeout: 5000,
});
    nextBtn.removeEventListener('click', nextPage);
    nextBtn.classList.add('is-hidden');
}
    
async function nextPage() {
    loader.classList.remove('is-hidden');
    nextBtn.classList.add('is-hidden');
    currentPage += 1;
    showLoader();    
try {
    const res = await fetchImages(searchValue, currentPage);
if (currentPage * 40 >= res.totalHits) {
iziToast.show({
    title: '❕',
    theme: 'dark',
    message: "We're sorry, but you've reached the end of search results.",
    messageSize: '16px',
    messageColor: 'white',
    backgroundColor: '#4e75ff',
    position: 'topRight',
    timeout: 5000,
});

if (res.hits.length > 0) {
    imageList.insertAdjacentHTML('beforeend', createMarkup(res.hits));
    gallery.refresh();
    nextBtn.classList.add('is-hidden');
    scrollBy();
    return;
}
} else {
    imageList.insertAdjacentHTML('beforeend', createMarkup(res.hits));
    gallery.refresh();
    scrollBy();
    nextBtn.classList.remove('is-hidden');
}
} catch (err) {
    handleError(err);
} finally {
    hideLoader();
    loader.classList.add('is-hidden');
    }
}
function hideLoader() {
    setTimeout(() => {
    loader.style.display = 'none';
  }, 500);
}

function showLoader() {
  loader.style.display = 'block';
}
function scrollBy() {
  window.scrollBy({
    top: 640,
    behavior: 'smooth',
  });
}