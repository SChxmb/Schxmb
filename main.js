// page functions
 

async function init() {

    colorCheck()

    topBtn(1)

    toolBTN(0)

    let d = new Date()
    document.getElementById("t0_day").selectedIndex = 5//d.getDay()
    
    await t0_init()

}

function topBtn(i) {
    rmvAllClass("seltab")
    document.getElementById("topbar").rows[0].cells[i].classList.add("seltab");
    try {document.getElementById(`pg${i.toString()}`).classList.add("seltab")} catch {}
}

function toolBTN(i) { 
    rmvAllClass("seltool")
    document.getElementById(`tBtn${i}`).classList.add("seltool");
    document.getElementById(`t${i}_div`).classList.add("seltool");
}

function colorCheck() {
    document.getElementById("colorcss").href = "Colour/dark.css";
}


// general tools


function rmvAllClass(str) {
    let sel = document.getElementsByClassName(str)
    for (let x=sel.length-1;x >= 0; x--) {
        sel[x].classList.remove(str);}
}

async function readCSV(loc){
    async function a(loc) {
        let response = await fetch(loc);
        let data = await response.text();
        return data
    }
    var csvRows = (await a(loc)).split('\n')
    var output = []
    for (let csvRow of csvRows) {output.push(csvRow.split(','))}
    return output
}

async function test() {

    let temp = document.getElementById("colorcss")
    if (temp.href.toString().search("Colour/dark.css") >= 0) {temp.href = "Colour/light.css"}
    else {temp.href = "Colour/dark.css"}
    document.getElementById("topbar").rows[0].cells[0].innerHTML = Math.floor(Math.random() * 100);

}

function ret (x) {
    document.getElementById("dev").innerHTML += x.toString() + "; "
    document.getElementById("nav5").innerHTML == x
}
