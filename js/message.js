(function () {
	const messageItemClass = 'message-item';
	const messageCreators = [
		messageData => 'Dear Mom, aka ' + messageData.momName + '.',
		() => "Happy Mother's Day! This day is yours.",
		messageData => 'On ' + messageData.birthdate + ', your life was forever changed when I came into this world, and I can never be thankful enough.',
		messageData => 'I am so grateful you are my mother. I love spending time with you, ' + messageData.faveThing + ' with you, doing all the things with you.',
		() => 'I love you, Mom. ❤️',
	];

	let currentMessageIndex = 0;

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
		item.textContent = message;
		itemContainer.appendChild(item);

		return itemContainer;
	}

	function handleMoveToNextMessage(direction) {
		const messages = document.getElementsByClassName(messageItemClass);
		if (direction === 'up') {
			currentMessageIndex = Math.max(0, currentMessageIndex - 1);
		} else {
			currentMessageIndex = Math.min(messages.length - 1, currentMessageIndex + 1);
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
