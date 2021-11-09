const noParticipant = document.querySelector("input[role='switch']");
const numPartInput = document.querySelector("input#limit");
noParticipant.onclick = function () {
    if (noParticipant.checked === true) {
        numPartInput.disabled = true;
    } else {
        numPartInput.disabled = false;
    }
}