import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
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
			verifyopen: false,
			step: 0,
		}

		this.login = this.login.bind(this);
		this.changePassword = this.changePassword.bind(this);
		this.register = this.register.bind(this);
		this.confirmRegistration = this.confirmRegistration.bind(this);

		this.logo = React.createRef();
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

			window.idToken = result.idToken.jwtToken;
			window.accessToken = result.accessToken.jwtToken;
			window.refreshToken = result.refreshToken.token;
			window.email = this.state.userField;
			window.validLogin = true;

			window.localStorage.setItem('email', window.email);
			window.localStorage.setItem('refresh', window.refreshToken);
			window.localStorage.setItem('id', window.idToken);
			window.localStorage.setItem('validLogin', 'true');
		}
		else {
			resultText = "Incorrect Username/Password";

			window.accessToken = "";
			window.idToken = "";
			window.refreshToken = "";
			window.validLogin = false;

			window.localStorage.setItem('refresh', window.refreshToken);
			window.localStorage.setItem('validLogin', 'false');

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



	getStepContent() {
		const buttonStyle = {
			fontSize: '13px',
			margin: '.5em'
		};

		const stepStyle = {
			textAlign: 'center'
		}

		switch(this.state.step) {
			case 0:
				return (
					<div style={stepStyle}>
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
						<Button onClick={this.register} style={buttonStyle} >Create Account</Button>
					</div>
				);
			case 1:
				return (
					<div style={stepStyle}>
						<h3>Verify your email</h3>
						<p>A verification code has been sent to your email address.</p>
						<p>Please enter it here to verify your account.</p>
						<TextField
							type="text"
							placeholder="e.g. 123456"
							className="tfield"
							value={this.state.codeField}
							onChange={this._handleCodeChange} />
						<Button onClick={this.confirmRegistration} style={buttonStyle} >Confirm Registration</Button>
					</div>
				);
			default:
				return "Segmentation Fault (core dumped)";
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

		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

		cognitoUser.authenticateUser(authenticationDetails, {
			onSuccess: (result) => this.handlePopoverOpen(true, result),
			newPasswordRequired: this.handleNewPassOpen,
			onFailure: () => this.handlePopoverOpen(false, null)
		});
	}

	register() {
		this.userPool.signUp(this.state.userField, this.state.passField, [], null, (err, result) => {
			if(err) {
				alert(err.message);
				return;
			}

			this.setState({
				codeField: "",
				step: 1
			});
		});
	}

	confirmRegistration() {
		var userData = {
			Username: this.state.userField,
			Pool: this.userPool
		};

		// Passing functions as paramaters is illegal in several states
		var literally_this = this;

		var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
		cognitoUser.confirmRegistration(this.state.codeField, true, function(err, result) {
			if(err) {
				alert(err.message);
				return;
			}

			literally_this.setState({
				registrationopen: false,
				popoverText: "Your account has been created!",
				messageAnchor: literally_this.logo.current,
				step: 0
			});
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
			margin: "15vh 25vw",
			padding: "26vh 5vw",
			paddingTop: '2vh',
			borderRadius: '1em'
		};

		const buttonStyle = {
			fontSize: '13px',
			margin: '.5em'
		};

		const popoverStyle = {
			margin: '1em'
		};

		const image = require('./logo.svg');
		const {messageAnchor} = this.state;
		const open = Boolean(messageAnchor);
		const steps = ["Register Account", "Verify Email Address"];

		if(this.state.redirect) {
			return <Redirect push to="/newJobs" />;
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
				<Button onClick={this.login} style={buttonStyle} >Login</Button>
				<Button onClick={this.handleRegistrationOpen} style={buttonStyle} >Create an Account</Button>


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
						<Button onClick={this.changePassword} style={buttonStyle} >Create New Password</Button>
					</div>
				</Modal>

				<Modal open={this.state.registrationopen} onClose={this.handleRegistrationClose}>
					<div style={modalStyle}>
						<style>{"#stepper * {font-size:16px;}"}</style>
						<Stepper activeStep={this.state.step} id="stepper" style={{marginBottom: '5vh'}}>
							{steps.map((label, index) => {
								const props = {};
								const labelProps = {};
								return (
									<Step key={label} {...props} style={{fontSize: "26px"}}>
										<StepLabel style={{fontSize: 16}} {...labelProps}>{label}</StepLabel>
									</Step>
								);
							})}
						</Stepper>
						<div>
							{this.getStepContent()}
						</div>
					</div>
				</Modal>

			</div>
		)
	}


}

export default Login;
