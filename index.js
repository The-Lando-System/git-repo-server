const express = require('express');
const logger = require('morgan');

const constants = require('./constants');
const repoCommandUtils = require('./utils/repo-command-utils');
const resUtils = require('./utils/response-utils');

const app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const gitPath = process.env.GIT_REPO_PATH || '/tmp/git-server';

// Route to get all repos
app.get('/git-server/get-all-repos', function(req, res) {

  let serverKey = req.headers['x-server-key'];

  if (!serverKey || serverKey !== constants.GIT_REPO_SERVER_KEY) {
    return res.status(400).send(resUtils.errorResponse(
      'User unauthorized to access endpoint',
      ''
    ));
  }

  return repoCommandUtils.executeCommand(res,
    `sh ./scripts/get_all_repos.sh ${gitPath}`,
    'Retrieve all repos',
    '',
    result => result.split(',').map(r => r.trim()).filter(item => item !== '') 
  );
});

require('./routes/google-auth-filter')(app);
require('./routes/repo-routes')(app, gitPath);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('git-repo-server is up and running on port ', port);
  console.log('Git Server Path: ', gitPath);
});