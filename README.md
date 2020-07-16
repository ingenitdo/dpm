# Data Process Modeler - Viewer

## Introduction (in German)

Der Data Process Modeler ist ein Projekt der Themenplattform Verbraucherbelange des Zentrum Digitalisierung.Bayern der Bayern Innovativ GmbH. Die Entwicklung der Software wird vom Bayerischem Staatsministerium für Umwelt und Verbraucherschutz finanziert. Umgesetzt wird das Projekt von der concern GmbH und der ingenit GmbH.

Der Data Process Modeler soll Unternehmen dabei unterstützen, verbraucherfreundlicher zu werden: Sie können mit der Software auf einfache Weise anschaulich darstellen, welche Daten sie zu welchen Zwecken verarbeiten. Das erlaubt Verbraucher:innen, besser nachzuvollziehen, was mit ihren Daten geschieht und zu entscheiden, ob sie dieser Verwendung und dem damit verbundenen Geschäftsmodellzustimmen. Ein transparenter und vertrauenswürdiger Umgang mit Daten wird so zu einem Wettbewerbsvorteil für Unternehmen. 

Transparenz bei der Verarbeitung von Verbraucherdaten ist eine wichtige Dimension von Corporate Digital Responsibility, einem der Schwerpunkte der Themenplattform Verbraucherbelange. Die Software wird Ende 2020 fertiggestellt und beinhaltet dann auch eine intuitive Nutzeroberfläche zum einfachen Erstellen von Grafiken.

Disclaimer: Über das Projekt wird nur die zur Darstellung nötige Software entwickelt. Die mit der Software visualisierten Inhalte werden vom Verwender der Software erstellt und sind den hier aufgeführten Organisationen weder bekannt noch durch diese geprüft.

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
