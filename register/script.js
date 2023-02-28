let NETLIFY_ACCESS_TOKEN = 'X3aBkSGdj-bi9djQCqJJNxwghw1smDgwMHbylcAmkJs';

// Function to check subdomain availability
async function checkAvailability() {
  event.preventDefault();
  const subdomainInput = document.getElementById("subdomain");
  const siteIdInput = document.getElementById("siteId");
  const subdomain = subdomainInput.value;
  const siteId = siteIdInput.value;
  const apiUrl = `https://api.netlify.com/api/v1/sites/${siteId}/subdomains/${subdomain}`;
  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${NETLIFY_ACCESS_TOKEN}`
    }
  });
  const responseData = await response.json();
  if (response.status === 404) {
    alert(`The subdomain ${subdomain} is available!`);
    const subdomainUrl = `https://${subdomain}.n0s.top`;
    const confirmSubmission = confirm(`Do you want to submit ${subdomainUrl} as your subdomain?`);
    if (confirmSubmission) {
      createSubdomain(siteId, subdomain); // Call the createSubdomain function
    }
  } else {
    alert(`The subdomain ${subdomain} is already taken. Please choose a different subdomain.`);
  }
}

// Function to prevent submission when either input field is empty
function disableSubmitIfEmpty() {
  const subdomainInput = document.getElementById("subdomain");
  const siteIdInput = document.getElementById("siteId");
  const submitButton = document.getElementById("submit");
  if (subdomainInput.value === "" || siteIdInput.value === "") {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
}

// Function to create a new subdomain on Netlify
async function createSubdomain(siteId, subdomain) {
  const apiUrl = `https://api.netlify.com/api/v1/sites/${siteId}/subdomains`;
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NETLIFY_ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      hostname: subdomain
    })
  });
  if (response.ok) {
    alert(`The subdomain ${subdomain} has been created!`);
    const subdomainUrl = `https://${subdomain}.n0s.top`;
    const confirmSubmission = confirm(`Do you want to submit ${subdomainUrl} as your subdomain?`);
    if (confirmSubmission) {
      const redirectUrl = `https://app.netlify.com/sites/${siteId}/deploys?newSiteDomain=${subdomainUrl}`;
      window.location.href = redirectUrl;
    }
  } else {
    const responseData = await response.json();
    alert(`Failed to create the subdomain. Error message: ${responseData.message}`);
  }
}

// Attach event listeners
const subdomainInput = document.getElementById("subdomain");
const siteIdInput = document.getElementById("siteId");
const accessTokenInput = document.getElementById("accessToken");
const submitButton = document.getElementById("submit");
subdomainInput.addEventListener("input", disableSubmitIfEmpty);
siteIdInput.addEventListener("input", disableSubmitIfEmpty);
accessTokenInput.addEventListener("input", () => {
  NETLIFY_ACCESS_TOKEN = accessTokenInput.value;
});
submitButton.addEventListener("click", checkAvailability);
