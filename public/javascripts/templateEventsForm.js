const removeForm = document.querySelector("form#removeForm");
const returnTo = removeForm.querySelector("input");
const removeButtons = document.querySelectorAll("button#tempRemove")
removeButtons.forEach(btn => {
    btn.addEventListener("click", e => {
        const submitTo = btn.getAttribute("data-submit-val");
        removeForm.action = `/templateEvents/${submitTo}?_method=DELETE`;
        returnTo.value = window.location.href;
        removeForm.submit();
    })
})

const maleExp = new RegExp("\\bmale.*\\b");
const cards = document.querySelectorAll("div.card#templateCard");
const allCheckboxes = { male: [], female: [] };
const limits = { male: [], female: [] };
for (let card of cards) {
    const selectBoth = card.querySelector("button#selectBoth");
    const unselectBoth = card.querySelector("button#unselectBoth");
    const checkboxes = Array.from(card.querySelectorAll("input[type='checkbox']"));
    const limitInputs = Array.from(card.querySelectorAll("input[type='number']"));
    selectBoth.onclick = enableComponents(true, [...checkboxes, ...limitInputs])
    unselectBoth.onclick = enableComponents(false, [...checkboxes, ...limitInputs])
    if (checkboxes.length === limitInputs.length) {
        for (let i = 0; i < limitInputs.length; i++) {
            const check = checkboxes[i];
            const limit = limitInputs[i];
            check.onclick = () => {
                limit.disabled = !check.checked;
            }
            if (maleExp.test(check.id)) {
                allCheckboxes.male.push(check);
                limits.male.push(limit);
            } else {
                allCheckboxes.female.push(check);
                limits.female.push(limit);
            }
        }
    }
}

function enableComponents(enable, components) {
    return () => {
        components.forEach(component => {
            if (component?.type.toLowerCase() === "button" || component?.type.toLowerCase() === "number") {
                component.disabled = !enable;
            } else if (component?.tagName.toLowerCase() === "input") {
                component.checked = enable;
            }
        });
    }
}

const maleSelectAllButton = document.querySelector("div#controlPanel button#allEventsMale");
const maleUnselectAllButton = document.querySelector("div#controlPanel button#unselectEventsMale");
const maleLimit = document.querySelector("div#controlPanel input[type='number']#allEventsLimitMale");
const femaleSelectAllButton = document.querySelector("div#controlPanel button#allEventsFemale");
const femaleUnselectAllButton = document.querySelector("div#controlPanel button#unselectEventsFemale");
const femaleLimit = document.querySelector("div#controlPanel input[type='number']#allEventsLimitFemale");
const selectAllButton = document.querySelector("div#controlPanel button#allEvents");
const unselectAllButton = document.querySelector("div#controlPanel button#unselectEvents");
const allLimit = document.querySelector("div#controlPanel input[type='number']#allEventsLimit");

const selectAllMale = enableComponents(true, [...allCheckboxes.male, ...limits.male, maleLimit]);
const unselectAllMale = enableComponents(false, [...allCheckboxes.male, ...limits.male, maleLimit, allLimit]);
maleSelectAllButton.onclick = selectAllMale;
maleUnselectAllButton.onclick = unselectAllMale;
const selectAllFemale = enableComponents(true, [...allCheckboxes.female, ...limits.female, femaleLimit]);
const unselectAllFemale = enableComponents(false, [...allCheckboxes.female, ...limits.female, femaleLimit, allLimit]);
femaleSelectAllButton.onclick = selectAllFemale;
femaleUnselectAllButton.onclick = unselectAllFemale;
selectAllButton.onclick = () => {
    selectAllMale();
    selectAllFemale();
    allLimit.disabled = false;
};
unselectAllButton.onclick = () => {
    unselectAllMale();
    unselectAllFemale();
    allLimit.disabled = true;
};

function limitAutoComplete(original, fillArray) {
    return () => {
        fillArray.forEach(limit => {
            if (limit.disabled === false) {
                limit.value = original.value;
            }
        })
    }
}

maleLimit.addEventListener("input", limitAutoComplete(maleLimit, limits.male));
femaleLimit.addEventListener("input", limitAutoComplete(femaleLimit, limits.female))
allLimit.addEventListener("input", () => {
    limitAutoComplete(allLimit, limits.male)()
    limitAutoComplete(allLimit, limits.female)()
})