document.getElementById("toggle-navbar").onclick = () => {
    document.getElementById("mySidebar").style.width = "250px"
}

document.getElementById("toggle-navbar-xl").onclick = () => {
    document.getElementById("mySidebar").style.width = "250px"
    document.getElementById("toggle-navbar-xl").style.display = "none"
}

document.getElementById("closebtn").onclick = () => {
    document.getElementById("mySidebar").style.width = "0"
    if (window.innerWidth >= 885) {
        document.getElementById("toggle-navbar-xl").style.display = "block"
    }
}
