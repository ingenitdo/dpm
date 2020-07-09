# Data Process Modeler - Viewer

## Requirements

* NodeJS 12.x
  * https://nodejs.org/en/download/


## Initial Setup

Run this to install all required dependencies:

    npm install
    
Done!


## Development

Run this to start the development server:

    npm start

Now open your browser: http://localhost:3000/


## Production build

Run the production build:

    npm run build

Deploy the result:

    cp -a ./build/* /var/www/htdocs
    
Place or update the model files under

    /var/www/htdocs/models/detailed-model.json
    /var/www/htdocs/models/simple-model.json            

Done!