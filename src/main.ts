import { getInput, setOutput } from '@actions/core';

/**
 * Executes the main action.
 */
async function run(): Promise<void> {
  const companyId = getInput('company_id');
  setOutput("company_id", companyId);
  
  console.log(`Hello ${companyId}!`);
}

run();