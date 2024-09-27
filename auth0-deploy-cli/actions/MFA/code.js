/**
 * check Use MFA
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  // see about event and api -> https://auth0.com/docs/customize/actions/flows-and-triggers/login-flow/event-object

  if (event.transaction?.protocol === "oauth2-refresh-token") {
    console.log(
      'IP restriction check is skipped because this transaction protocol is "oauth2-refresh-token".',
    );
    return;
  }

  if (event.user.app_metadata.useMFA) {
    api.multifactor.enable("any", { allowRememberBrowser: false });
  }
};
