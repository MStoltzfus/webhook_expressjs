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
  testKey: false,
  userName: "",
  webhookEndpoint: "",
  data: [],

  dataUpdate( input ) {
    console.log( "state update" )
    this.data = [...this.data, input];
    console.log( this.data )
  },
  clearServerData() {
    foo = [];
    this.data = foo
    socket.emit( "userClear", this.userName );
  },
  setUserName( p ) {
    this.userName = p
  },
  setWebhookEndpoint() {
    let stuff = this.webhookEndpoint = "https://webhooktester-beta.mstoltzf.us/webhook?userName=" + this.userName
    return stuff
  }
} );

const setUser = () => {

  let conditionsArray = [
    localStorage.getItem( 'userName' ) === null,
    localStorage.getItem( 'userName' ) === undefined,
    localStorage.getItem( 'userName' ) === "null",
    localStorage.getItem( 'userName' ) === ""
  ]

  if ( conditionsArray.includes( true ) ) {
    let userN = prompt( 'Enter Your Name' )
    localStorage.setItem( 'userName', userN )
    store.setUserName( userN );
  } else {
    store.setUserName( localStorage.getItem( 'userName' ) );
  }
}

setUser();
console.log( store.setWebhookEndpoint() )

socket.on( "webhookUpdate" + store.userName, function ( msg ) {
  console.log( "webhookUpdate" )
  //webhookHistory.Setter( JSON.stringify( msg ) );
  store.dataUpdate( msg )
} )

//functions and data needed for petite-vue state
createApp( { store, p } ).mount( "#WebhookData" );