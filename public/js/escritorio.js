// HTML References 
const lblEscritorio = document.querySelector('h1');
const btnAtender = document.querySelector('button');
const lblTicket = document.querySelector('small');
const divalert = document.querySelector('.alert');
const lblPendientes = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('El escritorio es obligatorio');
}

const escritorio = searchParams.get('escritorio');
lblEscritorio.innerText = escritorio;
divalert.style.display = 'none';

const socket = io();

socket.on('connect', () => {
    // console.log('Conectado');
  btnAtender.disabled = false;
});

socket.on('disconnect', () => {
    // console.log('Desconectado del servidor');
  btnAtender.disabled = true;
});

socket.on('ultimo-ticket', (ultimo) => {
 // lblNuevoTicket.innerText = 'Ticket: ' + ultimo;
});

socket.on('actualizar-cola', (payload) => {
  lblPendientes.innerText = payload
});

btnAtender.addEventListener( 'click', () => {
  socket.emit('atender-ticket', {escritorio}, ({ok, ticket, msg}) => {
    if(!ok) {
      lblTicket.innerText = 'nadie';
      return divalert.style.display = '';
    }

    lblTicket.innerText = `Ticket: ${ticket.numero}`
  });

    // socket.emit( 'siguiente-ticket', null, ( ticket ) => {
    //   lblNuevoTicket.innerText = ticket;
    // });
});