import React from "react";
import { Colors, Participant } from "../Data";

interface Props {
  participant: Participant;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  index: number;
  canvasWidth: number;
  colors: Colors;
  isLowMode: boolean;
}

const SVGParticipant: React.FunctionComponent<Props> = props => {

  return (
    <g className={"Participant"} key={props.participant.id}
       filter={props.isLowMode ? '' : 'url(#shadow)'}>
      <rect x={props.x}
            y={0}
            width={props.width}
            height={props.height}
            fill={props.colors.participantBackground}
            strokeWidth={"1px"}
            stroke={props.colors.participantBorder}
      />
    </g>
  );

};

export { SVGParticipant };