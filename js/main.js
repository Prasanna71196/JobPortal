// ===== Job Saving & Filtering =====


// Save Job to localStorage
function saveJob(jobId) {
  let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
  if (!savedJobs.includes(jobId)) {
    savedJobs.push(jobId);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    alert('Job saved!');
  } else {
    alert('Job already saved.');
  }
}


// Filter Jobs by category/location dropdowns
function filterJobs() {
  const category = document.getElementById('categoryFilter').value;
  const location = document.getElementById('locationFilter').value;
  document.querySelectorAll('.job-card').forEach(card => {
    const matchesCategory = !category || card.dataset.category === category;
    const matchesLocation = !location || card.dataset.location === location;
    card.style.display = (matchesCategory && matchesLocation) ? '' : 'none';
  });
}

function redirectToJobs(element) {
    const category = element.getAttribute('data-category');
    // Redirect to jobs.html with category as URL param
    window.location.href = `jobs.html?category=${encodeURIComponent(category)}`;
  }

// ===== Login/Register Form Toggle & Validation =====


// Toggle Login/Register form visibility and button active states
function toggleForm(showRegister) {
  document.getElementById('loginForm').style.display = showRegister ? 'none' : 'block';
  document.getElementById('registerForm').style.display = showRegister ? 'block' : 'none';

  document.getElementById('loginBtn')?.classList.toggle('active', !showRegister);
  document.getElementById('registerBtn')?.classList.toggle('active', showRegister);
}


// Validate Login/Register forms on submit
function validateAuthForm(e, isRegister) {
  e.preventDefault();

  let valid = true, msg = '';
  const form = e.target;
  const email = form.email.value.trim();
  const name = isRegister ? form.name.value.trim() : '';

  if (!email) { valid = false; msg += 'Email is required.\n'; }
  if (isRegister && !name) { valid = false; msg += 'Name is required.\n'; }

  if (!valid) {
    alert(msg);
    return false;
  }

  alert(isRegister ? 'Registered successfully!' : 'Logged in successfully!');
  form.reset();
  return true;
}


// ===== Resume File Validation =====


// Check selected resume file type and size
function validateResume(fileInput) {
  const file = fileInput.files[0];
  if (!file) return true;

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  if (!allowedTypes.includes(file.type)) {
    alert('Only PDF, DOC, and DOCX files are allowed.');
    fileInput.value = '';
    return false;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert('File size must be under 2MB.');
    fileInput.value = '';
    return false;
  }

  return true;
}


// ===== Helper for Job Details Page (optional) =====


// Extract job ID from query parameter
function getJobIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}


// Load job details dynamically (example data can be replaced by API or JSON)
function loadJobDetails() {
  const jobsData = {
    job1: {
      title: "Front-End Developer",
      company: "StackBit",
      location: "Delhi",
      description: `
        <p>We are looking for a passionate Front-End Developer to join our team.</p>
        <ul>
          <li>Build user-friendly web applications.</li>
          <li>Collaborate with designers and backend developers.</li>
          <li>Strong knowledge of HTML, CSS, JavaScript.</li>
        </ul>`
    },
    job2: {
      title: "Marketing Specialist",
      company: "MarketWise",
      location: "Mumbai",
      description: `
        <p>Join our marketing team to create and implement strategies.</p>
        <ul>
          <li>Manage social media channels.</li>
          <li>Conduct market research.</li>
          <li>Coordinate campaigns and events.</li>
        </ul>`
    },
  };

  const jobId = getJobIdFromUrl();
  const container = document.getElementById('jobDetails');
  if (container && jobId && jobsData[jobId]) {
    const job = jobsData[jobId];
    container.innerHTML = `
      <h2>${job.title}</h2>
      <p><strong>Company:</strong> ${job.company}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <div>${job.description}</div>
    `;
  } else if (container) {
    container.innerHTML = `<p>Job not found.</p>`;
  }
}


// Validate and submit job application form
function validateApplyForm(e) {
  e.preventDefault();

  const name = document.getElementById('applicantName').value.trim();
  const email = document.getElementById('applicantEmail').value.trim();
  const resume = document.getElementById('resume');

  if (!name || !email) {
    alert('Name and Email are required.');
    return false;
  }

  if (!validateResume(resume)) {
    return false;
  }

  alert('Application submitted successfully!');
  e.target.reset();
  return true;
}


// ===== Initialization for Pages =====


document.addEventListener('DOMContentLoaded', () => {
  // For job details page
  if(document.getElementById('jobDetails')) {
    loadJobDetails();
  }

  // For login/register toggle buttons (if they exist)
  if(document.getElementById('loginBtn') && document.getElementById('registerBtn')) {
    document.getElementById('loginBtn').addEventListener('click', () => toggleForm(false));
    document.getElementById('registerBtn').addEventListener('click', () => toggleForm(true));
  }

  // For jobs page: Check URL for category param and apply filter
  if (window.location.pathname.endsWith('jobs.html')) {
    const params = new URLSearchParams(window.location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl) {
      const categorySelect = document.getElementById('categoryFilter');
      if (categorySelect) {
        categorySelect.value = categoryFromUrl;
      }

      // Reset location filter to empty (show all locations)
      const locationSelect = document.getElementById('locationFilter');
      if (locationSelect) {
        locationSelect.value = '';
      }

      // Apply the filter with selected category
      filterJobs();
    }
  }
});
