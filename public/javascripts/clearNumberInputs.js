const numberInputs = document.querySelectorAll("input[type='number']");
numberInputs.forEach(inp => {
    const span = inp.nextElementSibling;
    if (span) {
        span.addEventListener("click", evt => {
            inp.value = "";
            inp.dispatchEvent(new Event('input'));
        });
    }
});