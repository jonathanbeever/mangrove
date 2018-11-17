import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';


class Settings extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
			<div id="settings-head">
				<h1>Settings</h1>
				<Button>Submit</Button>
				<Button>Cancel</Button>
			</div>
			<Grid
  				container
  				direction="row"
  				justify="space-around"
  				alignItems="stretch"
			>
				<div>
					<h2>Account Settings</h2>
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
					<h2>Group Server Access</h2>
					<div>
						<h3>UCF Researchers</h3>
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

				<RadioGroup>
					<h2>Processing</h2>
					<div>
						<Radio id="processing1" name="processing" value="local" />
						<label for="processing1">Local machine</label>
					</div>
					<div>
						<Radio id="processing2" name="processing" value="ucf" />
						<label for="processing2">UCF Researchers</label>
					</div>
					<div>
						<Radio id="processing3" name="processing" value="purdue" />
						<label for="processing3">Purdue Univeresity</label>
					</div>

				</RadioGroup>
			</Grid>
			</div>
		);
	}
}

// OKAY
export default Settings;
