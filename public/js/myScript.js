let rangeInput = document.getElementById('ratingSlider');
let currentRating = document.getElementById('currentRating');

currentRating.innerText = rangeInput.value;
rangeInput.addEventListener('change', () => {
    currentRating.innerText = rangeInput.value;
})

console.log("hello");
