function makeBaseDonut() {
    //x^2 + y^2 = radius^2
    var bSize = 50;
    var pNum = 100; // 100*2*20 points
    var radius = 20;
    let skeleton = [];

    for (let i=0; i < pNum; i++) {
        // soh cah toa
        pointA = [0.5 * radius * Math.cos((Math.PI / pNum) * i), 0.5 * radius * Math.sin((Math.PI / pNum) * i)]        
        skeleton.push(pointA)
        skeleton.push([0-pointA[0], 0-pointA[1]])    
    }

    let skin = [];

    for (let i=0; i<skeleton.length; i++) {
        basePoint = skeleton[i]

        for (let j=0; j <= pNum/10; j++) {
            let currPoint = [basePoint[0] + basePoint[0]*(j/(pNum/10)), basePoint[1] + basePoint[1]*(j/(pNum/10)), pNum/20 - Math.abs(pNum/20 - j)]
            skin.push(currPoint)
        }
    }

    aPoints = Array(bSize).fill().map(() => Array(bSize).fill(0))

    for (let i=0; i<skin.length; i++) {
        let x = Math.round(bSize/2 + skin[i][0])
        let y = Math.round(bSize/2 + skin[i][1])
        aPoints[x][y] = skin[i][2]
    }

    let ascii = ''
    let imgChars = [" &nbsp", " .", " ~", " +", " !", " o", " 0", " @", " #"]
    for (let y=0; y<bSize; y++) {
        for (let x=0; x<bSize; x++) {
            if (aPoints[x][y] < 9) {ascii += imgChars[aPoints[x][y]]}
            else {ascii += imgChars[8]}
        }
        ascii += "\n"
    }
    ret("There are " + skin.length + " points on this dog-nut")
    ret(ascii)
}

function ret(x) {
    document.getElementById("dev").innerHTML += x + ";"
}

makeBaseDonut()