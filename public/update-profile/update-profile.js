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

document.getElementById("submit").onclick = updateChanges

function updateChanges(e) {
    e.preventDefault()
    const firstName = document.getElementsByName("first-name")[0].value
    const middleName = document.getElementsByName("second-name")[0].value
    const lastName = document.getElementsByName("last-name")[0].value
    const currentPassword =
        document.getElementsByName("current-password")[0].value
    const newPassword = document.getElementsByName("new-password")[0].value
    const confirmPassword =
        document.getElementsByName("confirm-password")[0].value

    // if (newPassword != confirmPassword) {
    //     alert("Passwords do not match")
    //     return false
    // }

    fetch("/update-profile", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
        }),
    })
        .then((res) => res.json())
        .then((res) => {
            if (res.Error) {
                alert(res.Error)
            } else {
                alert("Profile updated successfully")
            }
        })
}
