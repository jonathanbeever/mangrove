const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const fs = require('fs');
global.fetch = require('node-fetch');

const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
  Username: 'aninjnlx@sharklasers.com',
  Password: 'grain subsystem strainer clarity various compactor',
});

const userPool = new AmazonCognitoIdentity.CognitoUserPool({
  UserPoolId: 'us-east-2_GP7h1WmOF',
  ClientId: '36gfihuqugs2r3j2u1qm1uknna',
});

const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
  Username: 'aninjnlx@sharklasers.com',
  Pool: userPool,
});

const quine1 = 'const token = \'';
const quine2 = '\';\nmodule.exports = { token };\n';

cognitoUser.authenticateUser(authenticationDetails, {
  onSuccess(result) {
    const token = result.idToken.jwtToken;

    fs.writeFile('util/testUser.js', quine1 + token + quine2, (err) => {
      if (err) {
        console.log(err);
      }
    });
  },
  onFailure(err) { console.log(err); },
});
