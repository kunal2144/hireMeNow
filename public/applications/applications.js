import config from "../config.js"

const SERVER_URL = config.SERVER_URL

document.addEventListener("DOMContentLoaded", getApplications)
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

function getApplications() {
    fetch("/get-applications", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            console.log(res)
            setApplications(res)
        })
}

function setApplications(applications) {
    let feed = document.getElementById("job-applications")

    feed.innerHTML = ""

    applications.forEach((job) => {
        job = jobToHTML(job)
        feed.appendChild(job)
    })
}

function jobToHTML(job) {
    let jobApplication = document.createElement("div")
    jobApplication.onclick = () => {
        window.open(`http://${SERVER_URL}/job_listing/${job.id}`, "_blank")
    }
    jobApplication.classList.add("job-listing")
    jobApplication.innerHTML = `
            <h1>${job.title}</h1>
            <h3>${job.description}</h3>
            <h3><img src="../../assets/images/location.png"/>${
                job.location
            }</h3>
            <hr>
            <div id="details">
                <div class="row">
                    <div class="col">
                        <h4><img
                                src="../assets/images/date.png"
                                alt="start date.png"
                            />Start Date</h4>
                        <h4>${job.start_date}</h4>
                    </div>
                    <div class="col">
                        <h4><img
                                src="../assets/images/money.png"
                                alt="money.png"
                            />CTC</h4>
                        <h4>${job.ctc}</h4>
                    </div>
                </div>
            </div>
            <h4 style=" color: ${job.status == "Open" ? "green" : "red"};">
                ${job.status}
            </h4>
        `
    return jobApplication
}
