document.addEventListener('DOMContentLoaded', () => {

  const form = document.querySelector('form');
  const submitButton = form.querySelector('button[type="submit"]');
  const subdomainInput = document.getElementById('subdomain');
  const siteIdInput = document.getElementById('siteId');
  const message = document.getElementById('message');

  submitButton.addEventListener('click', event => {
    event.preventDefault();

    const subdomain = subdomainInput.value;
    const siteId = siteIdInput.value;
    const ACCESS_TOKEN = 'X3aBkSGdj-bi9djQCqJJNxwghw1smDgwMHbylcAmkJs';

    // Disable the submit button to prevent multiple submissions
    submitButton.disabled = true;

    // Send a request to check the availability of the subdomain
    fetch(`https://api.netlify.com/api/v1/sites/${siteId}/domains/check?hostname=${subdomain}.n0s.top`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.available) {
          message.textContent = `Subdomain ${subdomain}.n0s.top is available. Adding custom domain...`;

          // Send a request to the Netlify API to add the custom domain
          fetch(`https://api.netlify.com/api/v1/sites/${siteId}/domains`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hostname: `${subdomain}.n0s.top` })
          })
            .then(response => {
              if (response.ok) {
                message.textContent = `Custom domain ${subdomain}.n0s.top added successfully!`;
              } else {
                throw new Error(`Error adding custom domain: ${response.statusText}`);
              }
            })
            .catch(error => {
              message.textContent = `Error adding custom domain: ${error}`;
              console.error(error);
            });
        } else {
          message.textContent = `Subdomain ${subdomain}.n0s.top is not available. Please try another subdomain.`;
        }
      })
      .catch(error => {
        message.textContent = `Error checking subdomain availability: ${error}`;
        console.error(error);
      })
      .finally(() => {
        // Enable the submit button after the request has completed
        submitButton.disabled = false;
      });
  });
});
