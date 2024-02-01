export function createMarkup(hits) {
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