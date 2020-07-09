import React from "react";
import { ProcessedAction, ProcessedParticipant } from "../../utils/Processing";
import { SVGText } from "./SVGText";
import {
  ACTION_LABEL_SIZE,
  ACTION_PADDING_LEFT,
  ACTION_PADDING_RIGHT, DATASOURCE_AND_DATAPURPOSE_LABEL_SIZE
} from "../Constants";
import { BoxType, Colors, FixedLabels } from "../Data";
import { renderInfoButton } from "./SVGIcons";
import { SVGShortInfo } from "./SVGShortInfo";
import { SVGPolicyTrigger } from "./SVGPolicyTrigger";
import { getAbsoluteValue } from "../../utils/LayoutCalc";

interface Props {
  processedAction: ProcessedAction;
  boxTypes: BoxType[];
  processedParticipants: ProcessedParticipant[];
  activeObjects: string[];
  canvasWidth: number;
  onShowInfoText: ( title: string[] | undefined, content: string | undefined ) => void;
  onClick: () => void;
  onPolicyClick: ( erasurePolicy: string | undefined, storagePolicy: string | undefined, x: number, y: number ) => void;
  infoIconSize: number;
  showDetailedModel: boolean;
  fixedLabels: FixedLabels;
  language: FixedLabels;
  isLowMode: boolean;
  colors: Colors;
}

const SVGAction: React.FunctionComponent<Props> = props => {

  const boxType = props.boxTypes.find( item => item.id === props.processedAction.action.typeId );
  if( !boxType ) {
    throw new Error( "Cannot find box type: " + props.processedAction.action.typeId );
  }

  // selection state
  const selected = props.activeObjects.indexOf( props.processedAction.action.id ) === 0;
  const related = props.activeObjects.includes( props.processedAction.action.id );

  // box styling
  const boxFill = related ? boxType.color : boxType.colorInactive;
  const boxFilter = selected ? "url(#highlight)" : "url(#shadow)";
  const boxTextColor = related ? boxType.textColor : boxType.textColorInactive;

  // short info color
  const shortInfoFill = (related ? boxType.shortInfoActiveBackground : boxType.shortInfoBackground) || "pink";
  const shortInfoTextColor = related ? 'white' : boxType.textColorInactive;

  return (
    <g cursor={"pointer"}>

      {props.showDetailedModel && (
        <g>
          {/* Box */}
          <rect name={"source"}
                x={props.processedAction.x}
                y={props.processedAction.y}
                width={props.processedAction.width}
                height={props.processedAction.height}
                fill={boxFill}
                filter={props.isLowMode ? '' : boxFilter}
                onClick={props.onClick}
          />

          {/* Box Text */}
          <SVGText x={props.processedAction.x + getAbsoluteValue( props.canvasWidth, ACTION_PADDING_LEFT )}
                   y={props.isLowMode ? props.processedAction.y + 10 : props.processedAction.y}
                   height={props.processedAction.height}
                   width={props.processedAction.width - getAbsoluteValue( props.canvasWidth, ACTION_PADDING_LEFT )
                   - getAbsoluteValue( props.canvasWidth, ACTION_PADDING_RIGHT )}
                   canvasWidth={props.canvasWidth}
                   str={props.processedAction.action.label}
                   textSize={ACTION_LABEL_SIZE}
                   fontWeight={'normal'}
                   color={boxTextColor}
                   textAnchor={"middle"}
                   onClick={props.onClick}
                   colors={props.colors}
          />

          {/* Info icon on the top right */}
          {!!props.processedAction.action.info && (
            renderInfoButton(
              props.processedAction.x + props.processedAction.width * 0.96,
              props.processedAction.y + props.processedAction.width * 0.04,
              props.infoIconSize,
              (related ? boxType.infoIconActiveBackground : boxType.infoIconBackground) || "pink",
              related ? boxType.color : boxType.colorInactive,
              () => props.onShowInfoText(
                props.processedAction.action.infoTitle ? [props.processedAction.action.infoTitle] : undefined,
                props.processedAction.action.info ), (props.fixedLabels.info || props.language.info!), props.isLowMode )
          )}

          {/* Short info */}
          {!!props.processedAction.action.shortInfo && (
            <SVGShortInfo shortInfo={props.processedAction.action.shortInfo}
                          x={props.processedAction.x + props.processedAction.width - props.canvasWidth * 0.04}
                          y={props.processedAction.y + props.processedAction.height - props.canvasWidth * 0.015}
                          width={props.processedAction.width * 0.6}
                          canvasWidth={props.canvasWidth}
                          fill={shortInfoFill}
                          textColor={shortInfoTextColor}
                          colors={props.colors}
            />
          )}

          {(!!props.processedAction.action.erasurePolicy || !!props.processedAction.action.storagePolicy) && (
            <SVGPolicyTrigger erasurePolicy={props.processedAction.action.erasurePolicy}
                              storagePolicy={props.processedAction.action.storagePolicy}
                              x={props.processedAction.x + props.processedAction.width * 0.05}
                              y={props.processedAction.y + props.processedAction.height - props.processedAction.width
                              * 0.15}
                              size={props.processedAction.width * 0.1}
                              color={(related ? boxType.color : boxType.colorInactive) || "pink"}
                              textColor={(related ? boxType.policyIconActiveBackground : boxType.policyIconBackground) || "pink"}
                              onClick={() => props.onPolicyClick( props.processedAction.action.erasurePolicy,
                                props.processedAction.action.storagePolicy,
                                props.processedAction.x + props.processedAction.width * 0.1,
                                props.processedAction.y + props.processedAction.height - props.processedAction.width
                                * 0.1 )}
                              fixedLabels={props.fixedLabels}
                              language={props.language}
            />

          )}

        </g>
      )}
      {!props.showDetailedModel && (
        <g>
          <rect name={"source"}
                x={props.processedAction.x}
                y={props.processedAction.y}
                width={props.processedAction.width}
                height={props.processedAction.height}
                fill={boxFill}
                filter={props.isLowMode ? '' : boxFilter}
                onClick={props.onClick}
          />
          <SVGText x={props.processedAction.x + getAbsoluteValue( props.canvasWidth, ACTION_PADDING_LEFT )}
                   y={props.processedAction.y}
                   height={props.processedAction.height}
                   width={props.processedAction.width - getAbsoluteValue( props.canvasWidth, ACTION_PADDING_LEFT )
                   - getAbsoluteValue( props.canvasWidth, ACTION_PADDING_RIGHT )}
                   canvasWidth={props.canvasWidth}
                   str={props.processedAction.action.label}
                   textSize={DATASOURCE_AND_DATAPURPOSE_LABEL_SIZE}
                   fontWeight={'bolder'}
                   color={boxTextColor}
                   textAnchor={"middle"}
                   onClick={props.onClick}
                   colors={props.colors}
          />

          {/* Info icon on the top right */}
          {!!props.processedAction.action.info && (
            renderInfoButton(
              props.processedAction.x + props.processedAction.width * 0.98,
              props.processedAction.y + props.processedAction.width * 0.02,
              props.infoIconSize,
              (related ? boxType.infoIconActiveBackground : boxType.infoIconBackground) || "pink",
              related ? boxType.color : boxType.colorInactive,
              () => props.onShowInfoText( props.processedAction.action.label, props.processedAction.action.info ),
              (props.fixedLabels.info || props.language.info!), props.isLowMode )
          )}

          {/* Short info */}
          {!!props.processedAction.action.shortInfo && (
            <SVGShortInfo shortInfo={props.processedAction.action.shortInfo}
                          x={props.processedAction.x + props.processedAction.width * 0.8}
                          y={props.processedAction.y + props.processedAction.height * 0.8}
                          width={props.processedAction.width * 0.25}
                          canvasWidth={props.canvasWidth}
                          fill={shortInfoFill}
                          textColor={shortInfoTextColor}
                          colors={props.colors}
            />
          )}

          {(!!props.processedAction.action.erasurePolicy || !!props.processedAction.action.storagePolicy) && (
            <SVGPolicyTrigger erasurePolicy={props.processedAction.action.erasurePolicy}
                              storagePolicy={props.processedAction.action.storagePolicy}
                              x={props.processedAction.x + props.processedAction.width * 0.02}
                              y={props.processedAction.y + props.processedAction.height - props.processedAction.width
                              * 0.02 - props.infoIconSize}
                              size={props.infoIconSize}
                              color={(related ? boxType.color : boxType.colorInactive) || "pink"}
                              textColor={(related ? boxType.policyIconActiveBackground : boxType.policyIconBackground) || "pink"}
                              onClick={() => props.onPolicyClick( props.processedAction.action.erasurePolicy,
                                props.processedAction.action.storagePolicy,
                                props.processedAction.x + props.processedAction.width * 0.1,
                                props.processedAction.y + props.processedAction.height - props.processedAction.width
                                * 0.1 )}
                              fixedLabels={props.fixedLabels}
                              language={props.language}
            />
          )}
        </g>
      )}
    </g>
  );
};

export { SVGAction };