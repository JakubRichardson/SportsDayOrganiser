const removeForm = document.querySelector("form#removeForm");
const returnTo = removeForm.querySelector("input");
const removeButtons = document.querySelectorAll("button#rowRemove")
removeButtons.forEach(btn => {
    btn.addEventListener("click", e => {
        const submitTo = btn.getAttribute("data-submit-val");
        removeForm.action = `/templateEvents/${submitTo}?_method=DELETE`;
        returnTo.value = window.location.href;
        removeForm.submit();
    })
})

const tableRows = document.querySelectorAll("tbody > tr");
const allCheckboxes = [];
for (let tr of tableRows) {
    const checkboxes = Array.from(tr.querySelectorAll("input[type='checkbox']"));
    allCheckboxes.push(...checkboxes);
    if (checkboxes.length > 2) {
        const selectAllCheckbox = checkboxes[checkboxes.length - 1];
        const toggler = selectAll(selectAllCheckbox, checkboxes.splice(0, checkboxes.length - 1))
        selectAllCheckbox.onclick = toggler;
    }
}

const selectAllEventsCheckbox = document.querySelector("thead input[type='checkbox']");
const toggler = selectAll(selectAllEventsCheckbox, allCheckboxes);
selectAllEventsCheckbox.onclick = toggler;

function selectAll(selectAllCheck, checkBoxes) {
    return () => checkBoxes.forEach(check => check.checked = selectAllCheck.checked);
}