// page functions
 

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
    document.getElementById("colorcss").href = "Colour/light.css";
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
    t0_shrink()
    document.getElementById("topbar").rows[0].cells[0].innerHTML = Math.floor(Math.random() * 100);
}
function ret (x) {
    document.getElementById("dev").innerHTML += x.toString() + "; "
    document.getElementById("nav5").innerHTML == x
}


// Tool 0, Timetable


async function t0_init() {

    while (document.getElementById('t0_table').rows.length > 0) {document.getElementById('t0_table').deleteRow(0);}
    while (document.getElementById('t0_name').options.length > 0) {document.getElementById('t0_name').remove(0);}

    for (let i=0; i <= 4; i++) {rmvAllClass("rCol"+i)}

    const minSep = 15
    var table = document.getElementById("t0_table")

    table.style.width = "20%"
    table.insertRow(0).insertCell(0).innerHTML = minSep
    
    for (let i = 0; i < (1440 / minSep); i++) {
        
        let minPast = minSep * (i + 1)
        
        if (i == 0) {
        
            var from = "0:00" 
            var to = `${(Math.floor(minSep/60)).toString()}:${(minSep%60).toString().padStart(2, "0")}`
        
        } else {
        
            var from = to
            to = `${(Math.floor(minPast/60)).toString()}:${(minPast%60).toString().padStart(2, "0")}`
        
        }
        
        table.insertRow(-1).insertCell(0).outerHTML = `<td onclick="t0_highRow(${i+1})">${from} - ${to}</td>`
    
    }
    
    table.insertRow(-1).insertCell(0).outerHTML = `<td>...</td>`

    var CSV = await readCSV("CSV/sch.csv")
    let nameSel = document.getElementById("t0_name").options
    
    for (let i = 0; i < CSV.length / 10; i++) {
    
        nameSel[nameSel.length] = new Option(CSV[i * 10][0], i * 10)
    
    }

}

async function t0_add() {

    var CSV = await readCSV("CSV/sch.csv")
    var rows = document.getElementById("t0_table").rows

    var spacer = parseInt(rows[0].cells[0].innerHTML)
    var dayPlan = CSV[parseInt(document.getElementById("t0_name").value) + parseInt(document.getElementById("t0_day").value) + 2]
    var cellPos = rows[0].cells.length

    document.getElementById("t0_table").style.width = (parseInt(document.getElementById("t0_table").style.width.replace("%","")) + 20).toString() + "%"

    for (let i=0; i < rows.length-1; i++) {rows[i].insertCell(cellPos).outerHTML = `<td onclick="t0_highRow(${i})"></td>`}
    
    rows[0].cells[cellPos].innerHTML = document.getElementById("t0_name").options[document.getElementById("t0_name").selectedIndex].text
    
    for (let i = 0; i < (dayPlan.length - 1) / 3; i++) {
        
        let subject = dayPlan[i*3+1]
        let start = parseInt(dayPlan[i*3+2].split(":")[0])*60 + parseInt(dayPlan[i*3+2].split(":")[1])
        let end = parseInt(dayPlan[i*3+3].split(":")[0])*60 + parseInt(dayPlan[i*3+3].split(":")[1])
        let sIndx = Math.floor(start/spacer) + 1
        let rCol = "rCol" + Math.floor(Math.random() * 10)%5
        
        for (let j = 1; j <= rows.length; j++) {
            
            let rtime = (j - 1) * spacer
            
            if (j == sIndx) {rows[j].cells[cellPos].innerHTML = subject ; rows[j].cells[cellPos].classList.add(rCol) }
            
            else if (j - 1 == sIndx && rtime < end && (rows[j].cells[cellPos].innerHTML == "" || rows[j].cells[cellPos].innerHTML == "^")) {rows[j].cells[cellPos].innerHTML = dayPlan[i*3+2]  + " To " + dayPlan[i*3+3]; rows[j].cells[cellPos].classList.add(rCol)}
            else if (j - 1 == sIndx) {rows[j-1].cells[cellPos].innerHTML += ": " + dayPlan[i*3+2] + " To " + dayPlan[i*3+3]}
            else if (((start < rtime) && (rtime < end))&&(rows[j].cells[cellPos].innerHTML == "")) {rows[j].cells[cellPos].innerHTML = "^"; rows[j].cells[cellPos].classList.add(rCol)}
        }
    }

    t0_shrink()
}

function t0_shrink() {

    var rows = document.getElementById("t0_table").rows
    var start = 4096
    var end = 0
    
    rmvAllClass("t0_hide")
    
    for (let i = 1; i < rows.length; i++) {
        for (let j = 1; j < rows[i].cells.length; j++) {
            if (!(rows[i].cells[j].innerHTML == "") && start > i) {start = i}
            if (!(rows[i].cells[j].innerHTML == "") && end < i) {end = i}
        }
    }
    
    for (let i = 0; i < rows.length; i++) {
        if ((i+1 < start) || (i-1 > end)) {rows[i].classList.add("t0_hide")}
    }
    
    rows[0].classList.remove("t0_hide")
    rows[rows.length-1].classList.remove("t0_hide")

}

function t0_highRow(i) {
    var row = document.getElementById("t0_table").rows[i]

    if(row.classList.contains("t0_selTime")) {row.classList.remove("t0_selTime")}

    else {row.classList.add("t0_selTime")}

}