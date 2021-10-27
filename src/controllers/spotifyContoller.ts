import { Request, Response } from 'express';
import axios, { AxiosRequestConfig } from 'axios';
import qs from 'qs';
import Utils from '../utils/utils';
import dotenv from 'dotenv';
import FormSpotify from '../interfaces/FormSpotify';

dotenv.config();

class SpotifyController {

    public async login(req: Request, res: Response): Promise<Response> {
        /*
           #swagger.tags = ['Spotify']
           #swagger.description = 'Endpoint para pegar a url de login ao spotify.'
        } */
        const state = Utils.generateRandomString(16);
        const scope = 'user-read-private user-read-email';
        const queryString = qs.stringify({
            response_type: 'code',
            client_id:  process.env.CLIENT_ID,
            scope,
            redirect_uri: process.env.SPOTIFY_REDIRECT_HOST,
            state,
        });

        const data = {
            url: `https://accounts.spotify.com/authorize?${queryString}`
        };

        return res.status(200).json({ data });
    }

    public async getUser(accessToken: string): Promise<any> {

        const config: AxiosRequestConfig = {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
        };

        return await axios.get(`https://api.spotify.com/v1/me`, config).then((response) => {
            return response;
        });
    }

    public async getToken(form: FormSpotify): Promise<any> {
        const config: AxiosRequestConfig = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64')),
            },
        };

        const data = qs.stringify({
            code: form.code,
            grant_type: form.grant_type,
            redirect_uri: form.redirect_uri 
        });

        try {
            return await axios.post(`https://accounts.spotify.com/api/token`, data,  config).then((response) => {
                return response;
            });
        } catch (error) {
            console.error(error);
        }
    }

    public async callback(req: Request, res: Response): Promise<void> {
        /*
           #swagger.tags = ['Spotify']
           #swagger.description = 'Endpoint de callback pós login do usuario ao spotify.'
           #swagger.parameters['code'] = {
                type: 'string',
                required: true,
                in: 'query',
                example: 'as3412s12hg12kkn23b2',
            }
           #swagger.parameters['state'] = {
                type: 'string',
                required: true,
                in: 'query',
                example: '711E5fHFcFsmP68I',
            }
        } */
        const code = (req.query.code || '').toString();
        const state = req.query.state || null;
        let queryString = qs.stringify({
            error: 'state_mismatch'
        });

        if (state !== null) {
            const form: FormSpotify = {
                grant_type: 'client_credentials',
                code,
                redirect_uri: process.env.SPOTIFY_REDIRECT_HOST!,
            };

            const sporifyController = new SpotifyController();
            const { data, status } = await sporifyController.getToken(form);
            
            if (data && status === 200) {
                const accessToken = data.access_token;
                const refreshToken = data.refresh_token;

                queryString = qs.stringify({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });

            } else {
                queryString = qs.stringify({
                    error: 'invalid_token'
                });
            }
        }

        return res.redirect(`${process.env.WEB_URL}${queryString}`);
    }
}

export default new SpotifyController();