
const deleteButtons = document.querySelectorAll("button[data-bs-toggle='modal']");
console.log(deleteButtons)
const modal = document.querySelector("div.modal");
console.log(modal);
const deleteName = modal.querySelector("span[data-delete-name]");
const deleteForm = modal.querySelector("form");
deleteButtons.forEach(btn => {
    btn.addEventListener("click", evt => {
        evt.preventDefault();
        evt.stopImmediatePropagation();
        deleteName.textContent = btn.getAttribute("data-name");
        const submitTo = btn.getAttribute("data-submit-to");
        deleteForm.action = `${submitTo}?_method=DELETE`;
        modal.style.display = "block";
    })
})