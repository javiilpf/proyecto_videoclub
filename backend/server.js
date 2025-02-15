import app from './src/app.js';
import mongoose from 'mongoose';
import { config } from './src/config/config.js';

const PORT = config.PORT || 3000;

// Conectar a MongoDB y luego iniciar el servidor
mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1);
    });