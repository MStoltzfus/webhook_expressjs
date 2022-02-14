import { FunctionalComponent, h } from 'preact';
import { Stack, IStackTokens } from '@fluentui/react';
import { DefaultButton, PrimaryButton } from '@fluentui/react/lib/Button';

import Utils from '../../frontendUtils/frontendUtils';

import { Login } from '@microsoft/mgt-react';

const App: FunctionalComponent = () => {

    Utils.foo();
    console.log( process.env.NODE_ENV );

    return (
        <div>
            <div>
                <header>
                    <Login />
                </header>
            </div>
            <div id="preact_root">
                <h1>Test</h1>
                <h2>Test</h2>
                <h3>Test</h3>
                <p>Test</p>
            </div>
            <div style={{ maxWidth: "250px" }}>
                <Stack>
                    <DefaultButton text="Standard" />
                    <PrimaryButton text="Primary" />
                </Stack>
            </div>
        </div>
    );
};

export default App;
