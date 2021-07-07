const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/Bands');

console.log('init server');

const bands = new Bands();
bands.addBand(new Band('Queen'));
bands.addBand(new Band('U2'));
bands.addBand(new Band('Green Day'));

// Mensajes de Socket
io.on('connection', client => {
    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        io.emit('mensaje', {admin: 'Nuevo mensaje'});
    });

    client.on('emitir-mensaje', (payload) => {
        client.broadcast.emit('nuevo-mensaje', payload);
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        bands.addBand(new Band(payload.name));
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
});