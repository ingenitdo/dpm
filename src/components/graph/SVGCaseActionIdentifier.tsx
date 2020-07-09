import React from "react";
import { renderIconCheck, renderIconClose, renderIconForbidden, renderIconInvisible, renderIconLock } from "./SVGIcons";
import { Colors } from "../Data";

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  size: number;
  hasAction: boolean;
  onClick: () => void;
  colors: Colors;
  isDetailedIcons: boolean;
  participantCount: number;
}

const SVGCaseActionIdentifier: React.FunctionComponent<Props> = props => {

  return (
    <>
      {!props.isDetailedIcons && (
        <g onClick={props.onClick} cursor={"pointer"}>
          <rect x={props.x} y={props.y} width={props.width} height={props.height}
                fill={props.colors.participantBackground}/>
          {props.hasAction && (
            renderIconCheck( props.x + props.width / 2 - props.size / 2, props.y + props.height / 2 - props.size / 2,
              props.size, props.colors.caseActionIdentifierChecked, () => {
              }, "Fall hat Aktionen innerhalb diesem Teilnehmer" )
          )}
          {!props.hasAction && (
            renderIconClose( props.x + props.width / 2 - props.size / 2, props.y + props.height / 2 - props.size / 2,
              props.size, props.colors.caseActionIdentifierUnchecked, () => {
              }, "Fall hat keine Aktionen innerhalb diesem Teilnehmer" )
          )}
        </g>
      )}
      {props.isDetailedIcons && props.participantCount === 0 && (
        <g onClick={props.onClick} cursor={"pointer"}>
          <rect x={props.x} y={props.y} width={props.width} height={props.height}
                fill={props.colors.participantBackground}/>
          {props.hasAction && (
            renderIconLock( props.x + props.width / 2 - props.size / 2, props.y + props.height / 2 - props.size / 2,
              props.size, props.colors.caseActionIdentifierChecked, () => {
              }, "Fall hat Aktionen innerhalb diesem Teilnehmer" )
          )}
          {!props.hasAction && (
            renderIconForbidden( props.x + props.width / 2 - props.size / 2, props.y + props.height / 2 - props.size / 2,
              props.size, props.colors.caseActionIdentifierUnchecked, () => {
              }, "Fall hat keine Aktionen innerhalb diesem Teilnehmer" )
          )}
        </g>
      )}
      {props.isDetailedIcons && props.participantCount !== 0 && (
        <g onClick={props.onClick} cursor={"pointer"}>
          <rect x={props.x} y={props.y} width={props.width} height={props.height}
                fill={props.colors.participantBackground}/>
          {props.hasAction && (
            renderIconInvisible( props.x + props.width / 2 - props.size / 2, props.y + props.height / 2 - props.size / 2,
              props.size, props.colors.caseActionIdentifierChecked, () => {
              }, "Fall hat Aktionen innerhalb diesem Teilnehmer" )
          )}
          {!props.hasAction && (
            renderIconForbidden( props.x + props.width / 2 - props.size / 2, props.y + props.height / 2 - props.size / 2,
              props.size, props.colors.caseActionIdentifierUnchecked, () => {
              }, "Fall hat keine Aktionen innerhalb diesem Teilnehmer" )
          )}
        </g>
      )}
    </>
  );

};

export { SVGCaseActionIdentifier };
