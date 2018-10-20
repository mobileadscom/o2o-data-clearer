import axios from 'axios';
import miniButtons from './miniButtons';
import '../stylesheets/style.css';
import '../stylesheets/miniButtons.css';

var app = {
	data: {
		token: ''
	},
	events() {
		document.getElementById('logInForm').onsubmit = (e) => {
			e.preventDefault();
			this.methods.login();
		};

		document.getElementById('clearDataBtn').onclick = (e) => {
			this.methods.clearData();
		}
	},
	methods: {
		login() {
			var email = document.getElementById('email').value;
			var password = document.getElementById('password').value;
			document.getElementById('logInFormErrors').innerHTML = '';
			if (email && password) {
				document.getElementById('logInBtn').style.display = 'none';
				document.getElementById('logInLoader').style.display = 'block';
				axios.post(`https://api.mobileads.com/auth?email=${email}&password=${password}`).then((response) => {
					if (response.data.token) {
						app.data.token = response.data.token;
					}
					document.getElementById('logInLoader').style.display = 'none';
				}).catch((error) => {
					console.log(error.response);
					if (error.response.status == 401) {
						document.getElementById('logInFormErrors').innerHTML = 'Invalid email or password.';
					}
					else {
						document.getElementById('logInFormErrors').innerHTML = 'Server error. Please try again later';
					}
					document.getElementById('logInBtn').style.display = 'inline-block';
					document.getElementById('logInLoader').style.display = 'none';
				})
			}
			else {
				document.getElementById('logInBtn').style.display = 'inline-block';
				document.getElementById('logInLoader').style.display = 'none';
				var errors = ''
				if (!email) {
					errors += '<br>Email is empty.'
				}
				if (!password) {
					errors += '<br>Password is empty.'
				}
				document.getElementById('logInFormErrors').innerHTML = errors;
			}
		},
		resetCoupons() {
			return new Promise((resolve, reject) => {
				axios.post('http://api.mobileads.com/mgd/upd?col=mtRainierCoupons&qobj={"group":"A"}&uobj={"redeemed":false,"owner":""}').then((response) => {
					resolve(response);
				}).catch((error) => {
					reject(error);
				});
			})
			
		},
		resetUsers() {
			return new Promise((resolve, reject) => {
				axios.delete('http://api.mobileads.com/mgd/dlt?col=mtRainierUsers').then((response) => {
					resolve(response);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		getUsers() {
			return new Promise((resolve, reject) => {
				axios({
					method: 'get',
					url: 'https://api.mobileads.com/mgd/qs?col=mtRainierUsers',
					headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFsdmluQG1vYmlsZWFkcy5jb20iLCJpYXQiOjE1NDAwMjMzODEsImV4cCI6MTU0MDAyNjk4MX0.40N7l-ccTp7KSImfS3TReM7VhkvaGumIFIByHxNW1IY' }
				}).then((response) => {
					resolve(response);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		clearData() {
			this.getUsers().then((r) => {
				console.log(r);
			}).catch((e) => {
				console.log(e.response);
			})
			/*this.resetUsers().then((r) => {
				console.log(r);
			}).catch((e) => {
				console.log(e.response);
			})*/
		}
	}
}

document.addEventListener('DOMContentLoaded', function() {
	app.events();
	miniButtons.init('primary');
});

export {
	app
}