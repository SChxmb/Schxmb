//
// Tool 0, Timetable
//

var CSV = []
var start = 4096
var end = 0
const minSep = 15

//
// Setup
//

async function t0_init() {

    CSV = await readCSV("CSV/sch.csv")

    let nameSel = document.getElementById("t0_name")

    for (let i = 0; i < CSV.length / 10; i++) {
        nameSel.options[nameSel.length] = new Option(CSV[i * 10][0], i * 10)
    }

    t0_reloadTtbl()

}

async function t0_reloadTtbl() {

    await t0_reloadBase()

    await t0_autofill()

}

async function t0_autofill() {

    let mode = document.getElementById("t0_mode").value

    if (mode == "Compare") {

        let nameBox = document.getElementById('t0_name')
        
        for (let i=0; i < nameBox.options.length; i++) {
            await t0_addCompare(i, document.getElementById("t0_day").selectedIndex)
        }
        t0_shrink()

    } else if (mode == "Overlay") {

        await t0_ttblOverlay_setup()

        for (i=0; i < 5; i++) {await t0_ttblOverlay_add(i)}

        await t0_ttblOverlay_reCol()

    } else if (mode == "Full") {

        let nameBox = document.getElementById('t0_name')

        for (let i=1; i < 6; i++) {
            await t0_addCompare(nameBox.selectedIndex, i)
            document.getElementById("t0_table").rows[0].cells[i].innerHTML = document.getElementById("t0_day").options[i].text
        }

        t0_shrink()

    }
}

async function t0_reloadBase() {   
    
    var table = document.getElementById("t0_table")

    table.style.width = ""

    while (table.rows.length > 0) {table.deleteRow(0);}

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

//
// General Tools
//

function t0_shrink() {

    var rows = document.getElementById("t0_table").rows
    
    rmvAllClass("t0_hideCell")
    
    for (let i = 1; i < rows.length; i++) {
        for (let j = 1; j < rows[i].cells.length; j++) {
            if (!(rows[i].cells[j].innerHTML == "" || rows[i].cells[j].innerHTML == "0") && start > i) {start = i}
            if (!(rows[i].cells[j].innerHTML == "" || rows[i].cells[j].innerHTML == "0") && end < i) {end = i}
        }
    }
    
    for (let i = 0; i < rows.length; i++) {
        if ((i+1 < start) || (i-1 > end)) {rows[i].classList.add("t0_hideCell")}
    }
    
    rows[0].classList.remove("t0_hideCell")
    rows[rows.length-1].classList.remove("t0_hideCell")

}

function t0_highRow(i) {

    var row = document.getElementById("t0_table").rows[i]

    if(row.classList.contains("t0_selTime")) {row.classList.remove("t0_selTime")}

    else {row.classList.add("t0_selTime")}

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

//
// Options
//

async function t0_addCompare(nameIndex, dayIndex) {

    let table = document.getElementById("t0_table")
    let rows = table.rows
    let selName = document.getElementById("t0_name").options[nameIndex]
    let cellPos = rows[0].cells.length

    //table.style.width = (parseInt(table.style.width.replace("%","")) + 20).toString() + "%"
    for (let i=0; i < rows.length-1; i++) {rows[i].insertCell(cellPos).outerHTML = `<td style="width:5em;" onclick="t0_highRow(${i})"></td>`}
    rows[0].cells[cellPos].innerHTML = selName.text
    
    let tDesc = await t0_getBusyTimes(nameIndex, dayIndex)
    
    for (let i=0; i < tDesc.length; i++) {
        
        let subject = tDesc[i][0]
        let sIndx = tDesc[i][1]
        let lenCount = tDesc[i][2]
        let times = tDesc[i][3]
        let rCol = "rCol" + Math.floor(Math.random() * 10)%5
        
        rows[sIndx].cells[cellPos].innerHTML = subject
        for (k=0; k<5; k++) {rows[sIndx].cells[cellPos].classList.remove("rCol" + k)}
        rows[sIndx].cells[cellPos].classList.add(rCol)

        if ((lenCount > 1) && (rows[sIndx + 1].cells[cellPos].innerHTML == "" || rows[sIndx + 1].cells[cellPos].innerHTML == "^")) {
            
            rows[sIndx + 1].cells[cellPos].innerHTML = times
            for (k=0; k<5; k++) {rows[sIndx + 1].cells[cellPos].classList.remove("rCol" + k)}
            rows[sIndx + 1].cells[cellPos].classList.add(rCol)
            
            for (j=sIndx+1; j < sIndx + lenCount; j++) {
                if (rows[j].cells[cellPos].innerHTML == "") {
                    
                    rows[j].cells[cellPos].innerHTML = "^"
                    rows[j].cells[cellPos].classList.add(rCol)
                
                }
            
            }
        
        }
        
    }

}

function t0_resetUIOptions() {

    mode = document.getElementById("t0_mode").value
    
    rmvAllClass("t0_hideOption")

    if (mode == "Full") {
        document.getElementById("t0_dayLbl").classList.add("t0_hideOption")
        document.getElementById("t0_day").classList.add("t0_hideOption")
        document.getElementById("t0_add").classList.add("t0_hideOption")
        document.getElementById("t0_reload").classList.add("t0_hideOption")
    }

}

//
// Overlay Mode
//

async function t0_ttblOverlay_setup() {

    let table = document.getElementById("t0_table")
    let rows = table.rows
    
    table.style.width = "100%"

    for (let j=1; j < 6; j++) {rows[0].insertCell(j).outerHTML = `<td style="z-index:10;">${document.getElementById("t0_day").options[j].text}</td>`}

    for (let i=1; i < rows.length - 1; i++) {
        for (let j=1; j < 6; j++) {rows[i].insertCell(j).outerHTML = `<td style="background-color:Red; width:15%;">0</td>`}
    }

}

async function t0_ttblOverlay_add(nameIndex) {

    let rows = document.getElementById("t0_table").rows

    for (let day = 1; day < 6; day++) {
        
        let fSpotDesc = await t0_getBusyTimes(nameIndex, day)
        
        for (let i=0; i < fSpotDesc.length; i++) {
            
            let sIndx = fSpotDesc[i][1]
            let lenCount = fSpotDesc[i][2]

            for (j=sIndx; j < sIndx + lenCount; j++) {
                rows[j].cells[day].innerHTML = parseInt(rows[j].cells[day].innerHTML) + 1
            }
        }
    }
}

async function t0_ttblOverlay_reCol() {

    t0_shrink()

    let rows = document.getElementById("t0_table").rows

    for (let day = 1; day < 6; day++) {
        for (let i = start-1; i <= end + 1; i++) {
            rows[i].cells[day].style.opacity = parseInt(rows[i].cells[day].innerHTML) / 5
        }
    }
}
