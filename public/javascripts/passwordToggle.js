const passwordInputs = document.querySelectorAll("input[type='password']");
passwordInputs.forEach(pass => {
    const span = pass.nextElementSibling;
    if (span) {
        span.addEventListener("click", evt => {
            const img = span.querySelector("img");
            if (pass.type === "text") {
                pass.type = "password";
                img.src = "/imgs/closedEye.svg";
            } else {
                pass.type = "text";
                img.src = "/imgs/eye.svg";
            }
        });
    }
});