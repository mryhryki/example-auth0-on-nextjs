const { AuthenticationClient, ManagementClient } = require("auth0");

/**
 * adds the authenticated user's email address and tenant to the id/access token.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // see about event and api -> https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/event-object

  const linkUserTo = getLinkUserTo(event);
  if (linkUserTo == null) {
    return;
  }

  const managementApiClient = await getManagementApiClient(event);
  const requestParameters = {
    user_id: event.user.user_id,
    provider: event.user.identities[0].provider,
  };
  console.log(JSON.stringify({ linkUserTo, requestParameters }));

  await managementApiClient.users.link(
    { id: linkUserTo },
    requestParameters,
  );
};

function getLinkUserTo(event) {
  return event.user.app_metadata?.linkUserTo;
}

// ==================== Utilities ====================

let cacheManagementApiClient = null;
async function getManagementApiClient(event) {
  // Reason of cache: Initializing the client takes time with issuing a new token.
  if (cacheManagementApiClient != null) {
    return cacheManagementApiClient;
  }

  const {
    API_EXPLORER_DOMAIN,
    API_EXPLORER_CLIENT_ID,
    API_EXPLORER_CLIENT_SECRET,
  } = event.secrets;
  const client = new AuthenticationClient({
    domain: API_EXPLORER_DOMAIN,
    clientId: API_EXPLORER_CLIENT_ID,
    clientSecret: API_EXPLORER_CLIENT_SECRET,
  });

  const response = await client.oauth.clientCredentialsGrant({
    audience: `https://${API_EXPLORER_DOMAIN}/api/v2/`,
  });
  if (response.status !== 200) {
    throw new Error(JSON.stringify(response));
  }
  const managementAccessToken = response.data.access_token;

  return (cacheManagementApiClient = new ManagementClient({
    domain: event.secrets.API_EXPLORER_DOMAIN,
    token: managementAccessToken,
  }));
}
