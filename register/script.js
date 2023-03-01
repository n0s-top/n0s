let NETLIFY_ACCESS_TOKEN = 'X3aBkSGdj-bi9djQCqJJNxwghw1smDgwMHbylcAmkJs'; // Replace with your netlify access token
let MAIN_DOMAIN = 'n0s.top'; // Replace with your main domain
let PROXY_SERVER = 'https://cors-anywhere.herokuapp.com/'; // Proxy server to bypass CORS restriction

function checkAvailability() {
  const subdomain = document.getElementById("subdomain").value;
  const siteId = document.getElementById("siteId").value;

  if (subdomain.trim() === "") {
    alert("Please enter a subdomain name.");
    return false;
  }

  if (siteId.trim() === "") {
    alert("Please enter a Netlify site ID.");
    return false;
  }

  const request = new XMLHttpRequest();
  request.open("GET", `${PROXY_SERVER}https://${subdomain}.n0s.top`, true);
  request.withCredentials = true;

  request.onload = function() {
    if (request.status === 404 || request.status === 0) {
      const request2 = new XMLHttpRequest();
      request2.open("PUT", `https://api.netlify.com/api/v1/sites/${siteId}/subdomains/${subdomain}`);
      request2.setRequestHeader("Content-Type", "application/json");
      request2.setRequestHeader("Authorization", `Bearer ${NETLIFY_ACCESS_TOKEN}`);

      request2.onload = function() {
        if (request2.status === 200) {
          const request3 = new XMLHttpRequest();
          request3.open("POST", `https://api.netlify.com/api/v1/dns_zones/${MAIN_DOMAIN}/dns_records`);
          request3.setRequestHeader("Content-Type", "application/json");
          request3.setRequestHeader("Authorization", `Bearer ${NETLIFY_ACCESS_TOKEN}`);

          request3.onload = function() {
            if (request3.status === 200) {
              alert(`Subdomain ${subdomain}.n0s.top has been created and linked to your Netlify site, and DNS record has been added for ${subdomain}.${MAIN_DOMAIN}.`);
              location.reload();
            } else {
              alert(`Failed to add DNS record for ${subdomain}.${MAIN_DOMAIN}.`);
            }
          }

          request3.send(JSON.stringify({
            type: "CNAME",
            hostname: subdomain,
            value: `${subdomain}.n0s.top`
          }));
        } else {
          alert(`Failed to link subdomain ${subdomain}.n0s.top to your Netlify site.`);
        }
      }

      request2.send(JSON.stringify({
        subdomain: subdomain,
        domain: "n0s.top"
      }));
    } else {
      alert(`Subdomain ${subdomain}.n0s.top already exists. Please choose another subdomain name.`);
    }
  };

  request.onerror = function() {
    alert(`Failed to check subdomain availability for ${subdomain}.n0s.top.`);
  };

  request.send();

  return false;
}
