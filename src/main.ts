import { getInput, setOutput, getIDToken, setSecret } from '@actions/core';
import { Client } from './client/client';

async function run(): Promise<void> {
  const companyId = getInput('company_id');
  const audience = getInput('audience') || `https://sts.getnoops.com/${companyId}`;

  const githubToken = await getIDToken(audience);
  const client = new Client({
    providerId: companyId,
    token: githubToken,
    audience: audience,
  });
  
  const authToken = await client.getAuthToken();

  setSecret(githubToken);
  setOutput('token', githubToken);
  setSecret(authToken);
  setOutput('auth_token', authToken);
  setOutput("company_id", companyId);
  
  console.log(`Hello ${companyId}!`);
}

run();