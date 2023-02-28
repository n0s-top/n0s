exports.handler = async (event, context) => {
  // Import required libraries
  const fs = require('fs');
  const fetch = require('node-fetch');
  const { Octokit } = require('@octokit/rest');
  const netlifyAPI = require('netlify');

  // Extract GitHub repository information from the event payload
  const { repository } = JSON.parse(event.body);

  // Extract configuration from domain JSON files in the repository
  const octokit = new Octokit();
  const dir = `${process.cwd()}/domains`;
  const files = fs.readdirSync(dir);
  const configs = [];
  for (const file of files) {
    if (file.endsWith('.json')) {
      const data = await octokit.repos.getContent({
        owner: repository.owner.login,
        repo: repository.name,
        path: `domains/${file}`
      });
      const config = JSON.parse(Buffer.from(data.data.content, 'base64').toString('utf-8'));
      configs.push(config);
    }
  }

  // Create subdomains using the Netlify API
  const client = new netlifyAPI(process.env.NETLIFY_TOKEN);
  const site = await client.getSite({ site_id: process.env.NETLIFY_SITE_ID });
  const subdomains = [];
  for (const config of configs) {
    const domain = `${config.owner.username}.${site.name}`;
    const subdomain = await client.createDNSZone({
      site_id: process.env.NETLIFY_SITE_ID,
      hostname: domain,
      record_type: "CNAME",
      value: config.record.URL
    });
    subdomains.push(`https://${domain}`);
  }

  // Return the subdomain URLs
  return {
    statusCode: 200,
    body: JSON.stringify({
      subdomains: subdomains
    })
  };
};
