import React from "react";
import {
  ProcessedConnection,
} from "../../utils/Processing";
import { EllipsisDialogData, SVGText } from "./SVGText";
import { CONNECTION_LABEL_SIZE, CONNECTION_STROKE_SIZE } from "../Constants";
import { getAbsoluteValue } from "../../utils/LayoutCalc";
import { Colors } from "../Data";

interface Props {
  processedConnection: ProcessedConnection;
  activeObjects: string[];
  canvasWidth: number;
  onEllipsisClick: ( ellipsisDialogData: EllipsisDialogData ) => void;
  showDetailedModel: boolean;
  isLowMode: boolean;
  colors: Colors;
}

const SVGConnection: React.FunctionComponent<Props> = props => {

  const conType = props.processedConnection.connectionType;
  const color = conType.color;
  const dasharray = !!conType.strokeDasharray ? conType.strokeDasharray : "1, 0";

  return (
    <g className={"Connection"}>

      {props.showDetailedModel && (
        <>
          <line x1={props.processedConnection.x1}
                y1={props.processedConnection.y1}
                x2={props.processedConnection.x2}
                y2={props.processedConnection.y2}
                stroke={color}
                filter={props.isLowMode ? '' : "url(#shadow)"}
                strokeDasharray={dasharray}
                strokeWidth={props.isLowMode ? '4px' : getAbsoluteValue( props.canvasWidth, CONNECTION_STROKE_SIZE )}
          />
          <path transform={props.processedConnection.arrowTranslate}
                d={props.processedConnection.arrowD}
                fill={color}
          />
        </>
      )}
      {!props.showDetailedModel && (
        <path
          transform={props.processedConnection.arrowTranslate}
          d={props.processedConnection.arrowD}
          fill={color}
        />
      )}


      {props.processedConnection.connection.label.length > 0 && (
        <SVGText x={props.processedConnection.textX}
                 y={props.processedConnection.textY}
                 height={props.processedConnection.textHeight}
                 width={props.processedConnection.textWidth}
                 str={[props.processedConnection.connection.label]}
                 textSize={CONNECTION_LABEL_SIZE}
                 textOverflow={'ellipsis'}
                 textEllipsis={props.showDetailedModel}
                 onEllipsisClick={props.onEllipsisClick}
                 colors={props.colors}
                 color={"black"} textAnchor={props.processedConnection.textAnchor}
                 canvasWidth={props.canvasWidth}
                 showDetailedModel={props.showDetailedModel}
        />
      )}


    </g>
  );

};

export { SVGConnection };