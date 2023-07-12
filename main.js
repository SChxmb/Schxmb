function sizeCheck() {
    if (window.innerWidth >= 750 && document.getElementById("platformcss").href != "") {
        document.getElementById("platformcss").href = "";
        try{sbar.classList.remove("showsbar")} catch {}
    }
    if (window.innerWidth < 750 && document.getElementById("platformcss").href != "Layout/mobile.css") {
        document.getElementById("platformcss").href = "Layout/mobile.css";
    }
}
function colorCheck() {
    document.getElementById("colorcss").href = "Colour/spooky.css";
}
function openAside() {
    let sbar = document.getElementById("sidebar");
    let sbarsel = document.getElementById("sidebarsel");
    if (sbar.classList.length == 0) {
        sbar.classList.add("showsbar");
        sbarsel.classList.add("showsbar");
    } else {
        sbar.classList.remove("showsbar")
        sbarsel.classList.remove("showsbar");
    }
}
function tabBTN(selpageid) {
    for (let currSel of document.getElementsByClassName("selected")) {
        currSel.classList.remove("selected");
    }
    try {document.getElementsByClassName("selected")[0].classList.remove("selected");}
    catch {}
    document.getElementById('nav' + selpageid).classList.add("selected");
    document.getElementById('main' + selpageid).classList.add("selected");
}
