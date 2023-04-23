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
    if (userData.phone)
        document.getElementsByName("phone")[0].value = userData.phone

    const firstName = document.getElementsByName("first-name")[0].value
    const middleName = document.getElementsByName("second-name")[0]
    const lastName = document.getElementsByName("last-name")[0].value

    if (firstName && lastName) middleName.placeholder = ""
}

document.getElementById("submit").onclick = updateChanges
document.getElementsByClassName("view")[0].onclick = () => showResume("text")
document.getElementsByClassName("view")[1].onclick = () => showResume("video")

function updateChanges(e) {
    e.preventDefault()
    const firstName = document.getElementsByName("first-name")[0].value
    const middleName = document.getElementsByName("second-name")[0].value
    const lastName = document.getElementsByName("last-name")[0].value
    const phone = document.getElementsByName("phone")[0].value
    const textResume = document.getElementsByName("text-resume")[0].files[0]
    const videoResume = document.getElementsByName("video-resume")[0].files[0]
    const currentPassword =
        document.getElementsByName("current-password")[0].value
    const newPassword = document.getElementsByName("new-password")[0].value
    const confirmPassword =
        document.getElementsByName("confirm-password")[0].value

    let formData = new FormData()
    formData.append("text_resume", textResume)
    formData.append("video_resume", videoResume)
    formData.append("first_name", firstName)
    formData.append("middle_name", middleName)
    formData.append("last_name", lastName)
    formData.append("phone", phone)
    formData.append("current_password", currentPassword)
    formData.append("new_password", newPassword)
    formData.append("confirm_password", confirmPassword)

    if (!valid(formData)) return

    fetch("/update-profile", {
        method: "POST",
        body: formData,
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

function valid(user) {
    let phoneRegex = /^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$/
    let passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

    if (!user.get("first_name")) {
        alert("First name is required")
        return false
    }
    if (!user.get("last_name")) {
        alert("Last name is required")
        return false
    }
    if (!user.get("phone")) {
        alert("Phone number is required")
        return false
    } else if (!phoneRegex.test(user.get("phone"))) {
        alert("Phone number is invalid")
        return false
    } else if (
        user.get("current_password") ||
        user.get("new_password") ||
        user.get("confirm_password")
    ) {
        if (!user.get("current_password")) {
            alert("Current password is required")
            return false
        }
        if (!user.get("new_password")) {
            alert("New password is required")
            return false
        }
        if (!user.get("confirm_password")) {
            alert("Confirm password is required")
            return false
        }
        if (user.get("new_password") != user.get("confirm_password")) {
            alert("Passwords do not match")
            return false
        }
        if (!passwordRegex.test(user.get("new_password"))) {
            alert(
                "Password must contain: \n1 Capital Letter\n1 Small Letter\n1 Special Character\nMinimum 8 Characters"
            )
            return false
        }
        if (!passwordRegex.test(user.get("current_password"))) {
            alert("Incorrect password")
            return false
        }
    }

    return true
}

function showResume(resume) {
    if (resume == "text") {
        fetch("/text-resume")
            .then((response) => {
                if (response.status == 404) {
                    alert("No text resume found")
                    return ""
                } else if (response.status == 500) {
                    alert("Internal Server Error")
                    return ""
                }
                return response.text()
            })
            .then((url) => {
                if (url == "") return
                fetch(url)
                    .then((response) => response.blob())
                    .then((blob) => {
                        const url = URL.createObjectURL(blob)
                        const newWindow = window.open(url, "_blank")
                    })
                    .catch((error) =>
                        console.error("Failed to download file:", error)
                    )
            })
    } else {
        fetch("/video-resume")
            .then((response) => {
                if (response.status == 404) {
                    alert("No video resume found")
                    return ""
                } else if (response.status == 500) {
                    alert("Internal Server Error")
                    return ""
                }
                return response.text()
            })
            .then((url) => {
                window.open(url, "_blank") //For now
            })
    }
}
