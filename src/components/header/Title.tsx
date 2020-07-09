/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from "react";
import { TITLE_LABEL_SIZE } from "../Constants";

interface Props {
  title: string;
  height: number;
  marginBottom: number;
}

const Title: React.FunctionComponent<Props> = props => {

  return (

    <div css={theme => ([{
      minHeight: props.height,
      marginBottom: props.marginBottom
    }])}>
      <h1 css={theme => ([{
        fontSize: TITLE_LABEL_SIZE + "vw",
        margin: 0
      }])}>{props.title}</h1>
    </div>
  );

};

export { Title };
