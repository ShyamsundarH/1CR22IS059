const axios = require('axios');

const vstacks = ['backend'];
const vlevels = ['debug', 'info', 'warn', 'error', 'fatal'];
const vpck = [
  'cache', 'controller', 'cron_job', 'db',
  'domain', 'handler', 'repository', 'route',
  'service', 'auth', 'config', 'middleware', 'utils'
];

const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzaGgyMmlzZUBjbXJpdC5hYy5pbiIsImV4cCI6MTc1NjA5ODkzMiwiaWF0IjoxNzU2MDk4MDMyLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiOGI4NThlYTEtMDU3OS00NjBjLTkwZjQtMTk0MmQyOTM4NzE1IiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiaCBzaHlhbSBzdW5kYXIiLCJzdWIiOiI2OGQ5MTkwZS03YTliLTQ5NzgtYmIyOS1hNWE3YzE0NDJjMjYifSwiZW1haWwiOiJzaGgyMmlzZUBjbXJpdC5hYy5pbiIsIm5hbWUiOiJoIHNoeWFtIHN1bmRhciIsInJvbGxObyI6IjFjcjIyaXMwNTkiLCJhY2Nlc3NDb2RlIjoieVVWUVhLIiwiY2xpZW50SUQiOiI2OGQ5MTkwZS03YTliLTQ5NzgtYmIyOS1hNWE3YzE0NDJjMjYiLCJjbGllbnRTZWNyZXQiOiJUVEhQY2ZBWXFVQUR2blJiIn0.LxqcCL_RP_kuUbaQwh_irGZoY2TB6FUfct-tyDzqEM8';

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
