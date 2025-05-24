document.addEventListener("DOMContentLoaded", function () {
    const lamp = document.getElementById("lamp");
    let isOn = false;

    lamp.addEventListener("click", function () {
        if (isOn) {
            lamp.src = "assets/lamp_off.png"; 
            document.body.style.background = "radial-gradient(circle, white 8%, black 100%)";
        } else {
            lamp.src = "assets/lamp_on.png"; 
            document.body.style.background = "radial-gradient(circle, yellow 20%, black 100%)";
        }
        isOn = !isOn;
    });
});
