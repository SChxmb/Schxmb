// page functions
 

function init() {
    let d = new Date()
    document.getElementById("t0_day").selectedIndex = d.getDay()
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


// Tool 0, Timetable

var CSV = []

async function t0_autofill() {
    let nameBox = document.getElementById('t0_name')
    for (let i=0; i < nameBox.options.length; i++) {
        await t0_add(i, document.getElementById("t0_day").selectedIndex, 0)
    }
}

async function t0_init() {

    await t0_reload()
    
    CSV = await readCSV("CSV/sch.csv")
    
    let nameSel = document.getElementById("t0_name").options
    
    for (let i = 0; i < CSV.length / 10; i++) {
        nameSel[nameSel.length] = new Option(CSV[i * 10][0], i * 10)
    }

//    await t0_autofill()

}

async function t0_reload() {

    const minSep = 15
    var table = document.getElementById("t0_table")

    while (table.rows.length > 0) {table.deleteRow(0);}
    while (document.getElementById('t0_name').options.length > 0) {document.getElementById('t0_name').remove(0);}

    table.style.width = "20%"
    table.insertRow(0).insertCell(0).innerHTML = minSep
    
    var to = "0:00", from = ''

    for (let i = 0; i < (1440 / minSep); i++) {
        
        let minPast = minSep * (i + 1)
        
        from = to
        to = `${(Math.floor(minPast/60)).toString()}:${(minPast%60).toString().padStart(2, "0")}`
        
        table.insertRow(-1).insertCell(0).outerHTML = `<td onclick="t0_highRow(${i+1})">${from} - ${to}</td>`
    
    }

    table.insertRow(-1).insertCell(0).outerHTML = `<td>...</td>`

}

async function t0_add(nameIndex, dayIndex, mode) {

    let table = document.getElementById("t0_table")
    let rows = table.rows
    let selName = document.getElementById("t0_name").options[nameIndex]

    let spacer = parseInt(rows[0].cells[0].innerHTML)
    let dayPlan = CSV[parseInt(selName.value)+ 2 + dayIndex]
    let cellPos = rows[0].cells.length

    let tempFSpots = []

    table.style.width = (parseInt(table.style.width.replace("%","")) + 20).toString() + "%"

    for (let i=0; i < rows.length-1; i++) {rows[i].insertCell(cellPos).outerHTML = `<td onclick="t0_highRow(${i})"></td>`}

    rows[0].cells[cellPos].innerHTML = selName.text

    for (let i = 0; i < (dayPlan.length - 1) / 3; i++) {
        
        let subject = dayPlan[i*3+1]
        let start = parseInt(dayPlan[i*3+2].split(":")[0])*60 + parseInt(dayPlan[i*3+2].split(":")[1])
        let end = parseInt(dayPlan[i*3+3].split(":")[0])*60 + parseInt(dayPlan[i*3+3].split(":")[1])
        
        let sIndx = Math.floor(start/spacer) + 1
        let rCol = "rCol" + Math.floor(Math.random() * 10)%5

        if (mode == 0) {
            for (let j = 1; j <= rows.length; j++) {

                let rtime = (j - 1) * spacer
            
                if (j == sIndx) {rows[j].cells[cellPos].innerHTML = subject ; rows[j].cells[cellPos].classList.add(rCol) }
                
                else if (j - 1 == sIndx && rtime < end && (rows[j].cells[cellPos].innerHTML == "" || rows[j].cells[cellPos].innerHTML == "^")) {rows[j].cells[cellPos].innerHTML = dayPlan[i*3+2]  + " To " + dayPlan[i*3+3]; rows[j].cells[cellPos].classList.add(rCol)}
                else if (j - 1 == sIndx) {rows[j-1].cells[cellPos].innerHTML += ": " + dayPlan[i*3+2] + " To " + dayPlan[i*3+3]}
                else if (((start < rtime) && (rtime < end))&&(rows[j].cells[cellPos].innerHTML == "")) {rows[j].cells[cellPos].innerHTML = "^"; rows[j].cells[cellPos].classList.add(rCol)}
                
            }
        }

        else if (mode == 1) {
            
            for (let j = 1; j <= rows.length; j++) {
                let rtime = (j - 1) * spacer
                if (((start <= rtime) && (rtime < end)) && (tempFSpots.indexOf(rtime) < 0)) {tempFSpots.push(rtime)}
            }
        
        }
    
    }

    if (mode == 0) {return}
    else if (mode == 1) {return tempFSpots}

}

async function t0_getBusyTimes(nameIndex, dayIndex) {

    let table = document.getElementById("t0_table")
    let rows = table.rows
    let selName = document.getElementById("t0_name").options[nameIndex]

    let spacer = parseInt(rows[0].cells[0].innerHTML)
    let dayPlan = CSV[parseInt(selName.value)+ 2 + dayIndex]

    let fSpotDesc = []

    for (let i = 0; i < (dayPlan.length - 1) / 3; i++) {
        let subject = dayPlan[i*3+1]
        let start = parseInt(dayPlan[i*3+2].split(":")[0])*60 + parseInt(dayPlan[i*3+2].split(":")[1])
        let end = parseInt(dayPlan[i*3+3].split(":")[0])*60 + parseInt(dayPlan[i*3+3].split(":")[1])
        let sIndx = Math.floor(start/spacer) + 1
        let lenCount = 0
        
        for (let j = 0; j < rows.length; j++) {
            
            let rtime = j * spacer

            if ((start <= rtime) && (rtime < end)) {
                lenCount += 1
            }
        
        }

        fSpotDesc.push([subject, sIndx, lenCount, `${dayPlan[i*3+2]} to ${dayPlan[i*3+3]}`])
    
    }

    return fSpotDesc

}

async function t0_addCompare(nameIndex, dayIndex) {

    let table = document.getElementById("t0_table")
    let rows = table.rows
    let selName = document.getElementById("t0_name").options[nameIndex]
    let cellPos = rows[0].cells.length

    table.style.width = (parseInt(table.style.width.replace("%","")) + 20).toString() + "%"
    for (let i=0; i < rows.length-1; i++) {rows[i].insertCell(cellPos).outerHTML = `<td onclick="t0_highRow(${i})"></td>`}
    rows[0].cells[cellPos].innerHTML = selName.text

    let tDesc = await t0_getBusyTimes(nameIndex, dayIndex)
    
    for (let i=0; i < tDesc.length; i++) {
        
        let subject = tDesc[i][0]
        let sIndx = tDesc[i][1]
        let lenCount = tDesc[i][2]
        let times = tDesc[i][3]

        for (let j=sIndx; j < sIndx + lenCount; j++) {
            if (j == sIndx) {rows[j].cells[cellPos].innerHTML = subject && times}
            else if (rows[j].cells[cellPos].innerHTML == "") {
                rows[j].cells[cellPos].innerHTML = "^"
            }
        }
    }

}

async function t0_ttblOverlay_add(name) {
    //for (let day = 0; day <= 6, day++) {}
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