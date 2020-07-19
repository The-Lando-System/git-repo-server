const resUtils = require('./response-utils');
const proc = require('child_process');

module.exports = {
  executeCommand: function(res, command, actionText, repoName, resCallback) {

    let result;

    try {
      result = proc.execSync(command).toString().trim();
    } 
    catch (error) {

      let errorText;

      if (error.stdout !== undefined) {
        errorText = error.stdout.toString().trim();
      }

      switch (errorText) {
        case 'NO_REPO_NAME':
          return res.status(400).send(resUtils.errorResponse(
            `${actionText} failed!`,
            'Parameter [repo_name] not provided'
          ));
        case 'REPO_EXISTS':
          return res.status(400).send(resUtils.errorResponse(
            `${actionText} failed!`,
            `Repo with name [${repoName}] already exists.`
          ));
        case 'REPO_NOT_EXISTS':
          return res.status(400).send(resUtils.errorResponse(
            `${actionText} failed!`,
            `Repo with name [${repoName}] does not exist.`
          ));
        default:
          return res.status(500).send(resUtils.errorResponse(
            `${actionText} failed!`,
            `Command failed [${command}] : ${errorText || error}`
          ));
      }
    }
  
    if (resCallback !== undefined) {
      result = resCallback(result);
    }

    return res.send(resUtils.dataResponse(result));
  }
};