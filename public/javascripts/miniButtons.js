var miniButtons = {
	init() {
		var buttons = document.getElementsByTagName('button');
		for (var b = 0; b < buttons.length; b++) {
			if (buttons[b].classList.contains('mini-button')) {
				buttons[b].addEventListener('click', (e) => {
					e.target.classList.add('clicked');
					setTimeout(() => {
						e.target.classList.remove('clicked');
					}, 300);
				})
			}
		}
	}
}

export default miniButtons;