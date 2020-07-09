/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from "react";
import { Colors, FixedLabels } from "../Data";
import { ProcessedParticipant } from "../../utils/Processing";
import {
  CONTROLS_HEIGHT,
  HEADER_HEIGHT, HEADER_MARGIN_BOTTOM,
  HEADER_MARGIN_TOP,
  LEGEND_LABEL_SIZE, SUBTITLE_HEIGHT, SUBTITLE_MARGIN_BOTTOM, TITLE_HEIGHT, TITLE_MARGIN_BOTTOM
} from "../Constants";

import { Title } from "./Title";
import { Controls } from "./Controls";
import { GraphHeader } from "./GraphHeader";
import { getAbsoluteValue } from "../../utils/LayoutCalc";
import { SubTitle } from "./SubTitle";

interface Props {
  showDetailedModel: boolean;
  fixedLabels: FixedLabels;
  language: FixedLabels;
  toggleMode: () => void;
  toggleLegend: () => void;
  marginTop: number;
  labelSize: number;
  iconSize: number;
  isMobile: boolean;
  zoomFactor: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  colors: Colors;
  yScrollOffset: number;
  canvasWidth: number;
  onFullscreen: () => void;
  isFullscreen: boolean;
  sourceLabel: string;
  purposeLabel: string;
  processLabel: string;
  height: number;
  isLowMode: boolean;
  factorizedCanvasWidth: number;
  isInfoDialogBlurred: boolean;
  processedParticipants: ProcessedParticipant[];
  isIos: boolean;
  title: string;
  subtitle: string;
}

const Header: React.FunctionComponent<Props> = props => {

  const titleHeight = (!!props.title ? getAbsoluteValue( props.canvasWidth, TITLE_HEIGHT ) : 0);
  const subtitleHeight = (!!props.title ? getAbsoluteValue( props.canvasWidth, SUBTITLE_HEIGHT ) : 0);
  const titleMarginBottom = (!!props.title ? getAbsoluteValue( props.canvasWidth, TITLE_MARGIN_BOTTOM ) : 0);
  const subtitleMarginBottom = (!!props.title ? getAbsoluteValue( props.canvasWidth, SUBTITLE_MARGIN_BOTTOM ) : 0);
  const controlsHeight = getAbsoluteValue( props.canvasWidth, CONTROLS_HEIGHT );
  const graphHeaderMarginTop = getAbsoluteValue( props.canvasWidth, HEADER_MARGIN_TOP );
  const graphHeaderHeight = getAbsoluteValue( props.factorizedCanvasWidth, HEADER_HEIGHT );
  const graphHeaderMarginBottom = getAbsoluteValue( props.factorizedCanvasWidth, HEADER_MARGIN_BOTTOM );

  const headerHeight = titleHeight
    + titleMarginBottom
    + (props.yScrollOffset > 0 ? 0 : subtitleMarginBottom)
    + controlsHeight
    + graphHeaderMarginTop
    + graphHeaderHeight
    + graphHeaderMarginBottom;

  return (
    <div css={theme => ([{
      transition: 'height 0.5s ease-in',
      position: props.yScrollOffset !== 0 ? 'fixed' : 'absolute',
      width: props.canvasWidth,
      top: props.yScrollOffset !== 0 ? 0 : 'initial',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      height: headerHeight
    }])}>

      <Title title={props.title}
             height={titleHeight}
             marginBottom={titleMarginBottom}
      />
      <SubTitle subtitle={props.subtitle}
                height={props.yScrollOffset > 0 ? 0 : subtitleHeight}
                marginBottom={props.yScrollOffset > 0 ? 0 : subtitleMarginBottom}
      />

      <Controls height={controlsHeight}
                colors={props.colors}
                zoomFactor={props.zoomFactor}
                onZoomIn={props.onZoomIn}
                onZoomOut={props.onZoomOut}
                labelSize={getAbsoluteValue( props.canvasWidth, LEGEND_LABEL_SIZE )}
                showDetailedModel={props.showDetailedModel}
                toggleMode={props.toggleMode}
                toggleLegend={props.toggleLegend}
                controlsHeight={getAbsoluteValue( props.canvasWidth, CONTROLS_HEIGHT )}
                fixedLabels={props.fixedLabels}
                language={props.language}
                isFullscreen={props.isFullscreen}
                onFullscreen={props.onFullscreen}

      />

      <GraphHeader showDetailedModel={props.showDetailedModel}
                   factorizedCanvasWidth={props.factorizedCanvasWidth}
                   canvasWidth={props.canvasWidth}
                   isInfoDialogBlurred={props.isInfoDialogBlurred}
                   isIos={props.isIos}
                   sourceLabel={props.sourceLabel}
                   purposeLabel={props.purposeLabel}
                   processLabel={props.processLabel}
                   height={graphHeaderHeight}
                   marginBottom={graphHeaderMarginBottom}
                   isLowMode={props.isLowMode}
                   processedParticipants={props.processedParticipants}
                   colors={props.colors}
      />


    </div>
  );

};

export { Header };
