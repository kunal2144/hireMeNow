const emailRegex =
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const email = document.getElementById("email")
const password = document.getElementById("password")

function liveValidate() {
    if (email.value != "") {
        if (emailRegex.test(email.value)) {
            email.style.borderColor = "green"
        } else {
            email.style.borderColor = "red"
        }
    }
}

function guestCredentials() {
    email.value = "jkunal2144@gmail.com"
    password.value = "Test@123"
}

function handleSubmission(e) {
    e.preventDefault()
    if (validate()) {
        loginUser()
    }
}

function validate() {
    if (email.value == "" || password.value == "") {
        alert("Please fill all the fields")
        return false
    }

    if (!emailRegex.test(email.value)) {
        return false
    }

    if (!passwordRegex.test(password.value)) {
        alert("Invalid Email or Password")
        return false
    }

    return true
}

function loginUser() {
    const data = {
        email: email.value,
        password: password.value,
    }
    fetch("/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    }).then((res) => {
        if (res.status == 404) {
            password.value = ""
            email.value = ""
            alert("Email does not exist, sign up.")
        } else if (res.status == 500) {
            alert("Something went wrong")
        } else if (res.status == 401) {
            password.value = ""
            alert("Invalid Password")
        } else {
            window.location.href = "/seeker"
        }
    })
}
