function checkAvailability() {
  const subdomainInput = document.getElementById("subdomain");
  const siteIdInput = document.getElementById("siteId");
  const subdomain = subdomainInput.value;
  const siteId = siteIdInput.value;
  const submitButton = document.getElementById("submit");

  if (subdomain.length < 1) {
    alert("Please enter a subdomain name");
    return false;
  }

  if (siteId.length < 1) {
    alert("Please enter a Netlify site ID");
    return false;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Checking availability...";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", `https://${subdomain}.n0s.top`, true);
  xhr.onload = () => {
    submitButton.disabled = false;
    submitButton.textContent = "Check Availability and Submit";
    if (xhr.status === 404) {
      window.location.href = `https://app.netlify.com/sites/${siteId}/settings/domain#custom-domains`;
    } else {
      alert("Subdomain is not available");
    }
  };
  xhr.onerror = () => {
    submitButton.disabled = false;
    submitButton.textContent = "Check Availability and Submit";
    alert("There was an error checking the subdomain availability");
  };
  xhr.send();

  return false;
}
