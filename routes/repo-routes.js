const resUtils = require('../utils/response-utils');
const repoCommandUtils = require('../utils/repo-command-utils');

module.exports = function(app, gitPath) {
  
  app.post('/git-server/create-repo', function(req,res) {
    let repoName = req.query.repo_name;

    if (repoName === undefined) {
      return res.status(400).send(resUtils.errorResponse(
        'Failed to create repo',
        'Parameter [repo_name] not provided'
      ));
    }

    return repoCommandUtils.executeCommand(res,
      `sh ./scripts/create_repo.sh ${gitPath}/${req.id} ${repoName}`,
      'Create new repo',
      repoName
    );
  });
  
  app.post('/git-server/delete-repo', function(req,res) {

    let repoName = req.query.repo_name;

    if (repoName === undefined) {
      return res.status(400).send(resUtils.errorResponse(
        'Failed to delete repo',
        'Parameter [repo_name] not provided'
      ));
    }

    return repoCommandUtils.executeCommand(res,
      `sh ./scripts/delete_repo.sh ${gitPath}/${req.id} ${repoName}`,
      'Delete repo',
      repoName
    );

  });

};