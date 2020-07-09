import React from "react";
import { ProcessedDataSource } from "../../utils/Processing";
import { SVGText } from "./SVGText";
import {
  DATASOURCE_AND_DATAPURPOSE_LABEL_SIZE,
  DATASOURCE_AND_DATAPURPOSE_PADDING_LEFT,
  DATASOURCE_AND_DATAPURPOSE_PADDING_RIGHT
} from "../Constants";
import { BoxType, Colors, FixedLabels } from "../Data";
import { renderInfoButton } from "./SVGIcons";
import { SVGShortInfo } from "./SVGShortInfo";
import { getAbsoluteValue } from "../../utils/LayoutCalc";

interface Props {
  processedDataSource: ProcessedDataSource;
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

const SVGDataSource: React.FunctionComponent<Props> = props => {

  const boxType = props.boxTypes.find( item => item.id === props.processedDataSource.dataSource.typeId );
  if( !boxType ) {
    throw new Error( "Cannot find box type: " + props.processedDataSource.dataSource.typeId );
  }

  // selection state
  const selected = props.activeObjects.indexOf( props.processedDataSource.dataSource.id ) === 0;
  const related = props.activeObjects.includes( props.processedDataSource.dataSource.id );

  // box styling
  const boxFill = related ? boxType.color : boxType.colorInactive;
  const boxFilter = selected ? "url(#highlight)" : "url(#shadow)";
  const boxTextColor = related ? boxType.textColor : boxType.textColorInactive;

  // short info color
  const shortInfoFill = (related ? boxType.shortInfoActiveBackground : boxType.shortInfoBackground) ||"pink";
  const shortInfoTextColor = related ? 'white' : boxType.textColorInactive;

  return (
    <g
      cursor={"pointer"}
      onClick={() => {
        // nothing set
      }}
    >

      {/* Box */}
      <rect name={"source"}
            x={props.processedDataSource.x}
            y={props.processedDataSource.y}
            width={props.processedDataSource.width}
            height={props.processedDataSource.height}
            fill={boxFill}
            filter={props.isLowMode ? '' : boxFilter}
            onClick={props.onClick}
      />

      {/* Box Text */}
      <SVGText x={props.processedDataSource.x + getAbsoluteValue(props.canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_LEFT)}
               y={props.isLowMode ? props.processedDataSource.y + 10 : props.processedDataSource.y}
               height={props.processedDataSource.height}
               width={props.processedDataSource.width - getAbsoluteValue(props.canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_LEFT)
               - getAbsoluteValue(props.canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_RIGHT)}
               str={props.processedDataSource.dataSource.label}
               textSize={DATASOURCE_AND_DATAPURPOSE_LABEL_SIZE}
               fontWeight={'bolder'}
               color={boxTextColor}
               textAnchor={"middle"}
               onClick={props.onClick}
               canvasWidth={props.canvasWidth}
               colors={props.colors}
      />

      {/* Info Icon */}
      {!!props.processedDataSource.dataSource.info && (
        renderInfoButton(
          props.processedDataSource.x + props.processedDataSource.width * 0.96, props.processedDataSource.y  + props.processedDataSource.width * 0.04,
          props.infoIconSize,
          (related ? boxType.infoIconActiveBackground : boxType.infoIconBackground) || "pink",
          boxFill,
          () => props.onShowInfoText( props.processedDataSource.dataSource.infoTitle?[props.processedDataSource.dataSource.infoTitle]:undefined, props.processedDataSource.dataSource.info ) ,
          (props.fixedLabels.info || props.language.info!),
          props.isLowMode)
      )}

      {/* Short Info */}
      {!!props.processedDataSource.dataSource.shortInfo && (
        <SVGShortInfo shortInfo={props.processedDataSource.dataSource.shortInfo}
                      x={props.processedDataSource.x + props.processedDataSource.width - props.canvasWidth * 0.04}
                      y={props.processedDataSource.y + props.processedDataSource.height  - props.canvasWidth * 0.015}
                      width={props.processedDataSource.width * 0.4}
                      fill={shortInfoFill}
                      textColor={shortInfoTextColor}
                      canvasWidth={props.canvasWidth}
                      colors={props.colors}
        />
      )}

    </g>
  );

};

export { SVGDataSource };