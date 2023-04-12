import config from "../config.js"

const SERVER_URL = config.SERVER_URL

document.addEventListener("DOMContentLoaded", getJobListings)
document.addEventListener("DOMContentLoaded", () => {})
document.addEventListener("DOMContentLoaded", setFilterCatgories)
document.addEventListener("DOMContentLoaded", setFilterLocations)
document.addEventListener("DOMContentLoaded", () => {
    let today = new Date()
    let dd = String(today.getDate()).padStart(2, "0")
    let mm = String(today.getMonth() + 1).padStart(2, "0")
    let yyyy = today.getFullYear()
    today = yyyy + "-" + mm + "-" + dd
    document.getElementById("filter-start-date").value = today
})

document.getElementById("filter-salary").oninput = () => {
    let salary = document.getElementById("filter-salary").value
    salary = salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    document.getElementById("salary").innerHTML = salary
}

document.getElementById("search").addEventListener("keyup", async () => {
    let search = document.getElementById("search").value
    let jobListings = document.getElementsByClassName("job-listing")
    let feed = document.getElementById("job-listings")

    let jobs = (
        await axios.get(
            `http://${SERVER_URL}/get_job_listings?search=${search}`
        )
    ).data

    Array.from(jobListings).forEach((jobListing) => {
        jobListing.style.display = "none"
    })

    jobs = jobs.forEach((job) => {
        job = jobToHTML(job)
        feed.appendChild(job)
    })
})

document.getElementById("filter-categories").onchange = () => {
    let category = document.getElementById("filter-categories").value
    let jobListings = document.getElementsByClassName("job-listing")
    jobListings.forEach((jobListing) => {
        let title = jobListing.getElementsByTagName("h1")[0].innerHTML
        if (title.toLowerCase().includes(category.toLowerCase())) {
            jobListing.style.display = "block"
        } else {
            jobListing.style.display = "none"
        }
    })
}

async function getJobListings() {
    let feed = document.getElementById("job-listings")

    let jobListingPlaceholder = document.getElementById(
        "job-listing-placeholder"
    )
    for (let i = 0; i < 10; i++) {
        feed.appendChild(jobListingPlaceholder.content.cloneNode(true))
    }

    let jobListings = (await axios.get(`http://${SERVER_URL}/get_job_listings`))
        .data

    feed.innerHTML = ""

    jobListings.forEach((job) => {
        job = jobToHTML(job)
        feed.appendChild(job)
    })
}

function jobToHTML(job) {
    let jobListing = document.createElement("div")
    jobListing.onclick = () => {
        window.open(`http://${SERVER_URL}/job_listing/${job.id}`, "_blank")
    }
    jobListing.classList.add("job-listing")
    jobListing.innerHTML = `
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
                    <div class="col">
                        <h4><img
                                src="../assets/images/date.png"
                                alt="Apply by.png"
                            />Apply By</h4>
                        <h4>${job.apply_by}</h4>
                    </div>
                </div>
            </div>
            <h4 style=" color: ${job.status == "Open" ? "green" : "red"};">
                ${job.status}
            </h4>
        `
    return jobListing
}

function setFilterCatgories() {
    let filterCategories = document.getElementById("filter-categories")
    let categories = [
        "Software Engineering",
        "Data Science",
        "Web Development",
        "Mobile Development",
        "UI/UX",
        "Product Management",
        "Sales",
        "Marketing",
        "Operations",
        "Finance",
        "Legal",
        "Human Resources",
    ]

    categories.forEach((category) => {
        let categoryElement = document.createElement("option")
        categoryElement.value = category
        categoryElement.innerHTML = category
        filterCategories.appendChild(categoryElement)
    })
}

function setFilterLocations() {
    let filterLocations = document.getElementById("filter-locations")
    let locations = [
        "Mumbai",
        "Delhi",
        "Bangalore",
        "Hyderabad",
        "Ahmedabad",
        "Chennai",
        "Kolkata",
        "Surat",
        "Pune",
        "Jaipur",
        "Lucknow",
        "Kanpur",
        "Nagpur",
        "Visakhapatnam",
    ]

    locations.forEach((location) => {
        let locationElement = document.createElement("option")
        locationElement.value = location
        locationElement.innerHTML = location
        filterLocations.appendChild(locationElement)
    })
}
