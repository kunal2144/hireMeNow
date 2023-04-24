import config from "../config.js"

const SERVER_URL = config.SERVER_URL

document.addEventListener("DOMContentLoaded", getListings)
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

document.getElementById("logout").onclick = () => {
    fetch("/logout", {
        method: "GET",
    }).then((window.location.href = "/"))
}

function getListings() {
    fetch("/get-listings", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            setListings(res)
        })
}

function setListings(listings) {
    let feed = document.getElementById("job-applications")

    feed.innerHTML = ""

    let addListing = document.createElement("div")
    addListing.classList.add("job-listing")
    addListing.classList.add("add-listing")
    addListing.innerHTML = `
        <h2> + Click to add a listing</h2>
    `
    feed.appendChild(addListing)

    listings.forEach((listing) => {
        listing = listingToHTML(listing)
        feed.appendChild(listing)
    })

    let deleteButtons = document.getElementsByClassName("delete")
    for (let i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].onclick = deleteListing
    }
}

function deleteListing(event) {
    if (!confirm("Are you sure you want to delete this listing?")) return
    event.stopPropagation()
    let id = event.target.parentNode.parentNode.id
    fetch("/delete-listing", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id,
        }),
    }).then((res) => {
        if (res.status == 200) {
            alert("Deleted successfully")
            getListings()
        }
    })
}

function listingToHTML(listing) {
    let listingDiv = document.createElement("div")
    listingDiv.id = listing.id
    listingDiv.classList.add("job-listing")
    listingDiv.innerHTML = `
            <h1>${listing.title} <img class="delete" src="../../assets/images/delete.png" style="float:right;"/> <img class="edit" src="../../assets/images/edit.png" style="float:right;"/> </h1>
            <h3>${listing.description}</h3>
            <h3><img src="../../assets/images/location.png"/>${listing.location}</h3>
            <hr>
            <div id="details">
                <div class="row">
                    <div class="col">
                        <h4><img
                                src="../assets/images/date.png"
                                alt="start date.png"
                            />Start Date</h4>
                        <h4>${listing.start_date}</h4>
                    </div>
                    <div class="col">
                        <h4><img
                                src="../assets/images/money.png"
                                alt="money.png"
                            />CTC</h4>
                        <h4>${listing.ctc}</h4>
                    </div>
                </div>
            </div>
        `
    //         <h4 style=" color: ${job.status == "Open" ? "green" : "red"};">
    //     ${job.status}
    // </h4>
    return listingDiv
}
