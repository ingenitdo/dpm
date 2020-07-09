/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from "react";
import { SUBTITLE_LABEL_SIZE } from "../Constants";

interface Props {
  subtitle: string;
  height: number;
  marginBottom: number;
}

const SubTitle: React.FunctionComponent<Props> = props => {

  return (
    <div css={theme => ([{
      transition: '* 0.5s ease-in',
      height: props.height,
      marginBottom: props.marginBottom
    }])}>
      <h1 css={theme => ([{
        fontSize: SUBTITLE_LABEL_SIZE + "vw",
        margin: 0,
        opacity: props.height > 0 ? 1 : 0
      }])}>{props.subtitle}</h1>
    </div>
  );

};

export { SubTitle };
