import app from './src/app.js';
import mongoose from 'mongoose';
import { config } from './src/config/config.js';

const PORT = config.PORT || 3000;

mongoose.set('strictQuery', false);

// Conectar a MongoDB y luego iniciar el servidor
mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Conectado a MongoDB en:', config.MONGODB_URI);
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
})
.catch(error => {
    console.error('Error detallado conectando a MongoDB:', error);
    process.exit(1);
});

// Manejar errores después de la conexión inicial
mongoose.connection.on('error', err => {
    console.error('Error de MongoDB:', err);
});