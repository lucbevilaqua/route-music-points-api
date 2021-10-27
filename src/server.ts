import app from './app';
import dotenv from 'dotenv';

dotenv.config();

app.listen({ port: process.env.PORT || 8888 }, () => {
    console.log(`🚀 Server ready on port: ${process.env.PORT || 8888}!`);
});