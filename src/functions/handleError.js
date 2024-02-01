export function handleError(err) {
console.error(err);
    refs.imageList.innerHTML = '';
    showMessage(err.stack);
    refs.nextBtn.removeEventListener('click', nextPage);
    refs.nextBtn.classList.add('is-hidden');
}