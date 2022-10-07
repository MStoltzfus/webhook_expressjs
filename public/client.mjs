import { createApp, reactive } from "https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js";
import "/socket.io/socket.io.js";

//socket.io logic
const socket = io();
var foo = []

var queryParams = new URLSearchParams( window.location.search );

const p = ( value ) => {
  return JSON.stringify( value, null, 2 );
};

const webhookHistory = {
  Setter( value ) {
    let foo = localStorage.getItem( 'webhookHistory' )
    if ( foo === null ) {
      localStorage.setItem( 'webhookHistory', [value] )
    } else {
      localStorage.setItem( 'webhookHistory', [...foo, value] )
    }
  },
  Getter() {
    localStorage.getItem( 'webhookHistory' )
  },
}

let localStoreUserNameConditionsArray = [
  localStorage.getItem( 'userName' ) === null,
  localStorage.getItem( 'userName' ) === undefined,
  localStorage.getItem( 'userName' ) === "null",
  localStorage.getItem( 'userName' ) === "",
]

let urlParamUserNameConditionsArray = [
  queryParams.get( 'userName' ) === null,
  queryParams.get( 'userName' ) === undefined,
  queryParams.get( 'userName' ) === "null",
  queryParams.get( 'userName' ) === ""
]

const store = reactive( {
  isUserNameSet: false,
  userName: "",
  data: [],

  dataUpdate( input ) {
    console.log( "state update" )
    this.data = [...this.data, input];
  },
  clearServerData() {
    foo = [];
    this.data = foo
    socket.emit( "userClear", this.userName );
  },
  setUserName( p ) {
    this.userName = p
  },
  webhookEndpoint() {
    return "https://webhooktester-beta.mstoltzf.us/webhook?userName=" + this.userName
  },
  setIsUserNameSet( input ) {
    this.isUserNameSet = input
  }
} );

async function copyURL() {
  // Get the text field
  var copyText = store.webhookEndpoint();

   // Copy the text
  await navigator.clipboard.writeText(copyText);

  // Alert the copied text
  alert("Copied the URL to Clipboard");
}

const isUserNameSet = () => {
  if ( localStoreUserNameConditionsArray.includes( true ) ) {
    if ( urlParamUserNameConditionsArray.includes( true ) ) {
      return false
    } else {
      let userN = queryParams.get('userName')
      localStorage.setItem( 'userName', userN )
      store.setUserName( userN );
      return true
    }
  } else {
    let userN = localStorage.getItem( 'userName' );
    store.setUserName( userN );
    return true
  }
}

store.setIsUserNameSet( isUserNameSet() )

socket.on( "serverRestart", function () {
  console.log( 'server Restart' )
  location.reload();
} )

socket.on( "webhookUpdate" + store.userName, function ( msg ) {
  console.log( "webhookUpdate" )
  webhookHistory.Setter( JSON.stringify( msg ) );
  store.dataUpdate( msg );
  console.log( webhookHistory.Getter() );
} )

//functions and data needed for petite-vue state
createApp( { store, p, copyURL } ).mount( "#WebhookData" );