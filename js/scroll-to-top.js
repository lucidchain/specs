document.addEventListener("DOMContentLoaded", function() {
    var button = document.createElement("button");
    button.innerHTML = "↑";
    button.id = "scroll-to-top";
    document.body.appendChild(button);

    window.onscroll = function() {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            button.style.display = "block";
        } else {
            button.style.display = "none";
        }
    };

    button.onclick = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
});
