
document.addEventListener("DOMContentLoaded", function () {
	notify = new Alrt({
		position: "top-center",
		duration: 1200, //default duration
		behavior: "overwrite",
	});
    document.getElementById('sign-up').onsubmit = signUpSubmitted
    document.getElementById('sign-in').onsubmit = signInSubmitted
    changeToSignIn()
});

function throwAuthErr(msg, type) {
    if(type =="password") {
        document.querySelectorAll('input[type="password"]').forEach((el) => {
            el.classList.add("ui-input-error");
            console.log(el)
        });
    }else if(type =="email") {
        document.querySelectorAll('input[type="email"]').forEach((el) => {
            el.classList.add("ui-input-error");
        });
    }else if(typeof type == "object") {
        console.log(type)
        type.forEach((el) => {
            document.querySelectorAll('input[type="'+ el +'"]').forEach((el) => {
                el.classList.add("ui-input-error");
                console.log(el)
            });
        });
    }
    document.querySelectorAll('.auth-err-area').forEach((el) => {
        el.style.display = "block";
        el.innerHTML = msg;
    })
}

function clearAuthErr() {
    document.querySelectorAll('.auth-err-area').forEach((el) => {
        el.style.display = "";
    })
    document.querySelectorAll('.ui-input-error').forEach((el) => {
        el.classList.remove("ui-input-error");
    });
}

function changeToSignIn() {
    document.getElementById('sign-up').style.display = "none";
    document.getElementById('sign-in').style.display = "flex";
    document.getElementById('auth-ui-title').innerHTML = "Sign In"
    clearAuthErr()
}

function changeToSignUp() {
    document.getElementById('sign-up').style.display = "flex";
    document.getElementById('sign-in').style.display = "none";
    document.getElementById('auth-ui-title').innerHTML = "Sign Up"
    clearAuthErr()
}