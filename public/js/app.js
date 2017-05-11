const poster = (() => {
	let socket, groups = [], channels = [];

	const postMessage = e => {
		e.preventDefault();

		const message = document.getElementById('message'),
					link = document.getElementById('link');

		socket.emit('message', {
			message: message.value,
			link: link.value,
			fb_groups: groups,
			gitter_channels: channels
		});

		message.value = '';
		link.value = '';
	};

	const removeListItem = e => {
		const parent = e.target.parentNode, list = e.target.parentNode.id,
 					index = list == 'facebook-groups' ? groups.indexOf(e.target.innerHTML) 
 						: channels.indexOf(e.target.innerHTML);

		if ( list == 'facebook-groups' ) 
			groups.splice(index, 1);
		else channels.splice(index, 1);

		parent.removeChild(e.target);
	};

	const addToList = e => {
		let type = e.target.id, key, group;

		if ( e.target.nodeName == 'LI' ) {
			key = e.target.getAttribute('data-key');
			group = e.target.parentNode.id;
		}

		let input = type == 'add-group' ? document.getElementById('group')
					: document.getElementById('channel'), 
				group_list = document.getElementById('facebook-groups'),
				channel_list = document.getElementById('gitter-channels'),
				item = document.createElement('li');

		if ( !input.value && !key  ) return;

		if ( type == 'add-group' || group == 'fb-listing' ) {
			groups.push(input.value || key);
			item.innerHTML = input.value || key;
			group_list.appendChild(item);
		} else {
			channels.push(input.value || key);
			item.innerHTML = input.value || key;
			channel_list.appendChild(item);
		}
		input.value = '';
		item.addEventListener('click', removeListItem);
	};

	const init = () => {
		socket = io.connect('http://localhost:3000');

		const submit_btn = document.getElementById('submit'),
					group_btn = document.getElementById('add-group'),
					channel_btn = document.getElementById('add-channel');
					full_list_items = document.querySelectorAll('#full-list li');

		submit_btn.addEventListener('click', postMessage);
		group_btn.addEventListener('click', addToList);
		channel_btn.addEventListener('click', addToList);

		full_list_items.forEach(item => {
			item.addEventListener('click', addToList);
		});
	};

	return { init: init };
})();

poster.init();