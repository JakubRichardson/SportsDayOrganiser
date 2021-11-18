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

function selectAll(selectAllCheck, checkBoxes, limitInputs) {
    return () => {
        checkBoxes.forEach(check => check.checked = selectAllCheck.checked);
        limitInputs.forEach(input => input.disabled = !selectAllCheck.checked);
    }
}

const maleExp = new RegExp("\\bmale.*\\b");
const cards = document.querySelectorAll("div.card#templateCard");
const allCheckboxes = { male: [], female: [], other: [] };
const limits = { male: [], female: [] };
for (let card of cards) {
    const checkboxes = Array.from(card.querySelectorAll("input[type='checkbox']"));
    const limitInputs = Array.from(card.querySelectorAll("input[type='number']"));
    if (checkboxes.length === limitInputs.length + 1) {
        allCheckboxes.other.push(checkboxes[0]);
        for (let i = 0; i < limitInputs.length; i++) {
            const check = checkboxes[i + 1];
            check.onclick = () => {
                limitInputs[i].disabled = !check.checked;
            }
            if (maleExp.test(check.id)) {
                allCheckboxes.male.push(check);
                limits.male.push(limitInputs[i]);
            } else {
                allCheckboxes.female.push(check);
                limits.female.push(limitInputs[i]);
            }
        }
    }
    if (checkboxes.length > 2) {
        const selectAllCheckbox = checkboxes[0];
        const toggler = selectAll(selectAllCheckbox, checkboxes.splice(1, checkboxes.length), limitInputs)
        selectAllCheckbox.onclick = toggler;
    }
}

const maleSelectAllCheck = document.querySelector("div#controlPanel input[type='checkbox']#allEventsMale");
const maleLimit = document.querySelector("div#controlPanel input[type='number']#allEventsLimitMale");
maleSelectAllCheck.onclick = selectAll(maleSelectAllCheck, allCheckboxes.male, [...limits.male, maleLimit]);
const femaleSelectAllCheck = document.querySelector("div#controlPanel input[type='checkbox']#allEventsFemale");
const femaleLimit = document.querySelector("div#controlPanel input[type='number']#allEventsLimitFemale");
femaleSelectAllCheck.onclick = selectAll(femaleSelectAllCheck, allCheckboxes.female, [...limits.female, femaleLimit]);
const selectAllCheck = document.querySelector("div#controlPanel input[type='checkbox']#allEvents");
const allLimit = document.querySelector("div#controlPanel input[type='number']#allEventsLimit");
const maleToggler = selectAll(selectAllCheck, [...allCheckboxes.male, maleSelectAllCheck], [...limits.male, maleLimit]);
const femaleToggler = selectAll(selectAllCheck, [...allCheckboxes.female, femaleSelectAllCheck], [...limits.female, femaleLimit]);
const otherToggler = selectAll(selectAllCheck, allCheckboxes.other, [allLimit]);
selectAllCheck.onclick = () => {
    maleToggler();
    femaleToggler();
    otherToggler();
};

function limitToggler(limits, check) {
    limits.forEach(limit => {
        if (limit.disabled === false) {
            limit.value = check.value;
        }
    })
}

maleLimit.addEventListener("input", limitToggler(limits.male, maleLimit));
femaleLimit.addEventListener("input", limitToggler(limits.female, femaleLimit))


allLimit.addEventListener("input", () => {
    limitToggler(limits.male, allLimit)
    limitToggler(limits.female, allLimit)
})