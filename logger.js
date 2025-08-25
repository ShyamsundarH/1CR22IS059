const axios = require('axios');

const vstacks = ['backend'];
const vlevels = ['debug', 'info', 'warn', 'error', 'fatal'];
const vpck = [
  'cache', 'controller', 'cron_job', 'db',
  'domain', 'handler', 'repository', 'route',
  'service', 'auth', 'config', 'middleware', 'utils'
];

// Paste your actual token here (get it from Authorization API as explained before)
const AUTH_TOKEN = 'YOUR_ACCESS_TOKEN_HERE';

async function Log(stack, level, pkg, message) {
  if (!vstacks.includes(stack.toLowerCase())) throw new Error("Invalid stack");
  if (!vlevels.includes(level.toLowerCase())) throw new Error("Invalid level");
  if (!vpck.includes(pkg.toLowerCase())) throw new Error("Invalid package");

  const logBody = { stack, level, package: pkg, message };

  try {
    const response = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      logBody,
      { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
    );
    console.log("Logged:", response.data);
  } catch (err) {
    console.error("Logging failed:", err.response?.data || err.message);
  }
}

module.exports = { Log };
