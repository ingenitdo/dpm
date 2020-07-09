import React from "react";
import { ProcessedDataPurpose } from "../../utils/Processing";
import { SVGText } from "./SVGText";
import {
  DATASOURCE_AND_DATAPURPOSE_LABEL_SIZE,
  DATASOURCE_AND_DATAPURPOSE_PADDING_LEFT,
  DATASOURCE_AND_DATAPURPOSE_PADDING_RIGHT
} from "../Constants";
import { BoxType, Colors, FixedLabels } from "../Data";
import { renderInfoButton } from "./SVGIcons";
import { SVGShortInfo } from "./SVGShortInfo";
import Color from "color";
import { getAbsoluteValue } from "../../utils/LayoutCalc";

interface Props {
  processedDataPurpose: ProcessedDataPurpose;
  boxTypes: BoxType[];
  activeObjects: string[];
  onShowInfoText: ( title: string[] | undefined, content: string | undefined ) => void;
  onClick: () => void;
  canvasWidth: number;
  infoIconSize: number;
  fixedLabels: FixedLabels;
  language: FixedLabels;
  isLowMode: boolean;
  colors: Colors;
}

const SVGDataPurpose: React.FunctionComponent<Props> = props => {

  const boxType = props.boxTypes.find( item => item.id === props.processedDataPurpose.dataPurpose.typeId );
  if( !boxType ) {
    throw new Error( "Cannot find box type: " + props.processedDataPurpose.dataPurpose.typeId );
  }

  // selection state
  const selected = props.activeObjects.indexOf( props.processedDataPurpose.dataPurpose.id ) === 0;
  const related = props.activeObjects.includes( props.processedDataPurpose.dataPurpose.id );

  // box styling
  const boxFill = related ? boxType.color : boxType.colorInactive;
  const boxFilter = selected ? "url(#highlight)" : "url(#shadow)";
  const textColor = related ? boxType.textColor : boxType.textColorInactive;

  // short info color
  const shortInfoFill = related ? "#006BA2" : Color( boxType.colorInactive ).darken( 0.03 ).string();
  const shortInfoTextColor = related ? boxType.textColor : boxType.textColorInactive;

  return (
    <g cursor={"pointer"}
       onClick={() => {
         // nothing yet
       }}
    >

      {/* Box */}
      <rect name={"source"}
            x={props.processedDataPurpose.x}
            y={props.processedDataPurpose.y}
            width={props.processedDataPurpose.width}
            height={props.processedDataPurpose.height}
            fill={boxFill}
            filter={props.isLowMode ? '' : boxFilter}
            onClick={props.onClick}
      />

      {/* Box Text */}
      <SVGText x={props.processedDataPurpose.x + getAbsoluteValue(props.canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_LEFT)}
               y={props.isLowMode ? props.processedDataPurpose.y + 10 : props.processedDataPurpose.y}
               height={props.processedDataPurpose.height}
               width={props.processedDataPurpose.width - getAbsoluteValue(props.canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_LEFT)
               - getAbsoluteValue(props.canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_RIGHT)}
               str={props.processedDataPurpose.dataPurpose.label}
               textSize={DATASOURCE_AND_DATAPURPOSE_LABEL_SIZE}
               fontWeight={'bolder'}
               color={textColor}
               textAnchor={"middle"}
               onClick={props.onClick}
               canvasWidth={props.canvasWidth}
               colors={props.colors}
      />

      {/* Info Icon */}
      {!!props.processedDataPurpose.dataPurpose.info && (
        renderInfoButton(
          props.processedDataPurpose.x + props.processedDataPurpose.width * 0.96, props.processedDataPurpose.y  + props.processedDataPurpose.width * 0.04,
          props.infoIconSize,
          (related ? boxType.infoIconActiveBackground : boxType.infoIconBackground) || "pink",
          boxFill,
          () => props.onShowInfoText( props.processedDataPurpose.dataPurpose.infoTitle?[props.processedDataPurpose.dataPurpose.infoTitle]:undefined, props.processedDataPurpose.dataPurpose.info ),
          (props.fixedLabels.info || props.language.info!),
          props.isLowMode
        )
      )}

      {/* Short Info */}
      {!!props.processedDataPurpose.dataPurpose.shortInfo && (
        <SVGShortInfo shortInfo={props.processedDataPurpose.dataPurpose.shortInfo}
                      x={props.processedDataPurpose.x+ props.processedDataPurpose.width - props.canvasWidth * 0.04}
                      y={props.processedDataPurpose.y + props.processedDataPurpose.height  - props.canvasWidth * 0.015}
                      width={props.processedDataPurpose.width * 0.5}

                      fill={shortInfoFill}
                      textColor={shortInfoTextColor}
                      canvasWidth={props.canvasWidth}
                      colors={props.colors}
        />
      )}

    </g>
  );

};

export { SVGDataPurpose };