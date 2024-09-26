import { ManagementClient } from 'auth0';

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

export const auth0ManagementClient = new ManagementClient({
  domain: getRequiredEnv('AUTH0_MANAGEMENT_API_DOMAIN'),
  clientId: getRequiredEnv('AUTH0_MANAGEMENT_API_CLIENT_ID'),
  clientSecret: getRequiredEnv('AUTH0_MANAGEMENT_API_CLIENT_SECRET'),
});
