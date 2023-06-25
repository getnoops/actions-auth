import { getInput, setOutput, getIDToken } from '@actions/core';

const oidcWarning =
  `GitHub Actions did not inject $ACTIONS_ID_TOKEN_REQUEST_TOKEN or ` +
  `$ACTIONS_ID_TOKEN_REQUEST_URL into this job. This most likely means the ` +
  `GitHub Actions workflow permissions are incorrect, or this job is being ` +
  `run from a fork. For more information, please see https://docs.github.com/en/actions/security-guides/automatic-token-authentication#permissions-for-the-github_token`;
  
/**
 * Executes the main action.
 */
async function run(): Promise<void> {
  const workloadIdentityProvider = getInput('workload_identity_provider');
  const audience = getInput('audience') || `https://iam.googleapis.com/${workloadIdentityProvider}`;

  // If we're going to do the OIDC dance, we need to make sure these values
  // are set. If they aren't, core.getIDToken() will fail and so will
  // generating the credentials file.
  const oidcTokenRequestToken = process.env.ACTIONS_ID_TOKEN_REQUEST_TOKEN;
  const oidcTokenRequestURL = process.env.ACTIONS_ID_TOKEN_REQUEST_URL;
  if (!oidcTokenRequestToken || !oidcTokenRequestURL) {
    throw new Error(oidcWarning);
  }

  const token = await getIDToken(audience);

  const companyId = getInput('company_id');
  setOutput("company_id", companyId);
  
  console.log(`Hello ${companyId}!`);
}

run();