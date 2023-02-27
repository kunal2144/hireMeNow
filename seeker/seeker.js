async function getJobListings() {
    let job_listings = (await axios.get('http://192.168.0.189:3000/get_job_listings')).data
    let feed = document.getElementById('feed')

    job_listings.forEach(job => {
        let job_listing = document.createElement('div')
        job_listing.classList.add('job-listing')
        job_listing.innerHTML = `
            <h1>${job.title}</h1>
            <h3>${job.description}</h3>
            <h3>Location: ${job.location}</h3>
            <hr>
            <h4>Qualifications: </h4>
            <p>${job.qualifications}</p>
        `
        feed.appendChild(job_listing)
    })
}