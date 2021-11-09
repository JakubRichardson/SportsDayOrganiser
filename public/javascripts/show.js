const numEvents = document.querySelector("[data-num-events]");
const cards = document.querySelectorAll("[data-card-container]");
const allRadioButton = document.querySelector("[data-all-radio]");
allRadioButton.addEventListener("change", function () {
    for (card of cards) {
        card.style.display = "block";
    }
    numEvents.textContent = cards.length;
})
const filterCallback = word => {
    return () => {
        let total = 0;
        for (card of cards) {
            if (card.getAttribute("data-card-gender") === word) {
                card.style.display = "block";
                total++;
            } else {
                card.style.display = "none";
            }
        }
        numEvents.textContent = total;
    }
}
const maleRadioButton = document.querySelector("[data-male-radio]");
maleRadioButton.addEventListener("change", filterCallback("male"));
const femaleRadioButton = document.querySelector("[data-female-radio]");
femaleRadioButton.addEventListener("change", filterCallback("female"));