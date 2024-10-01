/**
* Handler that will be called during the execution of a PostLogin flow.
*
* @param {Event} event - Details about the user and the context in which they are logging in.
* @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
* @see https://auth0.com/docs/customize/actions/explore-triggers/signup-and-login-triggers/login-trigger/post-login-event-object
*/
exports.onExecutePostLogin = async (event, api) => {
  const isEnabledSso = getEnabledSsoFlag(event);
  const loginConnection = getLoginConnectionId(event);

  if (!isEnabledSso) {
    if (loginConnection !== 'con_tvIjstW8g1vhIFB6' /* Username-Password-Authentication */) {
      api.access.deny("sso_disabled");
    }
    return;
  }

  const enabledConnectionIds = getEnabledConnectionIds(event);
  const allowBackddor = isAllowBackddorUser(event);

  const useEnabledConnection = enabledConnectionIds.includes(loginConnection);

  if (!useEnabledConnection && !allowBackddor) {
    api.access.deny("use_disabled_connection");
  }
};

function getEnabledSsoFlag(event) {
  const metadata = event.organization?.metadata ?? {};
  return metadata.enableSSO === "true";
}

function getEnabledConnectionIds(event) {
  const metadata = event.organization?.metadata ?? {};
  return Object.keys(metadata)
    .filter((key) => key.startsWith('con_'))
    .filter((connectionId) => {
      try {
        return JSON.parse(metadata[connectionId]).enabled === true;
      } catch {
        return false;
      }
    })
}

function getLoginConnectionId(event) {
  return event.connection.id;
}

function isAllowBackddorUser(event) {
  return event.user.app_metadata.allowBackdoor === true;
}
