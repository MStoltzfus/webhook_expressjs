import "/socket.io/socket.io.js";
import * as Preact from 'https://unpkg.com/preact@10.4.7/dist/preact.module.js'
import htm from 'https://unpkg.com/htm@3.0.4/dist/htm.module.js'

const prettyData = ( value ) => {
    return JSON.stringify( value, null, 2 );
};

const socket = io();
var foo = []
socket.on( "webhookUpdate", function ( msg ) {
    console.log( "webhookUpdate" )
    //webhookHistory.Setter( JSON.stringify( msg ) );
    foo.push( msg )
    console.log( foo )
    App.addTodo(prettyData(foo))
} )

// 2. make htm import work with Preact import
const html = htm.bind( Preact.createElement )
// 3. define Header component
class Header extends Preact.Component {
    render() {
        return html`
        <Header>
            <h1 class="text-4xl">Webhook Test App</h1>
        </Header>
        `
    }
}
// 4. define Footer component
class Footer extends Preact.Component {
    render() {
        return html`
        <a href="/chatclient">Socket.IO Chat Client</a>
        `
    }
}
// 5. define App component
class App extends Preact.Component {
    constructor() {
        super()
        this.state = {
            todos: []
        }
    }
    addTodo(input) {
        const { todos } = this.state
        this.setState( {
            todos: todos.concat( input )
        } )
    }
    render() {
        const { todos } = this.state
        return html`
            
            <div class="app">
                <${Header}></Header>
                <button 
                    class="bg-purple-200 font-bold mt-4 p-3 rounded shadow text-xl uppercase">
                    Clear Data
                </button>
                <ul>
                    ${todos.map( todo => html`
                    <li key="${todo}">${todo}</li>
                    `)}
                </ul>
            </div>
            <${Footer}></Footer>
        `
    }
}
// 6. append rendered App component to node document.body
Preact.render( html`<${App} page="All"></App>`, document.body )