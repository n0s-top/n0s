// Wait for the DOM to be loaded
document.addEventListener('DOMContentLoaded', () => {

  // Get the form element
  const form = document.querySelector('form');

  // Add an event listener to the form
  form.addEventListener('submit', event => {
    event.preventDefault();

    // Get the values of the subdomain and siteId inputs
    const subdomain = document.getElementById('subdomain').value;
    const siteId = document.getElementById('siteId').value;

    // Replace "your-access-token" with your actual Netlify API access token
    const ACCESS_TOKEN = 'X3aBkSGdj-bi9djQCqJJNxwghw1smDgwMHbylcAmkJs';

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
          console.log(`Custom domain ${subdomain}.n0s.top added successfully!`);
        } else {
          throw new Error(`Error adding custom domain: ${response.statusText}`);
        }
      })
      .catch(error => console.error(error));
  });
});
