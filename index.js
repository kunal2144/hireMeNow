const outputResumeEl = document.getElementById("output-resume")
const inputResumeEl = document.getElementById("input-resume")

const API = "http://127.0.0.1:8080/json-resume"
const xhr = new XMLHttpRequest();

xhr.withCredentials = true

xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
        let data = JSON.parse(this.response)
        outputResumeEl.value = JSON.stringify(data["json-resume"], null, 2)
    }
});

async function convert() {
    const input = inputResumeEl.value

    if(!input) return alert("Please enter a resume!")

    xhr.open("POST", API);
    xhr.setRequestHeader("Content-Type", "text/plain")
    xhr.send(input);
}

