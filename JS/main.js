const cookieVars = new Object()

function init() {
    document.getElementsByTagName("body").item(0).style.overflow = "hidden" //Y
    document.querySelector(':root').style.setProperty('--mh', String(window.innerHeight) + "px")
    if (!(document.cookie.includes('theme'))) {document.cookie = "theme=dark; expires=Wed, 25 Dec 2030 23:59:59 UTC; path=/"}
    parseCookie()
    swapTheme(cookieVars.theme)
}

function parseCookie() {

    if (document.cookie == "") {

        cookieVars["theme"] = "light"

    } else {

        cList = document.cookie.split(";")

        for (let cStr of cList) {
            ret(cStr)
            cookieVars[cStr.split("=")[0].trim()] = cStr.split("=")[1].trim()
        }

    }

}

function cCookie(varNam, varVal, path) {

    if (path == null) {path = '/'}

    cookieVars[varNam] = varVal
    //cStr = ''
    
    //for (let cVar of Object.keys(cookieVars)) {
    //    cStr += cVar + '=' + cookieVars[cVar] + '; '
    //}
    
    //cStr += 'path=' + path + '; expires=Wed, 25 Dec 2030 23:59:59 UTC'

    document.cookie = varNam + '=' + varVal + '; path=/; expires=Wed, 25 Dec 2030 23:59:59 UTC'

}

function scrollBox(i) {
    if (document.documentElement.clientHeight*(i*0.8) > window.scrollY + 1) {
        window.scrollTo(0, document.documentElement.clientHeight*(0.85*i))
    } else {
        window.scrollTo(0, document.documentElement.clientHeight*((i-1)*0.85))
    }
}

function swapTheme(to) {

    optLst = ['dark', 'light']
    
    if (document.getElementById("theme").href.includes(cookieVars['theme']) && (to == null)) {
        for (const [index, element] of optLst.entries()) {
            if (document.getElementById("theme").href.includes(element)) {
                if (index < optLst.length - 1) {to = optLst[index + 1]} 
                else {to = optLst[0]}
            }
        }
        cCookie('theme', to)
    } else {
        to = cookieVars['theme']
    }

    document.getElementById("theme").href = "/CSS/" + to + ".css"

}