let NETLIFY_ACCESS_TOKEN = 'n18Tpc5udXPdeZ3BDf2q3mx-RiFPrZucsaBRSLDHksg'; // Replace with your Netlify access token
let MAIN_DOMAIN = 'n0s.top'; // Replace with your main domain
let PROXY_SERVER = 'https://cors-anywhere.herokuapp.com/'; // Proxy server to bypass CORS restriction

function checkAvailability() {
  const username = document.getElementById("username").value;

  if (username.trim() === "") {
    alert("Please enter a GitHub username.");
    return false;
  }

  const subdomain = username.toLowerCase();
  const siteId = 'your-netlify-site-id';

  const request = new XMLHttpRequest();
  request.open("GET", `https://${subdomain}.${MAIN_DOMAIN}`, true);
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
              alert(`Subdomain ${subdomain}.${MAIN_DOMAIN} has been created and linked to your Netlify site, and a DNS record has been added for ${subdomain}.${MAIN_DOMAIN}.`);
              location.reload();
            } else {
              alert(`Failed to add DNS record for ${subdomain}.${MAIN_DOMAIN}.`);
            }
          }

          request3.send(JSON.stringify({
            type: "CNAME",
            hostname: subdomain,
            value: `${subdomain}.${MAIN_DOMAIN}`
          }));
        } else {
          alert(`Failed to link subdomain ${subdomain}.${MAIN_DOMAIN} to your Netlify site.`);
        }
      }

      request2.send(JSON.stringify({
        subdomain: subdomain,
        domain: MAIN_DOMAIN
      }));
    } else {
      alert(`Subdomain ${subdomain}.${MAIN_DOMAIN} already exists. Please choose another username.`);
    }
  };

  request.onerror = function() {
    alert(`Failed to check subdomain availability for ${subdomain}.${MAIN_DOMAIN}.`);
  };

  request.send();

  return false;
}
