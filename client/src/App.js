import React, { Component } from 'react';
import './App.css';
import NavBarTabs from './components/NavBarTabs';
import NewJobs from './components/newJobs/stepper';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Catalog from './components/selectResults/catalog';
import JobQueue from './components/jobQueue/jobQueue';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Login from './components/login';

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');

const theme = createMuiTheme({
  overrides: {
    MuiButton: {
      text: {
        background: 'linear-gradient(to bottom right, #4d9574, #b6cd26)',
        fontSize: 13,
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 28,
        padding: '0 20px',
        boxShadow: '0 1px 1px 1px #606060',
      },
    },
    MuiRadio: {
        checked: {
      colorPrimary: '#b6cd26'}
    }
  },
  typography: { useNextVariants: true },
});

class App extends Component {

  constructor() {
    super();

    this.state = {};
  }

  render() {
    return (
      <Router>
        <MuiThemeProvider theme={theme}>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/newJobs" render={() => <div><NavBarWrapper/><NewJobs/></div>} />
  		      <Route path="/catalog" render={() => <div><NavBarWrapper/><Catalog/></div>} />
            <Route path="/jobQueue" render={() => <div><NavBarWrapper/><JobQueue/></div>} />
            <Redirect from="/" to="/login" />
          </Switch>
        </MuiThemeProvider>
      </Router>
    );
  }
}

class NavBarWrapper extends Component {

	constructor() {
		super();

		this.poolData = {
			UserPoolId: "us-east-2_GP7h1WmOF",
			ClientId: "36gfihuqugs2r3j2u1qm1uknna"
		};
		this.pool_region = 'us-east-2';

		this.userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);
		this.validateToken = this.validateToken.bind(this);
		this.renew = this.renew.bind(this);
	}

	// Renews Cognito Tokens with every page load (since they expire every hour)
	renew() {
		if(window.email == null || window.refreshToken == null) {
			window.email = window.localStorage.getItem('email');
			window.refreshToken = window.localStorage.getItem('refresh');
			window.validLogin = window.localStorage.getItem('validLogin');

			if(window.email == null || window.refreshToken == null)
				return;
		}

		const refreshToken = new AmazonCognitoIdentity.CognitoRefreshToken({RefreshToken: window.refreshToken});

		const userData = {
			Username: window.email,
			Pool: this.userPool
		};

		const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

		cognitoUser.refreshSession(refreshToken, (err, session) => {
			if(err) {
				console.log(err);
			} else {
				window.idToken = session.idToken.jwtToken;
				window.accessToken = session.accessToken.jwtToken;
				window.refreshToken = session.refreshToken.token;
				window.localStorage.setItem('refresh', window.refreshToken);
			}
		});

	}

	// Checks if the client has a valid login token
	validateToken() {
		request({
			url: `https://cognito-idp.${this.pool_region}.amazonaws.com/${this.poolData.UserPoolId}/.well-known/jwks.json`,
			json: true
		}, function(error, response, body) {
			if(!error && response.statusCode === 200) {
				var pems = {};
				var keys = body['keys'];

				for(var i = 0; i < keys.length; i++) {
					var key_id = keys[i].kid;
					var modulus = keys[i].n;
					var exponent = keys[i].e;
					var key_type = keys[i].kty;
					var jwk = {
						kty: key_type,
						n: modulus,
						e: exponent
					};

					pems[key_id] = jwkToPem(jwk);
				}

				var decodedJwt = jwt.decode(window.idToken, {complete: true});
				if(!decodedJwt) {
					console.log("Not a valid JWT");
					window.validLogin = false;
					return;
				}

				var kid = decodedJwt.header.kid;
				var pem = pems[kid];

				if(!pem) {
					console.log("Key not found");
					window.validLogin = false;
					return;
				}

				jwt.verify(window.idToken, pem, function(err, payload) {
					if(err) {
						console.log("Invalid token");
						window.validLogin = false;
					} else {
						window.validLogin = true;
					}
				});
			} else {
				console.log("Download failed");
				window.validLogin = false;
			}
		});

		if(window.validLogin) {
			window.localStorage.setItem('validLogin', window.validLogin.toString());
		}
		else {
			window.localStorage.setItem('validLogin', 'false');
		}
		return window.validLogin;
	}

	render() {
		this.renew();

		if(window.refreshToken === null || window.refreshToken === '' || !this.validateToken() || window.localStorage.getItem('validLogin') !== 'true') {
			return <Redirect push to="/" />;
		}

		return (
			<div className="App">
				<style>{'html { height: 100%;}'}</style>
				{/* Uncomment for gradient background */}
	            {/* <style>{'body { background-color:#fafafa; background-image: linear-gradient(to bottom right, #4d9574, #b6cd26); background-repeat: no-repeat; height: 100%; background-attachment: fixed;}'}</style> */}
				<NavBarTabs />
			</div>
		);
	}
}

export default App;
