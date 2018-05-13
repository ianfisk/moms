(function () {
	if (document.readyState !== 'loading') {
		configureFormCompletionHandler();
	} else {
		document.addEventListener('DOMContentLoaded', configureFormCompletionHandler);
	}

	const modalBackdropClass = 'my-modal-backdrop';

	function configureFormCompletionHandler () {
		const button = document.getElementById('generate-message-button');
		button.addEventListener('click', e => {
			e.preventDefault();

			const data = getDataFromForm();
			const momMessageUrl = generateMessageUrl(data);
			shortenLink(momMessageUrl).then(shortenedUrl => {
				openLinkModal(shortenedUrl, data);
			});
		});
	}

	function getDataFromForm() {
		return ['momName', 'birthdate', 'faveThing'].reduce((data, id) => {
			data[id] = document.getElementById(id).value;
			return data;
		}, {});
	}

	function generateMessageUrl(messageData) {
		const queryString = window.btoa(JSON.stringify(messageData));
		const momMessageUrl = window.location.href.slice(0, window.location.href.lastIndexOf('/')) + '/message.html?data=' + queryString;
		return momMessageUrl;
	}

	function shortenLink(momMessageUrl) {
		return fetch('https://api-ssl.bitly.com/v3/shorten?access_token=3f45e4e4d03050ffb81c3a4c33a18db65702e031&longUrl=' + fixedEncodeURIComponent(momMessageUrl))
			.then(response => response.ok ? response.json() : Promise.resolve({}))
			.then(json => json.status_code === 200 ? json.data.url : momMessageUrl)
			.catch(() => momMessageUrl);
	}

	function openLinkModal(link, data) {
		const linkInput = document.getElementById('linkContainer');
		linkInput.value = link;

		const modalTitle = document.getElementById('modalTitle');
		modalTitle.textContent = 'Send this to ' + (data.momName || 'Mom');

		const linkModal = document.getElementById('link-modal');
		linkModal.className = linkModal.className + ' ' + modalBackdropClass;
		linkModal.style.display = 'block';
		linkModal.style.opacity = 1;

		const copyButton = document.getElementById('copyButton');
		if (deviceIsIos()) {
			copyButton.style.display = 'none';
			linkInput.addEventListener('click', () => {
				linkInput.select();
			});
		} else {
			copyButton.addEventListener('click', () => {
				copyToClipboard(linkInput);
			});
		}

		const modalCloseButtons = document.getElementsByClassName('close-button');
		for (let i = 0; i < modalCloseButtons.length; i++) {
			modalCloseButtons[i].addEventListener('click', closeModal);
		}

		linkModal.addEventListener('click', modalBackdropClick);
	}

	function modalBackdropClick(e) {
		const linkModal = document.getElementById('link-modal');
		if (e.target === linkModal) {
			linkModal.removeEventListener('click', modalBackdropClick);
			closeModal();
		}
	}

	function closeModal() {
		const linkModal = document.getElementById('link-modal');
		const indexOfClassToRemove = linkModal.className.indexOf(modalBackdropClass);
		const className = linkModal.className.slice(0, indexOfClassToRemove)
			+ linkModal.className.slice(indexOfClassToRemove + modalBackdropClass.length);

		linkModal.className = className;
		linkModal.style.display = 'none';
		linkModal.style.opacity = 0;

		const modalCloseButtons = document.getElementsByClassName('close-button');
		for (let i = 0; i < modalCloseButtons.length; i++) {
			modalCloseButtons[i].removeEventListener('click', closeModal);
		}
	}

	function copyToClipboard(inputOrTextArea) {
		inputOrTextArea.select();
		document.execCommand('copy');
	}

	function deviceIsIos() {
		return navigator.userAgent.match(/ipad|ipod|iphone/i);
	}

	function fixedEncodeURIComponent(str) {
		return encodeURIComponent(str).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16));
	}
})()
