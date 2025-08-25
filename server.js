const express = require('express');
const { Log } = require('./logger');

const app = express();
const port = 3000;

app.use(express.json());

const urlDatabse = {};

function codegen(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}

app.post('/shorturls', async (req, res) => {
  const { url, validity = 30, shortcode } = req.body;
  const now = new Date();

  if (!url || typeof url !== 'string') {
    await Log('backend', 'error', 'handler', 'Missing or invalid URL in request');
    return res.status(400).json({ error: 'URL is required and must be a string' });
  }

  let code = shortcode;

  if (code) {
    if (!/^[a-zA-Z0-9]{4,10}$/.test(code)) {
      await Log('backend', 'error', 'handler', `Invalid shortcode format: ${code}`);
      return res.status(400).json({ error: 'Shortcode must be alphanumeric, 4-10 chars' });
    }

    if (urlDatabse[code]) {
      await Log('backend', 'error', 'handler', `Shortcode already exists: ${code}`);
      return res.status(409).json({ error: 'Shortcode already in use' });
    }
  } else {
    do {
      code = codegen();
    } while (urlDatabse[code]);
  }

  const validMins = Number.isInteger(validity) && validity > 0 ? validity : 30;
  const expiry = new Date(now.getTime() + validMins * 60000);

  urlDatabse[code] = {
    url,
    created: now.toISOString(),
    expiry: expiry.toISOString(),
    clicks: []
  };

  await Log('backend', 'info', 'service', `Short URL created: ${code}`);

  return res.status(201).json({
    shortLink: `http://localhost:${port}/shorturls/${code}`,
    expiry: expiry.toISOString()
  });
});

app.get('/shorturls/:shortcode', async (req, res) => {
  const code = req.params.shortcode;
  const data = urlDatabse[code];

  if (!data) {
    await Log('backend', 'error', 'handler', `Redirect failed: shortcode not found - ${code}`);
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  if (new Date() > new Date(data.expiry)) {
    await Log('backend', 'warn', 'handler', `Redirect failed: shortcode expired - ${code}`);
    return res.status(410).json({ error: 'Shortcode expired' });
  }

  data.clicks.push({
    timestamp: new Date().toISOString()
  });

  await Log('backend', 'info', 'service', `Redirecting shortcode: ${code}`);

  res.redirect(data.url);
});

app.get('/shorturls/:shortcode/stats', async (req, res) => {
  const code = req.params.shortcode;
  const data = urlDatabse[code];

  if (!data) {
    await Log('backend', 'error', 'handler', `Stats request failed: shortcode not found - ${code}`);
    return res.status(404).json({ error: 'Shortcode not found' });
  }

  await Log('backend', 'info', 'service', `Stats requested for shortcode: ${code}`);

  res.json({
    totalClicks: data.clicks.length,
    url: data.url,
    created: data.created,
    expiry: data.expiry,
    clicks: data.clicks
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
