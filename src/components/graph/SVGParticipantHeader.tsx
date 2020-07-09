import React from "react";
import { Colors, Participant } from "../Data";
import { renderIconDatabase, renderIconGroup, renderIconUser } from "./SVGIcons";
import { getStringArrayByWidth } from "../../utils/Processing";
import {
  HEADER_HEIGHT, HEADER_MARGIN_BOTTOM,
  PARTICIPANTS_LABEL_SIZE
} from "../Constants";
import { SVGText } from "./SVGText";
import { getAbsoluteValue } from "../../utils/LayoutCalc";

interface Props {
  participant: Participant;
  x: number;
  y: number;
  width: number;
  fontSize: number;
  index: number;
  canvasWidth: number;
  yScrollOffset: number;
  colors: Colors;
  isLowMode: boolean;
}

const SVGParticipantHeader: React.FunctionComponent<Props> = props => {

  const iconSize = props.width * 0.3;
  const iconY = getAbsoluteValue( props.canvasWidth, HEADER_HEIGHT ) * 0.4 + props.yScrollOffset;
  const iconX = props.x + props.width * 0.05;

  const textX = props.x + props.width * 0.4;
  const textY = getAbsoluteValue( props.canvasWidth, HEADER_HEIGHT ) * 0.4;
  const textWidth = props.width * 0.9;

  const height = getAbsoluteValue( props.canvasWidth, HEADER_HEIGHT);

  const textRows =
    props.participant.label.map( ( label: string ) => {
      return getStringArrayByWidth( label, textWidth, getAbsoluteValue(props.canvasWidth, PARTICIPANTS_LABEL_SIZE) ).length;
    } ).reduce( ( sum, current ) => sum + current, 0 );

  const textHeight = textRows * getAbsoluteValue(props.canvasWidth, PARTICIPANTS_LABEL_SIZE);


  return (
    <g className={"Participant"} key={props.participant.id}
>
      <rect x={props.x}
            y={props.yScrollOffset}
            width={props.width}
            height={height + getAbsoluteValue( props.canvasWidth, HEADER_MARGIN_BOTTOM)}
            fill={props.colors.participantBackground}
            strokeWidth={"1px"}
            filter={props.isLowMode ? '' : 'url(#shadow_sides)'}
      />

      {/*BACKGROUND BLUR*/}
      <rect x={props.x}
            y={props.yScrollOffset + height +getAbsoluteValue( props.canvasWidth, HEADER_MARGIN_BOTTOM) - 2}
            width={props.width}
            height={getAbsoluteValue( props.canvasWidth, HEADER_MARGIN_BOTTOM)}
            fill={props.colors.participantBackgroundGradient}
      />

      <SVGText x={textX}
               y={textY + props.yScrollOffset}
               height={textHeight}
               width={textWidth}
               str={props.participant.label}
               textSize={PARTICIPANTS_LABEL_SIZE}
               fontWeight={'bold'}
               color={props.colors.participantLabel}
               textAnchor={"start"}
               canvasWidth={props.canvasWidth}
               colors={props.colors}
      />

      {props.index === 0 && renderIconUser( iconX, iconY, iconSize, iconSize, props.colors.participantIcon, props.colors.participantBackground)}
      {props.index === 1 && renderIconGroup( iconX, iconY, iconSize, iconSize, props.colors.participantIcon, props.colors.participantBackground)}
      {props.index === 2 && renderIconDatabase( iconX, iconY, iconSize, iconSize, props.colors.participantIcon)}


    </g>
  );

};

export { SVGParticipantHeader };