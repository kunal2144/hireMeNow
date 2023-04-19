document.addEventListener("DOMContentLoaded", () => {
    fetch("/job-seeker-details", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((res) => {
            setValues(res)
        })
})

function setValues(userData) {
    if (userData["0"].first_name)
        document.getElementsByName("first-name")[0].value =
            userData["0"].first_name
    if (userData["0"].middle_name)
        document.getElementsByName("second-name")[0].value =
            userData["0"].middle_name
    if (userData["0"].last_name)
        document.getElementsByName("last-name")[0].value =
            userData["0"].last_name
    document.getElementsByName("email")[0].value = userData.email
}
