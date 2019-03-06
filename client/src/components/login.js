import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Popover from '@material-ui/core/Popover';
import { Redirect } from 'react-router-dom';
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

class Login extends Component {

	constructor(props) {
		super(props);

		this.poolData = {
			UserPoolId: "us-east-2_GP7h1WmOF",
			ClientId: "36gfihuqugs2r3j2u1qm1uknna"
		};
		this.pool_region = 'us-east-2';

		this.userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolData);
		this.state = {
			passopen: false,
			messageAnchor: null,
			verifyopen: false
		}

		this.login = this.login.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.register = this.register.bind(this);
		this.confirmRegistration = this.confirmRegistration.bind(this);

		this.logo = React.createRef();
		this.code = React.createRef();
		// this.entrance = React.createRef();
	}

	_handleUserChange = e => {
		this.setState({
			userField: e.target.value
		});
	}
	_handlePassChange = e => {
		this.setState({
			passField: e.target.value
		});
	}
	_handleNewPassChange = e => {
		this.setState({
			newPassField: e.target.value
		});
	}

	_handleCodeChange = e => {
		this.setState({
			codeField: e.target.value
		});
	}

	handleNewPassOpen = () => {
    	this.setState({ passopen: true });
  	}

  	handleNewPassClose = () => {
    	this.setState({ messageAnchor: null });
  	}

	handlePopoverOpen = (success, result) => {
		var resultText;
		if(success) {
			resultText = "Login Successful";
			// console.log(JSON.stringify(result, null, 4));

			window.idToken = result.idToken.jwtToken;
			window.accessToken = result.accessToken.jwtToken;
			window.refreshToken = result.refreshToken.token;

		}
		else {
			resultText = "Incorrect Username/Password";

			window.accessToken = "";
			window.idToken = "";
			window.refreshToken = "";

		}

		this.setState({
			popoverText: resultText,
			messageAnchor: this.logo.current,
			redirect: success
		});
	}

	handlePopoverClose = () => {
		this.setState({ messageAnchor: null  });
	}

	handleRegistrationOpen = () => {
		this.setState({registrationopen: true});
	}

	handleRegistrationClose = () => {
		this.setState({registrationopen: false});
	}

	handleEnter = (e) => {
		if(e.key === 'Enter' && !this.state.registrationopen) {
			this.login();
		}
	}

	login() {
		var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
			Username: this.state.userField,
			Password: this.state.passField
		});


		var userData = {
			Username: this.state.userField,
			Pool: this.userPool
		};

		console.log(userData);
		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);



		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: (result) => this.handlePopoverOpen(true, result),
			newPasswordRequired: this.handleNewPassOpen,
			onFailure: () => this.handlePopoverOpen(false, null)
		});
		console.log(this.state);
	}

	register() {
		this.userPool.signUp(this.state.userField, this.state.passField, [], null, (err, result) => {
			if(err) {
				console.log(err);
				return;
			}
			var cognitoUser = result.user;
			console.log(cognitoUser.getUsername() + ' has been registered!');
			this.code.current.disabled = false;
		});

		this.setState({verifyopen: true});
	}

	confirmRegistration() {
		var userData = {
			Username: this.state.userField,
			Pool: this.userPool
		};

		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		cognitoUser.confirmRegistration(this.state.codeField, true, function(err, result) {
			if(err) {
				alert(err.message);
				return;
			}

			console.log('Verified');
		});
	}

	changePassword() {
		var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
			Username: this.state.userField,
			Password: this.state.passField
		});


		var userData = {
			Username: this.state.userField,
			Pool: this.userPool
		};

		const curr = this.state.passField, next = this.state.newPassField;
		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

		console.log(curr, next);
		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: function(result) {
				cognitoUser.changePassword(curr, next, (err, result) => {
					if(err) {
						console.log(err);
					} else {
						console.log("Successfully changed password");
						console.log(result);
					}
				});
			},
			newPasswordRequired: function(userAttributes, requiredAttribute) {
				console.log(curr, next);
				delete userAttributes.email_verified;
				cognitoUser.completeNewPasswordChallenge(next, userAttributes, this);
			},

			onFailure: function (err) {
                console.log(err);
			}
		});
	}

	render() {
		const modalStyle = {
			backgroundColor: 'white',
			margin: '0 25%',
			marginTop: '5em',
			padding: '1em'
		};

		const buttonStyle = {
			fontSize: '13px',
			margin: '.5em'
		};

		const popoverStyle = {
			margin: '1em'
		};

		// var logoStyle =

		const image = require('./logo.svg');
		const {messageAnchor} = this.state;
		const open = Boolean(messageAnchor);

		if(this.state.redirect) {
			return <Redirect push to="/catalog" />;
		}

		return (
			<div id="login" style={{
				width: '100%',
				margin: '15% auto',
				textAlign: 'center'
			}}>
				<h2>Mangrove</h2>
				<img src={image} alt="Mangrove Logo" style={{maxWidth: '200px'}} ref={this.logo} />

				<Popover
					open={open}
					ref={this.popover}
					anchorEl={messageAnchor}
					onClose={this.handlePopoverClose}
					anchorOrigin={{
            			vertical: 'bottom',
            			horizontal: 'center',
          			}}
          			transformOrigin={{
            			vertical: 'top',
            			horizontal: 'center',
          			}}
				><div style={popoverStyle}>{this.state.popoverText}</div></Popover>

				<TextField
					type="text"
					placeholder="Username"
					className="tfield"
					value={this.state.userField}
					onKeyDown={this.handleEnter}
					onChange={this._handleUserChange}  />
				<TextField
					type="password"
					placeholder="Password"
					className="tfield"
					value={this.state.passField}
					onKeyDown={this.handleEnter}
					onChange={this._handlePassChange}  />
				<Button onClick={this.login} style={buttonStyle} color="primary">Login</Button>
				<Button onClick={this.handleRegistrationOpen} style={buttonStyle} color="primary">Create an Account</Button>


				<Modal open={this.state.passopen} onClose={this.handleNewPassClose}>
					<div style={modalStyle}>
						<h3>Please create a new password</h3>
						<TextField
							type="text"
							placeholder="Username"
							className="tfield"
							value={this.state.userField}
							onChange={this._handleUserChange}  />
						<TextField
							type="password"
							placeholder="New Password"
							className="tfield"
							value={this.state.newPassField}
							onChange={this._handleNewPassChange}  />
						<Button onClick={this.changePassword} style={buttonStyle} color="primary">Create New Password</Button>
					</div>
				</Modal>

				<Modal open={this.state.registrationopen} onClose={this.handleRegistrationClose}>
					<div style={modalStyle}>
						<h3>Create an Account</h3>
						<TextField
							type="text"
							placeholder="Email Address"
							className="tfield"
							value={this.state.userField}
							onChange={this._handleUserChange}  />
						<TextField
							type="password"
							placeholder="Password"
							className="tfield"
							value={this.state.passField}
							onChange={this._handlePassChange}  />
						<Button onClick={this.register} style={buttonStyle} color="primary">Create Account</Button>
						<div>
							<h3>Verify your email</h3>
							<p>Upon registration, a verification code will be sent to your email address. Please enter it here to verify your account</p>
							<TextField
								type="text"
								placeholder="e.g. 123456"
								className="tfield"
								ref={this.code}
								value={this.state.codeField}
								onChange={this._handleCodeChange} />
							<Button onClick={this.confirmRegistration} style={buttonStyle} color="primary">Confirm Registration</Button>
						</div>
					</div>
				</Modal>

			</div>
		)
	}


}

export default Login;
