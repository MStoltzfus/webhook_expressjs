if ( process.env.NODE_ENV === 'development' ) {
    // Must use require here as import statements are only allowed
    // to exist at top-level.
    require( "preact/debug" );
}
import './style/index.css';
import App from './components/app';

import { Providers } from '@microsoft/mgt-element';
import { Msal2Provider } from '@microsoft/mgt-msal2-provider';

Providers.globalProvider = new Msal2Provider( {
    clientId: 'e28cca12-9489-4045-9940-81b851d60c05'
} );

export default App;
