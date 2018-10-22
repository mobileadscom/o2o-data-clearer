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
						document.getElementById('clearDataWrapper').style.display = 'block';
						document.getElementById('logInFormWrapper').style.display = 'none';
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
				axios({
					method: 'get',
					url: 'https://api.mobileads.com/coupons/mtRainier/init_coupons',
					headers: {'Authorization': `Bearer ${app.data.token}` }
				}).then((response) => {
					resolve(response);
				}).catch((error) => {
					reject(error);
				});
			})
			
		},
		deleteUsers() {
			return new Promise((resolve, reject) => {
				axios({
					method: 'delete',
					url: 'https://api.mobileads.com/mgd/dlt?col=mtRainierUsers',
					headers: {'Authorization': `Bearer ${app.data.token}` }
				}).then((response) => {
					resolve(response);
				}).catch((error) => {
					reject(error);
				});
			});
		},
		clearData() {
			document.getElementById('clearDataBtn').style.display = 'none';
			document.getElementById('clearLoader').style.display = 'block';
			this.resetCoupons().then((r) => {
				console.log(r);
				this.deleteUsers().then((res) => {
					console.log(res);
					document.getElementById('clearDataBtn').style.display = 'inline-block';
					document.getElementById('clearLoader').style.display = 'none';
					alert('DATA CLEARED SUCCCESSFULLY');
				}).catch((err) => {
					console.error(err);
				})
			}).catch((e) => {
				console.error(e);
				document.getElementById('clearDataBtn').style.display = 'inline-block';
				document.getElementById('clearLoader').style.display = 'none';
				alert('FAIL TO CLEAR DATA');
			});
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