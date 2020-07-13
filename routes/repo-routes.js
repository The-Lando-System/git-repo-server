const resUtils = require('../utils/response-utils');
const proc = require('child_process');

module.exports = function(app, gitPath) {
  app.get('/get-all-repos', function(req, res) {
    return executeRepoCommand(res,
      `sh ./scripts/get_all_repos.sh ${gitPath}`,
      'Retrieve all repos',
      '',
      result => result.split(',').map(r => r.trim()) 
    );
  });
  
  app.post('/create-repo', function(req,res) {
    let repoName = req.query.repo_name;

    if (repoName === undefined) {
      return res.status(400).send(resUtils.errorResponse(
        'Failed to create repo',
        'Parameter [repo_name] not provided'
      ));
    }

    return executeRepoCommand(res,
      `sh ./scripts/create_repo.sh ${gitPath} ${repoName}`,
      'Create new repo',
      repoName
    );
  });
  
  app.post('/delete-repo', function(req,res) {

    let repoName = req.query.repo_name;

    if (repoName === undefined) {
      return res.status(400).send(resUtils.errorResponse(
        'Failed to delete repo',
        'Parameter [repo_name] not provided'
      ));
    }

    return executeRepoCommand(res,
      `sh ./scripts/delete_repo.sh ${gitPath} ${repoName}`,
      'Delete repo',
      repoName
    );

  });

  function executeRepoCommand(res, command, actionText, repoName, resCallback) {

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
            `Command failed [${command}] : ${error.stderr}`
          ));
      }
    }
  
    if (resCallback !== undefined) {
      result = resCallback(result);
    }

    return res.send(resUtils.dataResponse(result));
  };
};