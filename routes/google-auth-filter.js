const request = require('request');
const resUtils = require('../utils/response-utils');
const constants = require('../constants');

module.exports = function(app) {

  app.use(function(req,res,next){

    // Check if we have an Authorization header
    if (!req.headers.authorization) {
      return res.status(400).send(resUtils.errorResponse(
        'No access token provided!',
        'No Auth headers detected in the request'
      ));
    }

    // Pull the access token out of the auth header
    let access_token = req.headers.authorization.replace('Bearer ', '');

    // Create a request to verify the token
    var options = {
      url: `${constants.GOOGLE_TOKEN_INFO_URL}?access_token=${access_token}`,
      method: 'POST'
    };
    request(options, function(error, response, body) {
      
      let tokenInfo;
      try {
        tokenInfo = JSON.parse(body);
      } catch(e) {
        console.log(e);
        return res.status(500).send(resUtils.errorResponse('Unknown error occurred', e));
      }

      // Only pass if the token info was correctly returned and it is an admin account
      if (!tokenInfo || !tokenInfo.email || !constants.ADMIN_EMAILS[tokenInfo.email]) {
        return res.status(400).send(resUtils.errorResponse(
          'Failed to verify access token!',
          `Access token [${access_token}]`
        ));
      }

      // Set req.id to the email for use in future routes
      req.id = tokenInfo.email;
      next();
    });
  });

};