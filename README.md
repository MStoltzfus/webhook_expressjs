# webhook_expressjs

Just a simple ExpressJS app that opens up a server on localhost:3050 and uses the localtunnel API to automatically create a publicly accessible tunnel link to the app.
It was created as a way to accept incoming webhooks on your local machine as an alternative to creating Microsoft PowerAutomate Flows or relying on something like RequestBin & Pipedream.

Allows for GET requests on the "/", "/webhook", and "/url" routes (the "/url" route returns the public localtunnel URL)
It also allows for POST requests of JSON data to the "/" and "/webhook" routes, and will console log the parsed data.

Node Dependencies - "expressJS", "localtunnel", "momentJS", and "nodemon"

You can download the project using "git clone https://github.com/MStoltzfus/webhook_expressjs/" (requires Git to be installed on your local machine)
To download/install the Node dependencies used in this project, run "npm install" (requires Node to be installed on your local machine)
The app can be started using the "npm start" command from the root directory (typically 'dir'/webhook_expressjs; requires Node to be installed on your local machine)
Connection URLs for both local and public connections to the app will be displayed upon successful launch of the app in your console.
