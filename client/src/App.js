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
        height: 32,
        padding: '0 20px',
        boxShadow: '0 1px 1px 1px #606060',
      },
    }
  },
  typography: { useNextVariants: true },
});

const body = {
  keys: [{
    alg: 'RS256', e: 'AQAB', kid: 'eeH6VRqBBD6TtnUspODfKxirJVU8m9TaSrtLdbG4m3I=', kty: 'RSA', n: 'qUyJRoUjAEEZ9yLskDSPpNKsRkWS1AMeOID8UXOC6XjL7-5OsbbeC6oJnBXQHXrdSpyF5Mz8sLWYTbfpTEuyD1er709PUa3BCCeu-qpb0RSpR3M-i3MelKanHK4ThQfX_fs3k_aTIIc8nt-Z9QZr1AY7-S825FrLEXx7SeTjJrJzm2fidHV69I8otJP8-SPbmQTVYUM8PsNI3DMFApvYdRr6_xXzxEXeQtUG4zPSJLFO_a7FjSMwzfdhW46QXqT1ZJeVSbSdm4Zvb0yPZ4Ek45axn383bryJEeZIOllAzz63k16t883GMozbqU-YKHUxgSliHQ_o0VJdsSrw60KZqQ', use: 'sig',
  }, {
    alg: 'RS256', e: 'AQAB', kid: 'RAlwdyH5HIfBwOgLkjj1+3u2DMCieyAw/UC5IGmo0cI=', kty: 'RSA', n: 'tHh221IyoBjslc_cRLkplaMeu4kibt_NRPfEXvMj4q5PyPRwMITk2Z3jNADe7dmPK9-uP4F50EmDt8tzkjpezz1_0BJfXOOyoh26zhe6AFASHNJHIaVw6mpZTPC7tFNPH0sJhh9emFzvPJd_oo3ZKYzzBb0Kjv599nn0PKQ5toIW6V4dd4tl-_vl2JJXFZson0ltM-SqWq2jRhwTCtZFIZ52ygOUCMSI81sjwo1pjXf6_feHh4SPxu2xnEWXSOOfZ7O-ZjzXj8adfINFsTFA4bGfy12sYFUsCICREq5xJe7eAVa1JkYxHouxBMzYPeE54u6IE5f0v9AWRitjdoYXgQ', use: 'sig',
  }],
};

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
			window.idToken = window.localStorage.getItem('id');

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
				window.localStorage.setItem('id', window.idToken);
			}
		});

	}

	// Checks if the client has a valid login token
	validateToken(token) {
		const pems = {};
	    const { keys } = body;

	    for (let i = 0; i < keys.length; i += 1) {
	      const keyID = keys[i].kid;
	      const modulus = keys[i].n;
	      const exponent = keys[i].e;
	      const keyType = keys[i].kty;
	      const jwk = {
	        kty: keyType,
	        n: modulus,
	        e: exponent,
	      };

	      pems[keyID] = jwkToPem(jwk);
	    }

	    // console.log(token);
	    const decodedJwt = jwt.decode(token, { complete: true });
	    if (!decodedJwt) {
	      console.log('Not a valid JWT');
	      window.validLogin = false;
	    }

	    const { kid } = decodedJwt.header;
	    const pem = pems[kid];

	    if (!pem) {
	      console.log('Key not found');
	      window.validLogin = false;
	    }

	    try {
	      jwt.verify(token, pem);
	      window.validLogin = true;
	    } catch (e) {
	      window.validLogin = false;
	    }

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

		if(window.refreshToken === null || window.refreshToken === '' || !this.validateToken(window.idToken) || window.localStorage.getItem('validLogin') !== 'true') {
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
