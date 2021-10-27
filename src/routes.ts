import { Router } from 'express';
import SpotifyContoller from './controllers/spotifyContoller';

const routes = Router();

routes.get('/get-url-login', SpotifyContoller.login);
routes.get('/callback', SpotifyContoller.callback);

export default routes;