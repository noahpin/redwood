
function initThemes() {
    if(!localStorage.getItem("theme")) {
        localStorage.setItem("theme", "light");
    }
    setTheme(localStorage.getItem("theme"));
    

    setAccent('red');
}

function setTheme(theme) {
    localStorage.setItem("theme", theme);
    if(theme == "light") {
        document.body.classList.remove("ui-theme-dark");
        document.body.classList.add("ui-theme-light");
    }else if(theme == "dark") {
        document.body.classList.remove("ui-theme-light");
        document.body.classList.add("ui-theme-dark");
    }
}

function setAccent(accent) {
    document.body.classList.remove("ui-accent-color-red");
    document.body.classList.remove("ui-accent-color-blue");
    document.body.classList.remove("ui-accent-color-green");
    document.body.classList.remove("ui-accent-color-yellow");
    document.body.classList.remove("ui-accent-color-purple");
    document.body.classList.remove("ui-accent-color-pink");
    document.body.classList.remove("ui-accent-color-orange");
    document.body.classList.remove("ui-accent-color-cyan");

    document.body.classList.add("ui-accent-color-" + accent);
}