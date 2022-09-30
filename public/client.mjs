import { createApp, reactive } from "https://unpkg.com/petite-vue?module";
import "/socket.io/socket.io.js";

//socket.io logic
const socket = io();
var foo = []

const p = ( value ) => {
  return JSON.stringify( value, null, 2 );

};

const webhookHistory = {
  Setter( value ) {
    localStorage.setItem( 'webhookHistory', value )
  },
  Getter() {
    localStorage.getItem( 'webhookHistory' )
  },
}

const store = reactive( {
  authKey: "",
  userName: "",
  data: [],

  dataUpdate( input ) {
    console.log( "state update" )
    this.data = [...this.data, input];
    console.log(this.data)
  },
  clearServerData() {
    foo = [];
    this.data = foo
    socket.emit("userClear", this.userName);
  },
  setUserName(p) {
    this.userName = p
  }
} );

const setUser = () => {
  if (localStorage.getItem( 'userName' ) === null) {
    let userN = prompt('Enter Your Name')
    localStorage.setItem( 'userName', userN )
    store.setUserName(userN);
  } else {
    store.setUserName(localStorage.getItem( 'userName' ));
  }
}

setUser();

socket.on( "webhookUpdate" + store.userName, function ( msg ) {
  console.log( "webhookUpdate" )
  //webhookHistory.Setter( JSON.stringify( msg ) );
  store.dataUpdate( msg )
} )

//functions and data needed for petite-vue state
createApp( { store, p } ).mount( "#WebhookData" );