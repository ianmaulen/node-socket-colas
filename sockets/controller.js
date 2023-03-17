const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();

const socketController = (socket) => {
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    socket.emit('ultimos-tickets', ticketControl.ultimos4);
    socket.emit('actualizar-cola', ticketControl.tickets.length);

    socket.on('siguiente-ticket', ( payload, callback ) => {
        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.emit('actualizar-cola', ticketControl.tickets.length);
        socket.broadcast.emit('actualizar-cola', ticketControl.tickets.length);
    });

    socket.on('atender-ticket', ( {escritorio}, callback ) => {
        if(!escritorio) {
            return callback({
                ok: false,
                msg: 'el escritorio es obligatorio'
            })
        }
        

        const ticket = ticketControl.atenderTicket(escritorio);

        socket.broadcast.emit('ultimos-tickets', ticketControl.ultimos4);
        socket.broadcast.emit('actualizar-cola', ticketControl.tickets.length);
        socket.emit('actualizar-cola', ticketControl.tickets.length);
        if (!ticket) {
            callback({
                ok: false,
                msg: 'Ya no hay tickets por atender'
            })
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    });
    
    
}

module.exports = {
    socketController
}