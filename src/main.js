import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const imageList = document.querySelector('.gallery');
    const loader = document.createElement('div');
    const nextBtn = document.querySelector('#next-btn');
    
    let currentPage = 0;
    let searchValue = '';
    
    const gallery = new SimpleLightbox('.gallery a', {
        captionsData: 'alt',
        captionDelay: 250,
    });

    form.addEventListener('submit', handleSearch);
    nextBtn.addEventListener('click', nextPage);
  
    async function handleSearch(event) {
        event.preventDefault();

        const searchInput = form.elements.input.value;

        searchValue = searchInput;
        currentPage = 1;

        nextBtn.classList.add('is-hidden');
        
        imageList.innerHTML = '';

        if (!searchInput.trim()) {
            iziToast.warning({
                title: 'Warning',
                message: 'Please enter a search query.',
                messageSize: '20px',
                messageColor: '#808080',
                backgroundColor: '#e7fc44',
                position: 'topLeft',
                timeout: 3000,
            });
            return;
        }

        showLoader();

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
                form.reset();
                return;
            }
            imageList.innerHTML = createMarkup(response.hits);
            gallery.refresh();
            
            if (response.hits.length >= 40) {
                nextBtn.classList.remove('is-hidden');
            }

            scrollBy();
            form.reset();
        } catch (err) {
            handleError(err);
        } finally {
            hideLoader();
        }
    }

    async function fetchImages(value, page) {
        const BASE_URL = 'https://pixabay.com/api/';
        const KEY = '41927866-cfb01af7ede59fae11104cea9';

        const res = await axios.get(BASE_URL, {
            params: {
                key: KEY,
                q: value,
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
            <ul class="gallery-item-description">
              <li>Likes: ${likes}</li>
              <li>Views: ${views}</li>
              <li>Downloads: ${downloads}</li>
              <li>Comments: ${comments}</li>
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
            iconUrl: icon,
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


    function showLoader() {
        loader.classList.remove('hidden');
    }
    function hideLoader() {
        loader.classList.add('hidden');
    }

    async function nextPage() {
    loader.classList.remove('is-hidden');
    nextBtn.classList.add('is-hidden');
    currentPage += 1;

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
        imageList.innerHTML += createMarkup(res.hits);
        gallery.refresh();
        nextBtn.classList.add('is-hidden');

        scrollBy();

        return;
    }

        imageList.innerHTML += createMarkup(res.hits);
        gallery.refresh();

        scrollBy();

        nextBtn.classList.remove('is-hidden');
    } catch (err) {
        handleError(err);
    } finally {
        loader.classList.add('is-hidden');
    }
}
});

