const minSep = 15
const people = []

class person {

    constructor(name) {
        this.name = name
        this.monday = new Array
        this.tuesday = new Array
        this.wednesday = new Array
        this.thursday = new Array
        this.friday = new Array
        this.saturday = new Array
        this.sunday = new Array
    }

}

class lesson {
    
    constructor(subject, start, end) {
        this.subject = subject
        this.start = this.rTimeify(start)
        this.end = this.rTimeify(end)
    }

    rTimeify(s) {
        let li = s.split(":")
        let rtime = parseInt(li[0])*60 + parseInt(li[1])
        return rtime
    }

}

async function initOptions() {

    let nameSel1 = document.getElementById("name1")
    let nameSel2 = document.getElementById("name2")
    while (nameSel1.options.length > 0) {nameSel1.remove(0); nameSel2.remove(0)}

    let d = new Date()
    document.getElementById("day").selectedIndex = d.getDay()

    loadTableBase("a")
    classifyCSV(await loadCSV("/CSV/timetable.csv"))
    
    for (let fella of people) {
        nameSel1.add(new Option(fella.name, fella.name))
        nameSel2.add(new Option(fella.name, fella.name))
    }

    nameSel2.selectedIndex = 2

}

function loadTableBase(mode) {
    var t = document.getElementById("outTable")
    if (mode == "a") { //absolute times

        while (t.rows.length > 1) {t.deleteRow(1);}
        while (t.rows[0].cells.length > 1) {t.rows[0].deleteCell(1);}

        var to = "0:00", from = ''
        for (let i = 0; i < (1440 / minSep); i++) {
            
            let minPast = minSep * (i + 1)
            
            from = to
            to = `${(Math.floor(minPast/60)).toString()}:${(minPast%60).toString().padStart(2, "0")}`
            t.insertRow(-1).outerHTML = `<tr id=${"R" + toString(i)}><th>${from} - ${to}</th></tr>`
        
        }

        t.insertRow(-1).insertCell(0).outerHTML = `<th>...</th>`
        t.rows[t.rows.length-1].insertCell(1).outerHTML= `<th style="display:none;">0</th>`
    }
}

function pressBtn() {
    loadTableBase("a")
    addPerson(document.getElementById("name1").selectedIndex)
    addPerson(document.getElementById("name2").selectedIndex)
}

function addPerson(pIndex) {

    let day = document.getElementById("day").options[document.getElementById("day").selectedIndex].text
    let t = document.getElementById("outTable")
    let column = t.rows[0].cells.length
    let lessons = people[pIndex][day]

    t.rows[0].insertCell(column).outerHTML = `<th>${people[pIndex].name}</th>`
    
    for (let i=1; i <= (1440/minSep); i++) {
        t.rows[i].insertCell(column)
    }

    for (let lesson of lessons) {
    
        t.rows[(lesson.start/minSep) + 1].cells[column].outerHTML = `<td>${lesson.subject}</td>`

        if (((lesson.end - lesson.start)/minSep) >= 2) {
            if (String(t.rows[(lesson.start/minSep) + 2].cells[column].innerHTML).replace("^", "").trim() == "") {
                t.rows[(lesson.start/minSep) + 2].cells[column].outerHTML = `<td>${lesson.start}</td>`
            }

            for (i=2; i < (lesson.end - lesson.start)/minSep; i++) {
                t.rows[(lesson.start/minSep) + i + 1].cells[column].outerHTML = `<td>^</td>`
            }
        
        }
    
    }

    reZero()

}

function reZero() {

    rmvAllClass("hide")

    let t = document.getElementById("outTable")
    columns = t.rows[0].cells.length
    var start = 1440, end = 0
    
    for (i = 0; i < (1440/minSep); i++) {
        for (j=1; j < columns; j++) {
            if (!(String(t.rows[i + 1].cells[j].innerHTML) == "")) {
                if (i > end) {end = i}
                if (i < start) {start = i}
            }
        }
    }

    for (i = 0; i < (1440/minSep); i++) {
        if ((i < start - 1) || (end + 1 < i)) {
            t.rows[i+1].classList.add("hide")
        }
    }

}

// CSV tools

async function loadCSV(s) {

    async function a(loc) {
        let response = await fetch(loc);
        let data = await response.text();
        return data
    }

    var csvRows = (await a(s)).split('\n')
    var output = []

    for (let csvRow of csvRows) {output.push(csvRow.split(','))}

    return output

}

function classifyCSV(csvList) {

    //Each person
    for (let i=0; i < (csvList.length-2)/9; i++) {
        
        let j = 2 + i * 9
        let cPers = new person(String(csvList[j][0]).trim())

        //Each day 
        for (let k=1; k < 8; k++) {

            let day = csvList[j+k]

            //Each Lesson
            for (let z=0; z < ((day.length-1)/3); z++) {
                cPers[day[0]].push(new lesson(day[(z*3)+1], day[(z*3)+2], day[(z*3)+3]))
            }

        }

        people.push(cPers)

    }

}

// Dev tools

function rmvAllClass(str) {
    let sel = document.getElementsByClassName(str)
    for (let i=sel.length-1;i >= 0; i--) {
        sel[i].classList.remove(str);}
}

function test() {
    ret(window.innerWidth)
}

function ret(s) {
    document.getElementById("test").innerHTML += String(s) + ";<br>"
}