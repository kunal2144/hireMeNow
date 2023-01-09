const outputResumeEl = document.getElementById("output-resume")
const inputResumeEl = document.getElementById("input-resume")

const API = "http://127.0.0.1:8080/json-resume"
const xhr = new XMLHttpRequest();

xhr.withCredentials = true

xhr.addEventListener("readystatechange", function() {
    if(this.readyState === 4) {
        let data = JSON.parse(this.response)
        outputResumeEl.value = data.message
    }
  });

async function convert() {
    const input = inputResumeEl.value

    xhr.open("GET", API);
    xhr.setRequestHeader("Content-Type", "application/json");
    console.log(JSON.stringify({"resume": input}))
    xhr.send({
        "resume": input
    }) ;
}

