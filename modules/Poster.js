import express from 'express';
import http from 'http';
import methodOverride from 'method-override';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import path from 'path';
import socket from 'socket.io';
import Facebook from './Facebook';
import Gitter from './Gitter';


export default class Poster {
	constructor() {
		this.setupServer();
	}

	setupServer() {
		const app = express();
		this.server = http.Server(app);
		this.server.listen(3000);

		app.use(methodOverride());
		app.use(express.static(path.join(__dirname, '/../public')));
		app.set('views', `${__dirname}/../views`);
		app.set('view engine', 'pug');
		app.use(bodyParser.urlencoded({
			extended: true
		}));

		this.setupSocket(app);
	}

	setupSocket(app) {
		const io = socket(this.server);
		app.get('/', (req, res) => {
			res.render('index');
		});

		io.on('connection', socket => {
			this.socket = socket;
			console.log('Socket Connected');

			this.app = app;
			this.setupRoutes();			
		});
	}

	setupRoutes() {
		this.app.get('/auth', (req, res) => {
			Facebook.login(req, res, this.app);
		});

		this.socket.on('message', this.postMessage);
	}

	postMessage(data) {
		Gitter.post(data.message, data.link, data.gitter_channels);
		// Facebook.post(data.message, data.link, data.fb_groups);
	}
}