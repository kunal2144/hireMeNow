let coverLetter = document.getElementsByTagName("textarea")[0]

coverLetter.onkeyup = (e) => {
    let characterCount = e.target.value.length
    document.getElementById("current").innerHTML = characterCount
}

function handleApply(e) {
    e.preventDefault()
    if (coverLetter.value.length < 200) {
        alert("Cover letter must be at least 200 characters")
        return
    }
    const jobID = window.location.pathname.split("/")[2]
    const data = {
        cover_letter: coverLetter.value,
        job_id: jobID,
    }
    fetch("/apply/" + jobID, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((data) => {
            if (!data.error) {
                alert("Applied Successfully")
                window.location.href = "/seeker"
            } else {
                alert("Error applying to job")
            }
        })
}
