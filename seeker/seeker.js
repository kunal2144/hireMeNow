async function getJobListings() {
    let jobListings = (
        await axios.get("http://192.168.0.189:3000/get_job_listings")
    ).data
    let feed = document.getElementById("feed")

    let jobListingElements = jobListings.map((job) => {
        let jobListing = document.createElement("div")
        jobListing.classList.add("job-listing")
        jobListing.innerHTML = `
            <h1>${job.title}</h1>
            <h3>${job.description}</h3>
            <h3>${"Location: ".concat(job.location)}</h3>
            <hr>
            <h4>Qualifications: </h4>
            <p>${job.qualifications.replaceAll(";", "</br>").toString()}</p>
            <h4 style=" color: ${job.status == "Open" ? "green" : "red"};">
                ${job.status == "Open" ? "Active" : "Closed"}
            </h4>
        `
        return jobListing
    })

    jobListingElements.forEach((jobListingElement) => {
        feed.appendChild(jobListingElement)
    })
}
