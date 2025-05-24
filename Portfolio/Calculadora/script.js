const display = document.getElementById("display");

const buttons = document.querySelectorAll(".btn");

function updateDisplay(value) {
    if (value === "C") {
        display.textContent = "";
    } else if (value === "<") {
        display.textContent = display.textContent.slice(0, -1);
    } else if (value === "=") {
        try {
            const expression = display.textContent.replace(/x/g, "*");
            display.textContent = eval(expression);
        } catch (e) {
            display.textContent = "Erro";
        }
    } else {
        display.textContent += value;
    }
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.textContent.trim();
        updateDisplay(value);
    });
});
