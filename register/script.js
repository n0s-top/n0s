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
      Authorization: `Bearer ${X3aBkSGdj-bi9djQCqJJNxwghw1smDgwMHbylcAmkJs}`
    }
  });
  const responseData = await response.json();
  if (response.status === 404) {
    alert(`The subdomain ${subdomain} is available!`);
    const subdomainUrl = `https://${subdomain}.n0s.top`;
    const confirmSubmission = confirm(`Do you want to submit ${subdomainUrl} as your subdomain?`);
    if (confirmSubmission) {
      const redirectUrl = `https://app.netlify.com/sites/${siteId}/deploys?newSiteDomain=${subdomainUrl}`;
      window.location.href = redirectUrl;
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

// Attach event listeners
const subdomainInput = document.getElementById("subdomain");
const siteIdInput = document.getElementById("siteId");
subdomainInput.addEventListener("input", disableSubmitIfEmpty);
siteIdInput.addEventListener("input", disableSubmitIfEmpty);
