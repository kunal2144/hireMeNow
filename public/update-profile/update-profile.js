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
    if (userData.first_name)
        document.getElementsByName("first-name")[0].value = userData.first_name
    if (userData.middle_name)
        document.getElementsByName("second-name")[0].value =
            userData.middle_name
    if (userData.last_name)
        document.getElementsByName("last-name")[0].value = userData.last_name
    document.getElementsByName("email")[0].value = userData.email
}
