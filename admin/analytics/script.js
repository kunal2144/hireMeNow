const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i => {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});

// TOGGLE SIDEBAR
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
})


const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if (window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if (searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})


if (window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if (this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})


const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if (this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
})

async function getJobListings() {
	let jobListings = (await axios.get("http://127.0.0.1:3000/get_job_listings")).data;
	let tab = document.getElementById("tab");

	let jobListingTable = document.createElement("table");
	jobListingTable.classList.add("job-listing-table");

	// Create the table header
	let tableHeader = document.createElement("thead");
	let headerRow = document.createElement("tr");

	let titleHeader = document.createElement("th");
	titleHeader.innerHTML = "Title";
	let descriptionHeader = document.createElement("th");
	descriptionHeader.innerHTML = "Company";
	let locationHeader = document.createElement("th");
	locationHeader.innerHTML = "Location";
	let qualificationsHeader = document.createElement("th");
	qualificationsHeader.innerHTML = "Qualifications";
	let statusHeader = document.createElement("th");
	statusHeader.innerHTML = "Status";

	headerRow.appendChild(titleHeader);
	headerRow.appendChild(descriptionHeader);
	headerRow.appendChild(locationHeader);
	headerRow.appendChild(qualificationsHeader);
	headerRow.appendChild(statusHeader);
	tableHeader.appendChild(headerRow);
	jobListingTable.appendChild(tableHeader);


	// Create the table body
	let tableBody = document.createElement("tbody");
	jobListings.forEach((job) => {
		let jobRow = document.createElement("tr");
		let titleCell = document.createElement("td");
		titleCell.innerHTML = job.title;
		let descriptionCell = document.createElement("td");
		descriptionCell.innerHTML = job.company;
		let locationCell = document.createElement("td");
		locationCell.innerHTML = job.location;
		let qualificationsCell = document.createElement("td");
		qualificationsCell.innerHTML = job.qualifications.replaceAll(";", "</br>");
		let statusCell = document.createElement("td");
		statusCell.innerHTML = job.status;

		if (job.status == "Open") {
			statusCell.style.color = "green";
		} else {
			statusCell.style.color = "red";
		}

		jobRow.appendChild(titleCell);
		jobRow.appendChild(descriptionCell);
		jobRow.appendChild(locationCell);
		jobRow.appendChild(qualificationsCell);
		jobRow.appendChild(statusCell);
		tableBody.appendChild(jobRow);
	});
	jobListingTable.appendChild(tableBody);
	tab.appendChild(jobListingTable);
}

const downloadButton = document.getElementById('download-btn');
downloadButton.addEventListener('click', () => {
	const element = document.getElementById('tab');
	const options = {
		filename: 'my-pdf-document.pdf',
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2 },
		jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
	};

	html2pdf().set(options).from(element).save();
});