function init() {
    document.getElementsByTagName("body").item(0).style.overflowY = "hidden"
}

function scrollBox(i) {
    if (document.documentElement.clientHeight*(i*0.8) > window.scrollY + 1) {
        window.scrollTo(0, document.documentElement.clientHeight*(0.85*i))
    } else {
        window.scrollTo(0, document.documentElement.clientHeight*((i-1)*0.85))
    }
}

function swapTheme() {
    x = document.getElementById("theme")
    if (String(x.href).includes("CSS/dark.css")) {
        x.href = "/CSS/light.css"
    } else {
        x.href = "/CSS/dark.css"
    }
}