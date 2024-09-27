/**
 * adds the authenticated user's email address and tenant to the id/access token.
 *
 * @param {Event} event - Details about the user and the context in which they are logging in.
 * @param {PostLoginAPI} api - Interface whose methods can be used to change the behavior of the login.
 */
exports.onExecutePostLogin = async (event, api) => {
  api.idToken.setCustomClaim('orgDisplayName', event.organization?.display_name);
  api.idToken.setCustomClaim('orgEnableSSO', event.organization?.metadata?.enableSSO === 'true');
};
