import graph from 'fbgraph';
import config from '../config';

export default class Facebook {

	static login(req, res, app) {
		if ( !req.query.code ) {

			const auth_url = graph.getOauthUrl({
				'client_id': config.fb_client_id,
				'redirect_uri': config.redirect_uri,
				'scope': config.fb_scope
			});

			if ( !req.query.error ) {
				res.redirect(auth_url);
			} else res.send('Access Denied');
		} else {

			graph.authorize({
				'client_id': config.fb_client_id,
				'redirect_uri': config.redirect_uri,
				'client_secret': config.fb_client_secret,
				'code': req.query.code
			}, (err, facebookRes) => {
				console.log('Logged In');
				res.render('index', { logged_in: true });
			});
		}
	}

	static post(message, link, groups) {
		let data = {};

		if ( link )
			data.link = link;
		data.message = message;

		groups.forEach(group => {
			graph.post(`/${group}/feed`, data, (err, res) => {
				if ( err )
					console.log(err);
				else console.log('Message posted to Facebook successfully!');
			});
		});
		
	}
}