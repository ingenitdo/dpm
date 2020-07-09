/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from "react";
import { drop_shadow } from "../../style/style";
import { Icon } from "../Icon";
import { Colors, FixedLabels } from "../Data";

interface Props {
  height: number;

  showDetailedModel: boolean;

  zoomFactor: number;
  onZoomIn: () => void;
  onZoomOut: () => void;

  toggleMode: () => void;
  toggleLegend: () => void;

  colors: Colors;
  labelSize: number;

  controlsHeight: number;
  fixedLabels: FixedLabels;
  language: FixedLabels;

  onFullscreen: () => void;
  isFullscreen: boolean;
}

const Controls: React.FunctionComponent<Props> = props => {

  return (

    <div css={theme => ([{
      minHeight: props.height
    }])}>
      <div css={theme => ([{
        display: 'flex',
        flexDirection: 'row',
        minHeight: props.height
      }])}>
        <div css={theme => ([{
          width: '20%',
          marginRight: '58%',
          border: 'none',
          backgroundColor: props.colors.legendTriggerBackground,
          color: 'white',
          fontSize: props.labelSize,
          outline: 'none',
          transition: 'background-color 0.3s ease-in-out',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ':hover': {
            backgroundColor: props.colors.legendTriggerBackgroundHover,
            cursor: 'pointer'
          },
          ':focus': {
            outline: 'none'
          }
        }, drop_shadow])}
             onClick={props.toggleMode}
        >
          {props.showDetailedModel ? (props.fixedLabels.simpleModel || props.language.simpleModel) : (props.fixedLabels.detailedModel || props.language.detailedModel)}
        </div>

        <div css={theme => ([{
          width: '10%',
          marginRight: '1%',
          border: 'none',
          backgroundColor: props.colors.legendTriggerBackground,
          color: 'white',
          outline: 'none',
          fontSize: props.labelSize,
          transition: 'background-color 0.3s ease-in-out',
          height: props.controlsHeight,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ':hover': {
            backgroundColor: props.colors.legendTriggerBackgroundHover,
            cursor: 'pointer'
          },
          ':focus': {
            outline: 'none'
          }
        }, drop_shadow])}
             onClick={props.toggleLegend}
        >
          {props.fixedLabels.legend || props.language.legend}
        </div>


        <div css={theme => ([{
          width: '5%',
          border: 'none',
          marginRight: '1%',
          backgroundColor: props.colors.legendTriggerBackground,
          color: 'white',
          outline: 'none',
          fontSize: props.labelSize,
          transition: 'background-color 0.3s ease-in-out',
          height: props.controlsHeight,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ':hover': {
            backgroundColor: props.colors.legendTriggerBackgroundHover,
            cursor: 'pointer'
          },
          ':focus': {
            outline: 'none'
          }
        }, drop_shadow])}
             onClick={props.onFullscreen}
        >
          {props.isFullscreen && (
            <Icon name={"leave-fullscreen"} size={props.labelSize}/>

          )}
          {!props.isFullscreen && (
            <Icon name={"enter-fullscreen"} size={props.labelSize}/>

          )}
        </div>

        <div css={theme => ([{
          width: '5%',
          border: 'none',
          marginRight: '1%',
          backgroundColor: props.colors.legendTriggerBackground,
          color: 'white',
          outline: 'none',
          fontSize: props.labelSize,
          transition: 'background-color 0.3s ease-in-out',
          height: props.controlsHeight,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ':hover': {
            backgroundColor: props.colors.legendTriggerBackgroundHover,
            cursor: 'pointer'
          },
          ':focus': {
            outline: 'none'
          }
        }, drop_shadow])}
             onClick={props.onZoomOut}
        >
          <Icon name={"minus"} size={props.labelSize}/>
        </div>

        <div css={theme => ([{
          width: '5%',
          border: 'none',
          backgroundColor: props.colors.legendTriggerBackground,
          color: 'white',
          outline: 'none',
          fontSize: props.labelSize,
          transition: 'background-color 0.3s ease-in-out',
          height: props.controlsHeight,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ':hover': {
            backgroundColor: props.colors.legendTriggerBackgroundHover,
            cursor: 'pointer'
          },
          ':focus': {
            outline: 'none'
          }
        }, drop_shadow])}
             onClick={props.onZoomIn}
        >
          <Icon name={"plus"} size={props.labelSize}/>

        </div>
      </div>
    </div>
  );

};

export { Controls };
