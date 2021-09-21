import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Popover from '@material-ui/core/Popover';


class Settings extends Component {
	/*
	constructor(props) {
		super(props);
	}
	*/

	state = {
		anchorEl: null,
	};

	handleSubmitClick = event => {
		this.setState({
			anchorEl: event.currentTarget,
    	});
  	};

	handleSubmitClose = () => {
		this.setState({
			anchorEl: null,
		});
	};

	render() {
		const { anchorEl } = this.state;
		const submitOpen = Boolean(anchorEl);

		return (
			<div id="settings">
			<div id="settings-head">
				<h2>Settings</h2>
				<Button onClick={this.handleSubmitClick}>Submit</Button>
				<Popover
					anchorEl={anchorEl}
					open={submitOpen}
					anchorOrigin={{
            			vertical: 'bottom',
            			horizontal: 'center',
          			}}
          			transformOrigin={{
            			vertical: 'top',
            			horizontal: 'center',
          			}}
					id="settings-popover"
					onClose={this.handleSubmitClose}>Your settings have been updated</Popover>
				<Button>Cancel</Button>
			</div>
			<form>
			<Grid
  				container
  				direction="row"
  				justify="space-around"
  				alignItems="stretch"
			>
				<div>
					<h3>Account Settings</h3>
					<fieldset>
						<legend>Email</legend>
						<TextField name="email"></TextField>
					</fieldset>
					<fieldset>
						<legend>Reset Password</legend>
						<TextField type="password" name="old-password" placeholder="Old Password" className="tfield"></TextField>
						<TextField type="password" name="new-password" placeholder="New Password" className="tfield"></TextField>
						<TextField type="password" name="confirm-password" placeholder="Confirm Password" className="tfield"></TextField>
					</fieldset>
				</div>

				<div>
					<h3>Group Server Access</h3>
					<div>
						<h4>UCF Researchers</h4>
						<p>Role: Admin</p>
						<fieldset>
							<legend>Update Credentials</legend>
							<TextField type="text" name="ip" placeholder="IP Address" className="tfield" />
							<TextField type="text" name="server-user" placeholder="Username" className="tfield" />
							<TextField type="password" name="server-pass" placeholder="Password" className="tfield" />
						</fieldset>
						<fieldset>
							<legend>Invite by Email</legend>
							<TextField type="text" name="invite-email" placeholder="Email" className="tfield"/>
							<Button name="invite-button">Invite</Button>
						</fieldset>
					</div>
				</div>

				<div>
					<h3>Processing</h3>
					<Select name="processing" value="local">
						<MenuItem value="local">Local Server</MenuItem>
						<MenuItem value="ucf">UCF Researchers</MenuItem>
						<MenuItem value="purdue">Purdue Universityr</MenuItem>
					</Select>

				</div>
			</Grid>
			</form>
			</div>
		);
	}
}

// OKAY
export default Settings;
