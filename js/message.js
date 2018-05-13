(function () {
	const messageItemClass = 'message-item';
	const messageCreators = [
		messageData => 'Dear ' + (messageData.momName || 'Mom') + ',',
		() => "Happy Mother's Day! This day is for you.",
		messageData => 'On ' + (messageData.birthdate || 'my birthday') + ', you became my ' + (messageData.momName || 'Mom') + '.',
		messageData => 'From that day forward, I have loved spending time with you, learning from you, and ' + (messageData.faveThing || 'being') + ' with you.',
		() => 'I love you, Mom. ❤️',
	];

	let currentMessageIndex = 0;
	let linkTimeout = null;

	function showMessages() {
		const query = parseQuery(window.location.search);
		const messageData = getMessageData(query);

		const mainElem = document.querySelector('.main');
		messageCreators.forEach(messageCreator => {
			const messageElem = createMessageItem(messageCreator(messageData));
			mainElem.appendChild(messageElem);
		});

		document.getElementById('downArrowButton').addEventListener('click', handleMoveToNextMessage);
		document.addEventListener('keydown', e => {
			if (e.key === 'ArrowUp') {
				handleMoveToNextMessage('up');
			} else if (e.key === 'ArrowDown') {
				handleMoveToNextMessage('down');
			}
		});
	}

	function createMessageItem(message) {
		const itemContainer = document.createElement('div');
		itemContainer.className = messageItemClass;

		const item = document.createElement('span');
		item.className = 'message-item-text';
		item.textContent = message;
		itemContainer.appendChild(item);

		return itemContainer;
	}

	function handleMoveToNextMessage(direction) {
		clearTimeout(linkTimeout);

		const messages = document.getElementsByClassName(messageItemClass);
		if (direction === 'up') {
			currentMessageIndex = Math.max(0, currentMessageIndex - 1);
		} else {
			currentMessageIndex = Math.min(messages.length - 1, currentMessageIndex + 1);
		}

		const downArrow = document.getElementById('downArrowButton');
		const indexLink = document.getElementById('indexLink');
		if (currentMessageIndex === messages.length - 1) {
			downArrow.style.display = 'none';
			indexLink.style.display = 'inline-block';
			linkTimeout = setTimeout(() => {
				indexLink.style.opacity = 1;
			}, 2000);
		} else {
			downArrow.style.display = 'inline-block';
			indexLink.style.display = 'none';
			indexLink.style.opacity = 0;
		}

		const currentMessage = messages[currentMessageIndex];
		TweenLite.to(
			document.querySelector('.main'),
			1.5,
			{
				scrollTo: currentMessage.offsetTop,
				ease: Power3.easeInOut,
			}
		);
	}

	function parseQuery(query) {
		let parsedQuery = {};
		if (query) {
			if (query[0] === '?') {
				query = query.slice(1);
			}

			const paramsAndValues = query.split('&').filter(x => x);
			parsedQuery = paramsAndValues.reduce((acc, paramAndValue) => {
				const indexOfEquals = paramAndValue.indexOf('=');

				let key;
				let value;
				if (indexOfEquals !== -1) {
					key = paramAndValue.slice(0, indexOfEquals);
					value = paramAndValue.slice(indexOfEquals + 1);
				} else {
					key = paramAndValue;
					value = true;
				}

				acc[key] = value;
				return acc;
			}, {});
		}

		return parsedQuery;
	}

	function getMessageData(parsedQuery) {
		try {
			return JSON.parse(window.atob(parsedQuery.data));
		} catch (e) {
			return {};
		}
	}

	if (document.readyState !== 'loading') {
		showMessages();
	} else {
		document.addEventListener('DOMContentLoaded', showMessages);
	}
})()
