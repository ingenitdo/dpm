import React from "react";
import { BoxType, Colors, ConnectionType, FixedLabels, RevisionHistory, SourceInformation } from "../Data";
import { SVGText } from "./SVGText";
import { getAbsoluteValue } from "../../utils/LayoutCalc";
import {
  CONNECTION_ARROW_SIZE, HEADER_OFFSET,
  LEGEND_LABEL_ITEM_SIZE,
  LEGEND_LABEL_SIZE
} from "../Constants";
import { renderClockButton, renderIconClose, renderIconDBButton, renderIconPermission } from "./SVGIcons";

interface Props {
  isOpen: boolean;
  width: number;
  height: number;
  yScrollOffset: number;
  connectionTypes: ConnectionType[];
  boxTypes: BoxType[];
  toggle: () => void;
  canvasWidth: number;
  factorizedCanvasWidth: number;
  sourceInformation?: SourceInformation;
  revisionHistory?: RevisionHistory;
  onShowInfoText: ( title: string[] | undefined, content: string | undefined ) => void;
  fixedLabels: FixedLabels;
  language: FixedLabels;
  colors: Colors;
  isLowMode: boolean;
  onLegendHeight: ( height: number ) => void;
  onCreditsClick: () => void;
}

const SVGLegend: React.FunctionComponent<Props> = props => {

  const sourceInformationOrRevisionHistoryHeight = props.isOpen && (props.sourceInformation || props.revisionHistory) ?
    getAbsoluteValue( props.factorizedCanvasWidth, LEGEND_LABEL_SIZE ) :
    0;

  const cTypes = props.connectionTypes.filter( item => item.legend );
  const bTypes = props.boxTypes.filter( item => item.legend );
  const itemHeight = props.factorizedCanvasWidth * 0.02;
  const itemMargin = props.factorizedCanvasWidth * 0.01;

  const itemWidth = props.width * 0.3;

  const itemSize = cTypes.length + bTypes.length + 3; // 3 = Icons
  const legendHeight = getAbsoluteValue( props.factorizedCanvasWidth, LEGEND_LABEL_SIZE ) * 2 + (props.isOpen ?
    (itemSize * itemHeight + (itemSize - 1) * itemMargin + props.factorizedCanvasWidth * 0.01) :
    0) + sourceInformationOrRevisionHistoryHeight;

  props.onLegendHeight( legendHeight );
  const legendWidth = (props.isOpen ?
    itemWidth + props.factorizedCanvasWidth * 0.02 :
    getAbsoluteValue( props.factorizedCanvasWidth, LEGEND_LABEL_SIZE ) * 12);

  const x = props.factorizedCanvasWidth - legendWidth - 25;
  const y = props.yScrollOffset + getAbsoluteValue( props.factorizedCanvasWidth, HEADER_OFFSET );

  return (
    <g onClick={props.toggle}
       cursor={"pointer"}>
      {props.isOpen && (
        <rect x={x}
              y={y}

              width={legendWidth}
              height={legendHeight}
              filter={props.isLowMode ? '' : "url(#shadow)"}
              fill={props.isOpen ? '#DEDEDE' : props.colors.legendTriggerBackground}
        />)
      }

      {props.isOpen && (
        cTypes.map( ( conType: ConnectionType, index: number ) => {

          const color = conType.color;
          const dasharray = !!conType.strokeDasharray ? conType.strokeDasharray : "1, 0";
          const label = !!conType.legendLabel ? [conType.legendLabel] : [];

          return (
            <g key={index}>
              <g>
                <line x1={x + props.factorizedCanvasWidth * 0.01}
                      y1={y + props.factorizedCanvasWidth * 0.02 + index * (itemHeight + itemMargin) + itemHeight / 2
                      - (props.isLowMode ? 0 : 2)}
                      x2={x + props.factorizedCanvasWidth * 0.01 + itemWidth * 0.4 - props.factorizedCanvasWidth * 0.01}
                      y2={y + props.factorizedCanvasWidth * 0.02 + index * (itemHeight + itemMargin) + itemHeight / 2
                      + (props.isLowMode ? 0 : 2)}
                      stroke={color}
                      filter={props.isLowMode ? '' : "url(#shadow)"}
                      strokeDasharray={dasharray}
                      strokeWidth={(props.isLowMode ? 4 : 10)}
                />
                <path
                  transform={"translate(" + (x + itemWidth * 0.4 - getAbsoluteValue( props.factorizedCanvasWidth,
                    CONNECTION_ARROW_SIZE ) / 2) + "," + (y + index * (itemHeight + itemMargin) + itemHeight / 2
                    + getAbsoluteValue( props.factorizedCanvasWidth, CONNECTION_ARROW_SIZE ) / 2) + ")"}
                  d={"M0 0 L0 " + getAbsoluteValue( props.factorizedCanvasWidth, CONNECTION_ARROW_SIZE ) + " L"
                  + getAbsoluteValue( props.factorizedCanvasWidth, CONNECTION_ARROW_SIZE ) + " " + getAbsoluteValue(
                    props.factorizedCanvasWidth, CONNECTION_ARROW_SIZE ) / 2 + " Z"}
                  fill={color}
                />
              </g>
              <SVGText
                x={x + props.factorizedCanvasWidth * 0.01 + itemWidth * 0.4 + props.factorizedCanvasWidth * 0.005}
                y={props.isLowMode ?
                  y + props.factorizedCanvasWidth * 0.02 + index * (itemHeight + itemMargin) + 10 :
                  y + props.factorizedCanvasWidth * 0.02 + index * (itemHeight + itemMargin)}
                height={itemHeight}
                width={itemWidth * 0.4 - props.factorizedCanvasWidth * 0.005}
                str={label}
                textSize={LEGEND_LABEL_ITEM_SIZE}
                color={"black"}
                textAnchor={"start"}
                canvasWidth={props.factorizedCanvasWidth}
                colors={props.colors}
              />
            </g>
          );
        } )
      )}

      {props.isOpen && (
        bTypes.map( ( boxType: BoxType, index: number ) => {
          return (
            <g key={boxType.id}>
              <rect x={x + props.factorizedCanvasWidth * 0.01}
                    y={y + props.factorizedCanvasWidth * 0.02 + (index + cTypes.length) * (itemHeight + itemMargin)}
                    width={itemWidth * 0.4 - props.factorizedCanvasWidth * 0.005}
                    height={itemHeight}
                    fill={boxType.color}>
              </rect>

              <SVGText
                x={x + props.factorizedCanvasWidth * 0.01 + itemWidth * 0.4 + props.factorizedCanvasWidth * 0.005}
                y={props.isLowMode ?
                  y + props.factorizedCanvasWidth * 0.02 + (index + cTypes.length) * (itemHeight + itemMargin) + 10 :
                  y + props.factorizedCanvasWidth * 0.02 + (index + cTypes.length) * (itemHeight + itemMargin)}
                height={itemHeight}
                width={itemWidth * 0.6 - props.factorizedCanvasWidth * 0.005}
                str={!!boxType.legendLabel ? [boxType.legendLabel] : []}
                textSize={LEGEND_LABEL_ITEM_SIZE}
                color={"black"}
                canvasWidth={props.factorizedCanvasWidth}
                textAnchor={"start"}
                colors={props.colors}
              />
            </g>
          );
        } )
      )}

      {props.isOpen && (
        <>
          {
            renderClockButton( x + props.factorizedCanvasWidth * 0.01 + itemWidth * 0.325,
              y + props.factorizedCanvasWidth * 0.02 + (bTypes.length + cTypes.length) * (itemHeight + itemMargin)
              + itemWidth
              * 0.025,
              itemWidth * 0.05, '#3A3D3E', '#DEDEDE', () => {
              }, props.fixedLabels.durationOfStorage || props.language.durationOfStorage! )
          }
          <SVGText x={x + props.factorizedCanvasWidth * 0.01 + itemWidth * 0.4 + props.factorizedCanvasWidth * 0.005}
                   y={props.isLowMode ?
                     y + props.factorizedCanvasWidth * 0.02 + (bTypes.length + cTypes.length) * (itemHeight
                     + itemMargin) + 10 :
                     y + props.factorizedCanvasWidth * 0.02 + (bTypes.length + cTypes.length) * (itemHeight
                     + itemMargin)}
                   height={itemHeight}
                   width={itemWidth * 0.6 - props.factorizedCanvasWidth * 0.005}
                   str={[(props.fixedLabels.durationOfStorage || props.language.durationOfStorage!)]}
                   textSize={LEGEND_LABEL_ITEM_SIZE}
                   color={"black"}
                   canvasWidth={props.factorizedCanvasWidth}
                   textAnchor={"start"}
                   colors={props.colors}
          />
        </>
      )}
      {props.isOpen && (
        <>
          {
            renderIconDBButton( x + props.factorizedCanvasWidth * 0.01 + itemWidth * 0.325,
              y + props.factorizedCanvasWidth * 0.02 + (1 + bTypes.length + cTypes.length) * (itemHeight + itemMargin)
              + itemWidth
              * 0.025,
              itemWidth * 0.05, '#3A3D3E', '#DEDEDE', () => {
              }, props.fixedLabels.locationOfStorage || props.language.locationOfStorage! )
          }
          <SVGText x={x + props.factorizedCanvasWidth * 0.01 + itemWidth * 0.4 + props.factorizedCanvasWidth * 0.005}
                   y={props.isLowMode ?
                     y + props.factorizedCanvasWidth * 0.02 + (1 + bTypes.length + cTypes.length) * (itemHeight
                     + itemMargin)
                     + 10 :
                     y + props.factorizedCanvasWidth * 0.02 + (1 + bTypes.length + cTypes.length) * (itemHeight
                     + itemMargin)}
                   height={itemHeight}
                   width={itemWidth * 0.6 - props.factorizedCanvasWidth * 0.005}
                   str={[(props.fixedLabels.locationOfStorage || props.language.locationOfStorage!)]}
                   textSize={LEGEND_LABEL_ITEM_SIZE}
                   color={"black"}
                   canvasWidth={props.factorizedCanvasWidth}
                   textAnchor={"start"}
                   colors={props.colors}
          />
        </>
      )}

      {props.isOpen && (
        <>
          {
            renderIconPermission( x + props.factorizedCanvasWidth * 0.01 + itemWidth * 0.325,
              y + props.factorizedCanvasWidth * 0.02 + (2 + bTypes.length + cTypes.length) * (itemHeight + itemMargin)
              + itemWidth
              * 0.025,
              itemWidth * 0.05, '#3A3D3E', '#DEDEDE', () => {
              }, props.fixedLabels.permissions || props.language.permissions! )
          }
          <SVGText x={x + props.factorizedCanvasWidth * 0.01 + itemWidth * 0.4 + props.factorizedCanvasWidth * 0.005}
                   y={props.isLowMode
                     ?
                     y + props.factorizedCanvasWidth * 0.02 + (2 + bTypes.length + cTypes.length) * (itemHeight
                     + itemMargin) + 10
                     :
                     y + props.factorizedCanvasWidth * 0.02 + (2 + bTypes.length + cTypes.length) * (itemHeight
                     + itemMargin)}
                   height={itemHeight}
                   width={itemWidth * 0.6 - props.factorizedCanvasWidth * 0.005}
                   str={[(props.fixedLabels.permissions || props.language.permissions!)]}
                   textSize={LEGEND_LABEL_ITEM_SIZE}
                   color={"black"}
                   canvasWidth={props.factorizedCanvasWidth}
                   textAnchor={"start"}
                   colors={props.colors}
          />
        </>
      )}

      {props.isOpen && (
        <text x={x + props.factorizedCanvasWidth * 0.01}
              y={y + props.factorizedCanvasWidth * 0.015}
              fill={props.colors.legendTriggerBackground}
              fontSize={getAbsoluteValue( props.factorizedCanvasWidth, LEGEND_LABEL_SIZE )}
              fontWeight={"bold"}
              dominantBaseline="start"
              textAnchor="start"
        >
          {props.fixedLabels.legend || props.language.legend}
        </text>
      )}

      {props.isOpen && props.sourceInformation && (
        <text x={x + props.factorizedCanvasWidth * 0.01}
              y={y + legendHeight - sourceInformationOrRevisionHistoryHeight}
              fill={props.colors.legendTriggerBackground}
              fontSize={getAbsoluteValue( props.factorizedCanvasWidth, LEGEND_LABEL_ITEM_SIZE )}
              fontWeight={"bold"}
              dominantBaseline="start"
              textAnchor="start"

        >
          <tspan onClick={() => {
            props.onShowInfoText( [(props.fixedLabels.listOfSources || props.language.listOfSources!)], props.sourceInformation?.info );
            props.toggle()
          }}>
            {props.fixedLabels.listOfSources || props.language.listOfSources}
          </tspan>

          {props.revisionHistory ? <tspan onClick={() => {
            props.onShowInfoText( [(props.fixedLabels.revisionHistory || props.language.revisionHistory!)], props.revisionHistory?.info );
            props.toggle()
          }}>&emsp;
            <tspan fill={'#3A3D3E'}>&#8226;</tspan>
            &emsp;{props.fixedLabels.revisionHistory || props.language.revisionHistory}</tspan> : ""}

         <tspan onClick={() => {
            props.onCreditsClick()
          }}>&emsp;
            <tspan fill={'#3A3D3E'}>&#8226;</tspan>
            &emsp;{props.fixedLabels.credits || props.language.credits!}</tspan>
        </text>
      )}

      {props.isOpen && (!props.sourceInformation && props.revisionHistory) && (
        <text x={x + props.factorizedCanvasWidth * 0.01}
              y={y + legendHeight - sourceInformationOrRevisionHistoryHeight}
              fill={props.colors.legendTriggerBackground}
              fontSize={getAbsoluteValue( props.factorizedCanvasWidth, LEGEND_LABEL_ITEM_SIZE )}
              fontWeight={"bold"}
              dominantBaseline="start"
              textAnchor="start"
        >
          <tspan onClick={() => {
            props.onShowInfoText( [(props.fixedLabels.revisionHistory || props.language.revisionHistory!)], props.revisionHistory?.info );
            props.toggle()
          }}>&emsp;
            <tspan fill={'#3A3D3E'}>&#8226;</tspan>
            &emsp;{props.fixedLabels.revisionHistory || props.language.revisionHistory}</tspan>

          <tspan onClick={() => {
            props.onCreditsClick()
          }}>&emsp;
            <tspan fill={'#3A3D3E'}>&#8226;</tspan>
            &emsp;{props.fixedLabels.credits || props.language.credits!}</tspan>
        </text>
      )}

      {props.isOpen && (
        renderIconClose(
          x + legendWidth - getAbsoluteValue( props.factorizedCanvasWidth, LEGEND_LABEL_SIZE ) * 2,
          y + props.factorizedCanvasWidth * 0.01,
          getAbsoluteValue( props.factorizedCanvasWidth, LEGEND_LABEL_SIZE ),
          '#3A3D3E',
          () => {
          }, (props.fixedLabels.close || props.language.close!) )
      )}

    </g>

  );

};

export { SVGLegend };