async function getJobListings() {
    let jobListings = (
        await axios.get("http://192.168.0.189:3000/get_job_listings")
    ).data
    let feed = document.getElementById("feed")

    let jobListingElements = jobListings.map((job) => {
        let jobListing = document.createElement("div")
        jobListing.onclick = () => {
            window.open(`http://127.0.0.1:3000/job_listing/${job.id}`, "_blank")
        }
        jobListing.classList.add("job-listing")
        jobListing.innerHTML = `
            <h1>${job.title}</h1>
            <h3>${job.description}</h3>
            <h3>${"Location: ".concat(job.location)}</h3>
            <hr>
            <h4>Qualifications: </h4>
            <p>${job.qualifications.replaceAll(";", "</br>").toString()}</p>
            <h4 style=" color: ${job.status == "Open" ? "green" : "red"};">
                ${job.status}
            </h4>
        `
        return jobListing
    })

    jobListingElements.forEach((jobListingElement) => {
        feed.appendChild(jobListingElement)
    })
}

// window.onscroll = function () {
//     filterSticky()
// }

// let filters = document.getElementById("filters")
// let sticky = filters.offsetTop

// function filterSticky() {
//     if (window.pageYOffset > sticky) {
//         header.classList.add("sticky")
//     } else {
//         header.classList.remove("sticky")
//     }
// }
