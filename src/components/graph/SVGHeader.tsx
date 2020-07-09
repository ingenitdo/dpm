import React from "react";
import { renderIconProcess, renderIconPurpose, renderIconSource } from "./SVGIcons";
import {
  HEADER_HEIGHT,
  HEADER_LABEL_SIZE,
  HEADER_MARGIN_BOTTOM,
  HEADER_MARGIN_TOP,
  HEADER_WIDTH,
  PARTICIPANTS_SIZE
} from "../Constants";
import { getAbsoluteValue } from "../../utils/LayoutCalc";

import { Colors } from "../Data";

interface Props {
  sourceLabel: string;
  purposeLabel: string;
  processLabel: string;
  height: number;
  canvasWidth: number;
  showDetailedModel: boolean;
  yScrollOffset: number;
  colors: Colors;
  isLowMode: boolean;
}

const SVGHeader: React.FunctionComponent<Props> = props => {

  const headerMarginTop = getAbsoluteValue( props.canvasWidth, HEADER_MARGIN_TOP );
  const headerMarginBottom = getAbsoluteValue( props.canvasWidth, HEADER_MARGIN_BOTTOM );
  const headerHeight = getAbsoluteValue( props.canvasWidth, HEADER_HEIGHT );
//  const headerOffset = headerHeight + headerMarginTop + headerMarginBottom;
  const headerY = headerMarginTop + props.yScrollOffset - 8;
  const headerWidth = getAbsoluteValue(props.canvasWidth, HEADER_WIDTH);
  const headerArrowSize = props.canvasWidth * 0.03;
  const headerIconHeight = headerHeight * 0.4;
  const headerIconWidth = headerWidth * 0.4;
  const headerPaddingLeft = headerWidth * 0.05;

  const actionHeaderX = props.canvasWidth * 0.3;
  const actionHeaderWidth = getAbsoluteValue(props.canvasWidth, (PARTICIPANTS_SIZE - 10));

  return (
    <g>
      {/*BACKGROUND BLUR*/}
      <rect x={0}
            y={props.yScrollOffset - 8}
            width={props.canvasWidth}
            height={headerMarginTop + headerHeight + headerMarginBottom}
            fill={'url(#white_gradient)'}
      />

      <g filter={props.isLowMode ? '' : 'url(#shadow)'}>
        <g fill={props.colors.headerSourceBackground}>
          <rect x={0}
                y={headerY}
                width={headerWidth}
                height={headerHeight}
          />
          <path
            transform={"translate(" + headerWidth + "," + headerY + ")"}
            d={"M0 0 L0 " + headerHeight + " L" + headerArrowSize + " " + headerHeight / 2 + " Z"}
            fill={props.colors.headerSourceArrowBackground}
          />
        </g>
        <text x={headerPaddingLeft}
              y={headerY + headerHeight * 0.8}
              fill={props.colors.headerSourceLabel}
              fontSize={getAbsoluteValue( props.canvasWidth, HEADER_LABEL_SIZE )}
              fontVariant={'all-small-caps'}
        >
          {props.sourceLabel}
        </text>
        {renderIconSource( headerPaddingLeft, headerY + headerHeight * 0.25, headerIconWidth, headerIconHeight,
          props.colors.headerSourceIcon )}
      </g>


      {/* SIMPLE VIEW ACTION HEADER*/}
      {!props.showDetailedModel && (
        <g filter={props.isLowMode ? '' : 'url(#shadow)'}>
          <g>
            <g fill={props.colors.headerProcessArrowLeftBackground}
               transform={"translate(" + (actionHeaderX - headerArrowSize) + ","
            + headerY + ")"}
            >
              <path d={"M0 0 L" + headerArrowSize + " " + headerHeight / 2 + " L" + headerArrowSize + " 0 Z"}/>
              <path
                d={"M" + headerArrowSize + " " + headerHeight / 2 + " L0 " + headerHeight + " L" + headerArrowSize + " "
                + headerHeight + " Z"}/>
            </g>

            <rect x={actionHeaderX}
                  y={headerY}
                  width={actionHeaderWidth}
                  height={headerHeight}
                  fill={props.colors.headerProcessBackground}
            />

            <path
              fill={props.colors.headerProcessArrowRightBackground}
              transform={"translate(" + (actionHeaderX + actionHeaderWidth) + "," + headerY + ")"}
              d={"M0 0 L0 " + headerHeight + " L" + headerArrowSize + " " + headerHeight / 2 + " Z"}
            />
          </g>
          <text x={headerPaddingLeft * 2 + actionHeaderX}
                y={headerY + headerHeight * 0.8}
                fill={props.colors.headerProcessLabel}
                fontSize={getAbsoluteValue( props.canvasWidth, HEADER_LABEL_SIZE )}
                fontVariant={'all-small-caps'}
          >
            {props.processLabel}
          </text>
          {renderIconProcess( headerPaddingLeft * 2 + actionHeaderX, headerY + headerHeight * 0.25, headerIconWidth,
            props.colors.headerProcessIcon,
            props.colors.headerProcessLabel, () => {
            }, null )}
        </g>
      )}


      <g filter={props.isLowMode ? '' : 'url(#shadow)'}>
        <g fill={props.colors.headerPurposeBackground}>
          <rect x={getAbsoluteValue(props.canvasWidth, (100 - HEADER_WIDTH))}
                y={headerY}
                width={headerWidth}
                height={headerHeight}
          />

          <g transform={"translate(" + ((getAbsoluteValue(props.canvasWidth, (100 - HEADER_WIDTH)) - headerArrowSize)) + ","
          + headerY + ")"}
          >
            <path d={"M0 0 L" + headerArrowSize + " " + headerHeight / 2 + " L" + headerArrowSize + " 0 Z"} fill={props.colors.headerPurposeArrowBackground} />
            <path
              d={"M" + headerArrowSize + " " + headerHeight / 2 + " L0 " + headerHeight + " L" + headerArrowSize + " "
              + headerHeight + " Z"}
              fill={props.colors.headerPurposeArrowBackground}
            />
          </g>
        </g>

        <text x={getAbsoluteValue(props.canvasWidth, (100 - HEADER_WIDTH)) + headerPaddingLeft}
              y={headerY + headerHeight * 0.8}
              fontSize={getAbsoluteValue( props.canvasWidth, HEADER_LABEL_SIZE )}
              fill={props.colors.headerPurposeLabel}
              fontVariant={'all-small-caps'}
        >
          {props.purposeLabel}
        </text>

        {renderIconPurpose( (getAbsoluteValue(props.canvasWidth, (100 - HEADER_WIDTH))) + headerPaddingLeft,
          headerY + headerHeight * 0.2, 80, headerHeight, props.colors.headerPurposeIcon )}
      </g>
    </g>
  );

};

export { SVGHeader };