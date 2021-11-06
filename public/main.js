const socket = new WebSocket( 'ws://localhost:3080' );

//listen for messages
socket.onmessage = ( { data } ) => {
    console.log( "Message from server", data );
};

const sendHello = () => {
    socket.send( 'hello' );
}