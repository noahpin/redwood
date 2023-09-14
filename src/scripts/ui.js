
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
    }else if (theme =="system") {
        var systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
		if (systemTheme) {
            document.body.classList.remove("ui-theme-light");
            document.body.classList.add("ui-theme-dark");
		} else {
            document.body.classList.remove("ui-theme-dark");
            document.body.classList.add("ui-theme-light");
		}
    }

    document
		.querySelector('meta[name="theme-color"]')
		.setAttribute(
			"content",
			getComputedStyle(document.body).getPropertyValue(
				"--background-primary"
			)
		);
	document
		.querySelector('meta[name="apple-mobile-web-app-status-bar"]')
		.setAttribute(
			"content",
			getComputedStyle(document.body).getPropertyValue(
				"--background-primary"
			)
		);
	document
		.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
		.setAttribute(
			"content",
			getComputedStyle(document.body).getPropertyValue(
				"--background-primary"
			)
		);
}

window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", function (e) {
		if (localStorage.theme == "system") {
			setTheme("system");
		}
	});

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