import express from 'express';
import cors from 'cors';
import routes from './routes';
import swaggerUi from 'swagger-ui-express';
import * as swaggerFile from '../swagger_output.json';

class App {
    public express: express.Application;

    constructor() {
        this.express = express();
        this.middlewares();
        this.routes();
    }

    private middlewares(): void {
        this.express
            .use(cors())
            .use(express.json())
            .use(express.urlencoded({ extended: true }));
    }

    private routes(): void {
        this.express.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
        this.express.use(routes);
    }
}

export default new App().express;