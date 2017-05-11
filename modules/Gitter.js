import config from '../config';
import GitterN from 'node-gitter';

export default class Gitter {
	static post(message, link, channels) {
		const gitter = new GitterN(config.gitter_key);

		channels.forEach(channel => {
			gitter.rooms.join(channel)
			.then(room => {
				room.send(`${message} ${link}`);
			});	
		});		
	}
}