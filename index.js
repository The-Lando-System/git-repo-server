const express = require('express');
const proc = require('child_process');
const logger = require('morgan');

const app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const gitPath = process.env.GIT_REPO_PATH || '/tmp';

app.get('/get-all-repos', function(req, res) {
  let command = `sh ./scripts/get_all_repos.sh ${gitPath}`;

  var result;
  try {
    result = proc.execSync(command).toString().trim();
  } 
  catch (error) {
    console.log(`Error: ${error}`);
    console.log(`Std Err: ${error.stderr}`);
    console.log(`Std Out: ${error.stdout}`);
    return res.status(500).send(messageResponse(`Failed to get all repos: Failed to execute command: [${command}]. Details: ${error.stderr}`));
  }
  return res.send(dataResponse(result.split(',').map(r => r.trim())));
});

app.post('/create-repo', function(req,res) {
  let repoName = req.query.repo_name;

  if (repoName === undefined) {
    return res.status(400).send(messageResponse("Failed to create repo: no repo_name parameter provided"));
  }

  let command = `sh ./scripts/create_repo.sh ${gitPath} ${repoName}`;

  try {
    proc.execSync(command).toString();
  } 
  catch (error) {
    console.log(`Error: ${error}`);
    console.log(`Std Err: ${error.stderr}`);
    console.log(`Std Out: ${error.stdout}`);
    switch (error.stdout.toString().trim()) {
      case 'NO_REPO_NAME':
        return res.status(400).send(messageResponse(`Failed to create repo: No repo_name parameter provided.`));
      case 'REPO_EXISTS':
        return res.status(400).send(messageResponse(`Failed to create repo: Repo with name [${repoName}] already exists.`));
      default:
        return res.status(500).send(messageResponse(`Failed to create repo: Failed to execute command: [${command}]. Details: ${error.stderr}`));
    }
  }

  return res.send(messageResponse(`Successfully created repository named ${repoName}`));
});

app.post('/delete-repo', function(req,res) {
  let repoName = req.query.repo_name;

  if (repoName === undefined) {
    return res.status(400).send(messageResponse("Failed to delete repo: no repo_name parameter provided"));
  }

  let command = `sh ./scripts/delete_repo.sh ${gitPath} ${repoName}`;

  try {
    proc.execSync(command).toString();
  } 
  catch (error) {
    console.log(`Error: ${error}`);
    console.log(`Std Err: ${error.stderr}`);
    console.log(`Std Out: ${error.stdout}`);
    switch (error.stdout.toString().trim()) {
      case 'NO_REPO_NAME':
        return res.status(400).send(messageResponse(`Failed to delete repo: No repo_name parameter provided.`));
      case 'REPO_NOT_EXISTS':
        return res.status(400).send(messageResponse(`Failed to delete repo: Repo with name [${repoName}] does not exist.`));
      default:
        return res.status(500).send(messageResponse(`Failed to delete repo: Failed to execute script: [${command}]. Details: ${error.stderr}`));
    }
  }

  return res.send(messageResponse(`Successfully deleted repository ${repoName}`));
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
 console.log('Server is up and running on port ', port);
 console.log('Git Repo Path: ', gitPath);
});

function messageResponse(message) {
  return { "message" : message };
}

function dataResponse(data) {
  return { "data" : data };
}