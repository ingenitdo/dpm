import React from 'react';
import './App.css';
import { Main } from './components/Main';
import { Global } from "@emotion/core";
import { css } from "emotion";

interface Props {
  detailedModel: any;
  simpleModel: any;
}

const App: React.FunctionComponent<Props> = props => {

  return (
    <>
      <Global
        styles={css`
        body {
          position: fixed;
          width: 100%;
          height: 100%;
          background-color: hotpink !important;
        }
        svg{
          g {
          min-height: 10px;  
          }
          
        }
        .label {
          color: green;
          font-size: 10px;
        }
      `}
      />

      <Main detailedModel={props.detailedModel} simpleModel={props.simpleModel}/>


    </>
  );
};

export default App;
