const express = require('express');
const path = require('path');
const sgMail = require('@sendgrid/mail'); // Importar SendGrid

// Configurar la clave API de SendGrid
sgMail.setApiKey('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'); // Reemplaza 'TU_API_KEY' con tu clave de SendGrid

// Inicializar la aplicación Express
const app = express();

// Configurar carpeta pública para estilos y recursos
app.use(express.static('public'));



// Middlewares para procesar datos
app.use(express.json()); // Manejar datos en formato JSON
app.use(express.urlencoded({ extended: true })); // Manejar datos enviados por formularios

// Ruta para servir la página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Función para enviar correos usando SendGrid
function enviarCorreo(destinatario, asunto, mensaje) {
    const email = {
        to: destinatario, // Destinatario del correo
        from: 'enigmistgame@gmail.com', // Cambia esto por el correo verificado en SendGrid
        subject: asunto, // Asunto del correo
        html: mensaje // Contenido del correo en HTML
    };

    sgMail
        .send(email)
        .then(() => console.log('Correo enviado con éxito'))
        .catch((error) => console.error(`Error al enviar el correo: ${error.message}`));
}

// Ruta para manejar el registro
app.post('/register', (req, res) => {
    const { username, email, whatsapp } = req.body;

    console.log(`Usuario registrado: ${username}, ${email}, ${whatsapp}`);

    // Contenido del correo
    const mensajeCorreo = `
        <h1>Bienvenido, ${username}</h1>
        <p>El Pastor te ha elegido. Aquí está tu primera pista:</p>
        <p><strong>"La luz en las tinieblas te guiará."</strong></p>
        <p><img src="https://via.placeholder.com/400x200" alt="Foto de Clara"></p>
        <p>Haz clic aquí para comenzar: <a href="http://localhost:3000/partida">Comenzar Partida</a></p>
    `;

    // Enviar correo
    enviarCorreo(email, 'Tu primera pista del Pastor', mensajeCorreo);

    // Contenido del mensaje de WhatsApp
    if (whatsapp) {
        const mensajeWhatsApp = `
            Bienvenido, ${username}.
            El Pastor te ha enviado esta pista: "La luz en las tinieblas te guiará."
            Accede aquí para comenzar: http://localhost:3000/partida
        `;
        enviarWhatsApp(whatsapp, mensajeWhatsApp);
    }

    res.send('Registro exitoso. Revisa tu correo o WhatsApp para continuar.');
});




// Inicia el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

// Twilio

const twilio = require('twilio');

// Configuración de Twilio
const client = twilio('ACa497bc4d603843d237fb76e16e6e863c', '15f37d00e13cf0ad15fb0d62c75a20af'); // Reemplaza con tus credenciales

//  Función para enviar mensajes de WhatsApp:

function enviarWhatsApp(destinatario, mensaje) {
    client.messages
        .create({
            from: 'whatsapp:+14155238886', // Número de Twilio
            to: `whatsapp:${destinatario}`, // Número del jugador en formato internacional (+34 para España)
            body: mensaje // Contenido del mensaje
        })
        .then((message) => console.log(`WhatsApp enviado: ${message.sid}`))
        .catch((error) => console.error(`Error al enviar WhatsApp: ${error}`));
}

// Te lleva a la partida
app.get('/partida', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'partida.html'));
});

// Validación del formulario para comenzar la partida
app.post('/validate', (req, res) => {
    const { username, password, key } = req.body;

    // Mostrar los datos enviados en la terminal
    console.log(req.body);

    // Ejemplo de datos válidos (puedes reemplazar esto con lógica más compleja)
    const usuarioValido = 'jugador1';
    const contraseñaValida = 'clave123';
    const claveInicialValida = 'luz';

    // Validar las credenciales
    if (username === usuarioValido && password === contraseñaValida && key === claveInicialValida) {
        res.json({ success: true }); // Respuesta JSON de éxito
    } else {
        res.json({ success: false, message: 'Credenciales incorrectas. Intenta de nuevo.' }); // Respuesta JSON de error
    }
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'game.html'));
});





