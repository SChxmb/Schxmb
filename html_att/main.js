function sizeCheck() {
    if (window.innerWidth >= window.innerHeight && document.getElementById("platformcss").href != "") {
        document.getElementById("platformcss").href = "";
        try{sbar.classList.remove("showsbar")} catch {}
    }
    if (window.innerWidth < window.innerHeight && document.getElementById("platformcss").href != "Layout/mobile.css") {
        document.getElementById("platformcss").href = "Layout/mobile.css";
    }
    refreshAside();
}
function colorCheck() {
    document.getElementById("colorcss").href = "Colour/light.css";
}
function openAside() {
    let sbar = document.getElementsByTagName("aside")[0];
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
    try {document.getElementById('main' + selpageid).classList.add("selected");} catch {}
    refreshAside();
}

function refreshAside() {
    document.getElementsByTagName("aside")[0].style.height = "0px"
    if (document.body.scrollHeight > window.innerHeight) { 
        document.getElementsByTagName("aside")[0].style.height = (document.body.scrollHeight - document.getElementById("nullDiv").clientHeight).toString() + "px";
    } else {
        document.getElementsByTagName("aside")[0].style.height = (window.innerHeight - document.getElementById("nullDiv").clientHeight).toString() + "px";
    }
}

function test() {
    document.getElementById("nav1").innerHTML = Math.floor(Math.random() * 100);
}