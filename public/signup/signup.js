const emailRegex =
    /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

const email = document.getElementById("email")
const password = document.getElementById("password")
const confirmPassword = document.getElementById("confirm-password")
const type = document.getElementById("type")

function handleSubmission(e) {
    e.preventDefault()
    if (validate()) {
        registerUser()
    }
}

function liveValidate() {
    if (email.value != "") {
        if (emailRegex.test(email.value)) {
            email.style.borderColor = "green"
        } else {
            email.style.borderColor = "red"
        }
    }

    if (password.value != "") {
        if (passwordRegex.test(password.value)) {
            password.style.borderColor = "green"
        } else {
            password.style.borderColor = "red"
        }
    }

    if (confirmPassword.value != "") {
        if (password.value === confirmPassword.value) {
            if (password.style.borderColor != "red")
                confirmPassword.style.borderColor = "green"
        } else {
            confirmPassword.style.borderColor = "red"
        }
    }
}

function validate() {
    if (
        email.value == "" ||
        type.value == "account-type" ||
        password.value == "" ||
        confirmPassword == ""
    ) {
        alert("Please fill all the fields")
        return false
    }

    if (!emailRegex.test(email.value)) {
        return false
    }

    if (!passwordRegex.test(password.value)) {
        alert(
            "Password must contain: \n1 Capital Letter\n1 Small Letter\n1 Special Character\nMinimum 8 Characters"
        )
        return false
    }

    if (password.value !== confirmPassword.value) {
        return false
    }

    return true
}

function registerUser() {
    window.open("/seeker", "_self")
}
