import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { DETAILED_MODEL, SIMPLE_MODEL } from "./components/Constants";

function init( container: Element, detailedModel: any, simpleModel: any ) {
  ReactDOM.render(
    <React.StrictMode>
      <App detailedModel={detailedModel} simpleModel={simpleModel}/>
    </React.StrictMode>,
    container
  );
}

//@ts-ignore
window.initDpmViewer = init;

let container = document.querySelector( "*[dpm-viewer]" );

if(process.env.NODE_ENV === 'development') {
  init( container!, DETAILED_MODEL, SIMPLE_MODEL );
} else {
  if( !!container ) {
    let detailedModelUrl = container.getAttribute( "data-detailed-model-url" );
    let simpleModelUrl = container.getAttribute( "data-simple-model-url" );

    if( !!detailedModelUrl && !!simpleModelUrl ) {

      fetch( detailedModelUrl ).then( detailedModelResponse => {
        detailedModelResponse.json().then( detailedModel => {
          fetch( simpleModelUrl! ).then( simpleModelResponse => {
            simpleModelResponse.json().then( simpleModel => {
              init( container!, detailedModel, simpleModel );
            } )
          } );

        } );

      } );
    }
  }
}
