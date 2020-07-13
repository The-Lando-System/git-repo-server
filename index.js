const express = require('express');
const logger = require('morgan');

const app = express();

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const gitPath = process.env.GIT_REPO_PATH || '/tmp';

require('./routes/google-auth-filter')(app);
require('./routes/repo-routes')(app, gitPath);

const port = process.env.PORT || 3000;
app.listen(port, () => {
 console.log('Server is up and running on port ', port);
 console.log('Git Repo Path: ', gitPath);
});