import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { showMessage } from './functions/showMessage';
import { createMarkup } from './functions/createMarkup';
import { refs } from './js/refs';
import { handleError } from './functions/handleError';

    
let currentPage = 0;
let searchValue = '';
    
const gallery = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
});

refs.searchForm.addEventListener('submit', handleSearch);
refs.nextBtn.addEventListener('click', nextPage);
  
async function handleSearch(event) {
    event.preventDefault();
    searchValue = event.currentTarget.elements.query.value.trim();
    currentPage = 1;    
    refs.nextBtn.classList.add('is-hidden');
    refs.imageList.innerHTML = '';
    showLoader(); 
    if (!searchValue) {
        showMessage(
            `Please, fill in the search field`
        );
    return;
}
try {
    const response = await fetchImages(searchValue, currentPage);
    if (response.hits.length === 0) {
        showMessage('Sorry, there are no images matching your search query. Please try again!');
    refs.searchForm.reset();
    return;
}
    refs.imageList.insertAdjacentHTML('beforeend', createMarkup(response.hits));
    gallery.refresh();
            
if (response.hits.length >= 40) {
    refs.nextBtn.classList.remove('is-hidden');
} else {
    showMessage("We're sorry, but you've reached the end of search results.");
  }
    refs.searchForm.reset();
} catch (err) {
    handleError(err);
} finally {
    hideLoader();
    refs.loader.classList.add('hidden');
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

async function nextPage() {
    refs.loader.classList.remove('hidden');
    refs.nextBtn.classList.add('is-hidden');
    currentPage += 1;
    showLoader();    
try {
    const res = await fetchImages(searchValue, currentPage);
    if (currentPage * 40 >= res.totalHits) {
        showMessage("We're sorry, but you've reached the end of search results.");

if (res.hits.length > 0) {
    refs.imageList.insertAdjacentHTML('beforeend', createMarkup(res.hits));
    gallery.refresh();
    refs.nextBtn.classList.add('is-hidden');
    scrollBy();
    return;
}
} else {
    refs.imageList.insertAdjacentHTML('beforeend', createMarkup(res.hits));
    gallery.refresh();
    refs.nextBtn.classList.remove('is-hidden');
    scrollBy();
}
} catch (err) {
    handleError(err);
} finally {
    hideLoader();
    refs.loader.classList.add('hidden');
    }
}

function hideLoader() {
    setTimeout(() => {
    refs.loader.style.display = 'none';
  }, 500);
}

function showLoader() {
    refs.loader.style.display = 'block';
}

function scrollBy() {
  window.scrollBy({
    top:
    0.7 *
      document.querySelector('.gallery-item').getBoundingClientRect().height,
    behavior: 'smooth',
  });
}