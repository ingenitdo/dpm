import React from "react";
import { getStringArrayByWidth, ProcessedCase } from "../../utils/Processing";
import { CASE_HEADER_HEIGHT, CASE_HEADER_LABEL_SIZE } from "../Constants";
import { SVGText } from "./SVGText";
import { renderIconArrowDown, renderIconArrowUp, renderIconPermission, renderInfoButton } from "./SVGIcons";
import { Colors, FixedLabels } from "../Data";
import { getAbsoluteValue } from "../../utils/LayoutCalc";

interface Props {
  case: ProcessedCase;
  x: number;
  y: number;
  width: number;
  canvasWidth: number;
  height: number;
  openCases: string[];
  toggle: ( caseId: string ) => void;
  onShowInfoText: ( title: string[] | undefined, content: string | undefined ) => void;
  fixedLabels: FixedLabels;
  language: FixedLabels;
  colors: Colors;
  isLowMode: boolean;
}

const SVGCase: React.FunctionComponent<Props> = props => {

  const caseHeaderLabelRows =
    [props.case.label].map( ( label: string ) => {
      return getStringArrayByWidth( label, (props.canvasWidth / 100 * 25),
        getAbsoluteValue( props.canvasWidth, CASE_HEADER_LABEL_SIZE ) ).length;
    } ).reduce( ( sum, current ) => sum + current, 0 );

  const caseHeaderHeight = (caseHeaderLabelRows <= 1 ? 2 : caseHeaderLabelRows) * getAbsoluteValue( props.canvasWidth,
    CASE_HEADER_HEIGHT );

  const iconX = props.canvasWidth * 0.005;
  const iconHeight = getAbsoluteValue( props.canvasWidth, CASE_HEADER_HEIGHT );
  const iconY = props.y + iconHeight / 2;
  return (
    <g key={props.case.id}>
      <rect
        id={props.case.id}
        x="0"
        y={props.y}
        width="100%"
        height={props.openCases.includes( props.case.id ) ? (props.height) : caseHeaderHeight}
        filter="url(#shadow)"
        fill={props.colors.caseBodyBackground}
        strokeWidth={1}
        stroke={props.colors.caseBorder}
      />
      <rect
        id={props.case.id + "1"}
        x="0"
        y={props.y}
        width="100%"
        height={caseHeaderHeight}
        fill={!!props.colors.caseHeaderBackgroundGradient ? props.colors.caseHeaderBackgroundGradient : props.colors.caseHeaderBackground}//"#006BA2"}
        onClick={() => props.toggle( props.case.id )}
        cursor={"pointer"}
      />
      {props.openCases.includes( props.case.id ) ?
        renderIconArrowUp( iconX, iconY, iconHeight, iconHeight, props.colors.caseHeaderIcon, () => props.toggle( props.case.id ) ) :
        renderIconArrowDown( iconX, iconY, iconHeight, iconHeight, props.colors.caseHeaderIcon, () => props.toggle( props.case.id ) )}

      <SVGText x={props.canvasWidth / 100 * 3}
               y={props.isLowMode ? props.y + 10 : props.y}
               height={caseHeaderHeight}
               width={getAbsoluteValue(props.canvasWidth, 25)}
               canvasWidth={props.canvasWidth}
               str={[props.case.label]}
               textSize={CASE_HEADER_LABEL_SIZE}
               color={props.colors.caseHeaderLabel}
               textAnchor={"start"}
               onClick={() => props.toggle( props.case.id )}
               colors={props.colors}
      />

      {props.case.info && (
        <g cursor={"pointer"}>
          {
            renderInfoButton( (props.canvasWidth / 100 * 24),
              props.y + getAbsoluteValue( props.canvasWidth, CASE_HEADER_HEIGHT ) / 1.8,
              getAbsoluteValue( props.canvasWidth, CASE_HEADER_HEIGHT ) * 0.8,
              props.colors.caseHeaderIcon,
              props.colors.caseHeaderBackground,
              () => props.onShowInfoText( props.case.infoTitle?[props.case.infoTitle]:undefined, props.case.info ), (props.fixedLabels.info || props.language.info!) , props.isLowMode)
          }
        </g>
      )}

      {props.case.permissions && (
        <g cursor={"pointer"}>
          {
            renderIconPermission(
              props.canvasWidth / 100 * 24 - getAbsoluteValue( props.canvasWidth, CASE_HEADER_HEIGHT ) * 1.7,
              props.y + getAbsoluteValue( props.canvasWidth, CASE_HEADER_HEIGHT ) / 1.8,
              getAbsoluteValue( props.canvasWidth, CASE_HEADER_HEIGHT ) * 0.8,
              props.colors.caseHeaderIcon,
              props.colors.caseHeaderBackground,
              () => props.onShowInfoText( [props.case.label], props.case.permissions ), (props.fixedLabels.permissions || props.language.permissions!) )
          }
        </g>
      )}

    </g>
  );

};

export { SVGCase };
