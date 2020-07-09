import {
  Action,
  Case,
  Connection,
  ConnectionType,
  DataPurpose,
  DataSource,
  ObjectId,
  Participant,
} from "../components/Data";
import {
  ACTION_MARGIN_BOTTOM,
  ACTION_MARGIN_LEFT,
  ACTION_MARGIN_RIGHT,
  ACTION_MARGIN_TOP,
  ACTION_PADDING_BOTTOM,
  ACTION_PADDING_LEFT,
  ACTION_PADDING_RIGHT,
  ACTION_PADDING_TOP,
  ACTION_ROW_SIZE,
  CASE_HEADER_HEIGHT,
  CASE_HEADER_LABEL_SIZE,
  CASE_MARGIN_BOTTOM,
  CASE_PADDING_BOTTOM,
  CASE_PADDING_TOP,
  CONNECTION_ARROW_SIZE,
  CONNECTION_ROW_SIZE,
  CONNECTION_STROKE_SIZE,
  DATASOURCE_AND_DATAPURPOSE_LEFT_OR_RIGHT,
  DATASOURCE_AND_DATAPURPOSE_MARGIN_BOTTOM,
  DATASOURCE_AND_DATAPURPOSE_MARGIN_TOP,
  DATASOURCE_AND_DATAPURPOSE_PADDING_BOTTOM,
  DATASOURCE_AND_DATAPURPOSE_PADDING_LEFT,
  DATASOURCE_AND_DATAPURPOSE_PADDING_RIGHT,
  DATASOURCE_AND_DATAPURPOSE_PADDING_TOP,
  DATASOURCE_AND_DATAPURPOSE_ROW_SIZE,
  DATASOURCE_AND_DATAPURPOSE_WIDTH,
  HEADER_OFFSET,
  MIN_GAP_HEIGHT,
  PARTICIPANTS_MARGIN,
  PARTICIPANTS_SIZE,
  SHORTINFO_MARGIN_BOTTOM
} from "../components/Constants";
import { getAbsoluteValue } from "./LayoutCalc";

export type ProcessedParticipant = {
  participant: Participant;
  x: number;
  y: number;
  width: number;
  height: number;
}
export type ProcessedCase = {
  id: ObjectId;
  label: string;
  dataSources: ProcessedDataSource[];
  dataPurposes: ProcessedDataPurpose[];
  actions: ProcessedAction[];
  connections: ProcessedConnection[];
  shortInfo?: string[]; //visible bubble
  infoTitle?: string; //Rich-Text
  info?: string; //Rich-Text
  permissions?: string; //Rich-Text

  isOpen: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}
export type ProcessedDataSource = {
  dataSource: DataSource;
  x: number;
  y: number;
  width: number;
  height: number;
}
export type ProcessedDataPurpose = {
  dataPurpose: DataPurpose;
  x: number;
  y: number;
  width: number;
  height: number;
}
export type ProcessedAction = {
  action: Action;
  x: number;
  y: number;
  width: number;
  height: number;
}
export type ProcessedConnection = {
  connection: Connection;
  connectionType: ConnectionType;
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  textX: number;
  textY: number;
  textWidth: number;
  textHeight: number;
  textAnchor: string;
  arrowTranslate: string;
  arrowD: string;
}
type RowHeight = {
  pos: number;
  value: number;
}
type ConnectionGapHeight = {
  pos: number;
  value: number;
}

export const processParticipants = ( participants: Participant[], canvasWidth: number, canvasHeight: number ) => {
  return participants.map( ( p: Participant, index: number ) => {
    const margin = getAbsoluteValue( canvasWidth, PARTICIPANTS_MARGIN );
    const pWidth = getAbsoluteValue( canvasWidth, (PARTICIPANTS_SIZE / participants.length) ) - margin;
    const pX = getAbsoluteValue( canvasWidth, (25 + (PARTICIPANTS_SIZE / participants.length) * index) ) + (index
      * margin) / 2;
    return {
      participant: p,
      x: pX,
      y: 0,
      width: pWidth,
      height: canvasHeight
    }
  } );
};

export const getStringArrayByWidth = ( str: string, width: number, textSize: number ) => {
  let list: string[] = [];
  const words = str.split( " " );
  let temp = "";
  words.forEach( ( item, index ) => {
    temp += item;

    if( temp.length >= Math.floor( width / textSize ) || words.length === (index + 1) ) {
      list.push( temp );
      temp = "";
    }
    else {
      temp += " ";
    }
  } );
  return list;
};

const getConnectionItemByProcessed = ( itemId: string, processedActions: ProcessedAction[],
  processedDataSources: ProcessedDataSource[], processedDataPurposes: ProcessedDataPurpose[] ) => {
  const connectionItemByActions = processedActions.find( item => item.action.id === itemId )!;
  const connectionItemByDataSources = processedDataSources.find( item => item.dataSource.id === itemId )!;
  const connectionItemByDataPurposes = processedDataPurposes.find( item => item.dataPurpose.id === itemId )!;

  return connectionItemByActions ? connectionItemByActions
    : connectionItemByDataSources ? connectionItemByDataSources : connectionItemByDataPurposes;

};

export const processConnections = ( connections: Connection[], connectionTypes: ConnectionType[],
  processedActions: ProcessedAction[],
  processedDataSources: ProcessedDataSource[], processedDataPurposes: ProcessedDataPurpose[], rowHeights: RowHeight[],
  connectionGapHeights: ConnectionGapHeight[], caseY: number, canvasWidth: number,
  caseHeaderHeight: number, showDetailedModel: boolean, isLowMode: boolean ): ProcessedConnection[] => {

  return connections.map( con => {

    const connectionType = connectionTypes.find( ct => ct.id === con.typeId );
    if( !connectionType ) {
      throw new Error( "Unknown connection type: " + con.typeId );
    }

    const conSource = getConnectionItemByProcessed( con.source, processedActions, processedDataSources,
      processedDataPurposes );
    const conDestination = getConnectionItemByProcessed( con.destination, processedActions, processedDataSources,
      processedDataPurposes );

    const conRowHeightsAbove = rowHeights.filter( item => item.pos <= con.position.start ).map( item => item.value );
    const conRowHeightsAboveValue = conRowHeightsAbove.reduce( ( acc, current ) => acc + current, 0 );
    const conPositionStartRowHeight = rowHeights.find( item => item.pos === con.position.start )!;

    const connectionGapHeightsAbove = connectionGapHeights.filter( item => item.pos < con.position.start )
      .map( item => item.value ).reduce( ( acc, current ) => acc + current, 0 );
    const conPosStartY = caseY
      + getAbsoluteValue( canvasWidth, CASE_PADDING_TOP )
      + caseHeaderHeight
      + conRowHeightsAboveValue
      + connectionGapHeightsAbove
      - conPositionStartRowHeight.value / 2;

    const strokeVariance = isLowMode ?
      0 :
      getAbsoluteValue( canvasWidth, CONNECTION_STROKE_SIZE ) / (5 * CONNECTION_STROKE_SIZE);

    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;
    let height = getAbsoluteValue( canvasWidth, 7 );
    let textX = 0;
    let textY = 0;
    let textWidth = 0;
    let textHeight = 0;
    let textAnchor = "middle";
    let arrowSize = getAbsoluteValue( canvasWidth, CONNECTION_ARROW_SIZE );

    let labelRows = 0;
    let arrowTranslate = "";
    let arrowD = "";
    let labelRowSize = getAbsoluteValue( canvasWidth, CONNECTION_ROW_SIZE );

    if( con.position.start === con.position.end ) {
      y1 = conPosStartY - strokeVariance;
      y2 = conPosStartY + strokeVariance;

      if( conSource.x < conDestination.x ) {
        x1 = conSource.x + conSource.width;
        x2 = conDestination.x - arrowSize;

        arrowTranslate = "translate(" + x2 + ", " + (conPosStartY - arrowSize / 2) + ")";
        arrowD = "M0 0 L0 " + arrowSize + " L" + arrowSize + " " + arrowSize / 2 + " Z";
        if( !showDetailedModel ) {
          arrowTranslate = "translate(" + (x1 + (x2 - x1) / 2) + "," + (y1 - height * 0.8 / 2) + ") scale(1, 0.8)";
          arrowD = "M0 0 L" + height * 0.25 + " 0 L" + height / 2 + " " + height / 2 + " L" + height * 0.25 + " "
            + height + " L0 " + height + " L" + (height / 2 - height * 0.25) + " " + height / 2 + "Z";
        }

        textWidth = x2 - x1 - arrowSize;
        labelRows =
          [con.label].map( ( label: string ) => {
            return getStringArrayByWidth( label, textWidth, labelRowSize ).length;
          } ).reduce( ( sum, current ) => sum + current, 0 );
        textX = x1 + arrowSize / 2 + arrowSize / 2;
      }
      else {
        x1 = conDestination.x + conDestination.width + arrowSize;
        x2 = conSource.x;

        arrowTranslate = "translate(" + x1 + ", " + (conPosStartY - arrowSize / 2) + ")";
        arrowD = "M0 0 L0 " + arrowSize + " L-" + arrowSize + " " + arrowSize / 2 + " Z";
        if( !showDetailedModel ) {
          arrowTranslate = "translate(" + (x1 + (x2 - x1) / 2) + "," + (y1 - height * 0.8 / 2) + ") scale(-1, 0.8)";
          arrowD = "M0 0 L" + height * 0.25 + " 0 L" + height / 2 + " " + height / 2 + " L" + height * 0.25 + " "
            + height + " L0 " + height + " L" + (height / 2 - height * 0.25) + " " + height / 2 + "Z";

        }

        textWidth = x2 - x1 - arrowSize;
        labelRows =
          [con.label].map( ( label: string ) => {
            return getStringArrayByWidth( label, textWidth, labelRowSize ).length;
          } ).reduce( ( sum, current ) => sum + current, 0 );
        textX = x1 - arrowSize / 2 + arrowSize / 2;
      }

      textHeight = (labelRows + 2) * labelRowSize;
      textY = conPosStartY - textHeight - labelRowSize;
    }
    else {
      x1 = conSource.x + strokeVariance + conSource.width / 2;
      x2 = conSource.x - strokeVariance + conSource.width / 2;

      textX = conSource.x;//; + conSource.width / 2 - getAbsoluteValue( canvasWidth, ACTION_MARGIN_LEFT ) - 10;
      textWidth = conSource.width / 2;

      labelRows =
        [con.label].map( ( label: string ) => {
          return getStringArrayByWidth( label, textWidth, labelRowSize ).length;
        } ).reduce( ( sum, current ) => sum + current, 0 );
      if( conSource.y < conDestination.y ) {
        y1 = conSource.y + conSource.height;
        y2 = conDestination.y - arrowSize;

        arrowTranslate = "translate(" + (x1 - arrowSize / 2 - strokeVariance) + ", " + y2 + ")";
        arrowD = "M0 0 L" + arrowSize + " 0 L" + arrowSize / 2 + " " + arrowSize + " Z";
        if( !showDetailedModel ) {
          arrowTranslate = "translate(" + (x1 + (x2 - x1) / 2) + "," + (y1 - height * 0.8 / 2) + ") scale(1, 0.8)";
          arrowD = "M0 0 L" + height * 0.25 + " 0 L" + height / 2 + " " + height / 2 + " L" + height * 0.25 + " "
            + height + " L0 " + height + " L" + (height / 2 - height * 0.25) + " " + height / 2 + "Z";
        }

        textHeight = (labelRows + 2) * labelRowSize;

        textY = y2 - textHeight;
      }
      else {
        y1 = conDestination.y + conDestination.height + arrowSize;
        y2 = conSource.y;

        arrowTranslate = "translate(" + (x1 - arrowSize / 2 - strokeVariance) + ", " + (y1 - arrowSize) + ")";
        arrowD = "M0 " + arrowSize + " L" + arrowSize / 2 + "  0 L" + arrowSize + " " + arrowSize + " Z";
        if( !showDetailedModel ) {
          arrowTranslate = "translate(" + (x1 + (x2 - x1) / 2) + "," + (y1 - height * 0.8 / 2) + ") scale(-1,0.8)";
          arrowD = "M0 0 L" + height * 0.25 + " 0 L" + height / 2 + " " + height / 2 + " L" + height * 0.25 + " "
            + height + " L0 " + height + " L" + (height / 2 - height * 0.25) + " " + height / 2 + "Z";
        }

        textHeight = (y1 - arrowSize) - y2;//

        textY = y2 - textHeight;
      }
    }

    return {
      connection: con,
      connectionType: connectionType,
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
      textX: textX,
      textY: textY,
      textWidth: textWidth,
      textHeight: textHeight,
      arrowTranslate: arrowTranslate,
      arrowD: arrowD,
      textAnchor: textAnchor
    }
  } );

};

export const processActions = ( actions: Action[],
  processedParticipants: ProcessedParticipant[], rowHeights: RowHeight[], connectionGapHeights: ConnectionGapHeight[],
  caseY: number, canvasWidth: number, caseHeaderHeight: number, showDetailedModel: boolean ): ProcessedAction[] => {

  return actions.map( ( a, index ) => {
    const aParticipant = processedParticipants.find( p => p.participant.id === a.participantID )!;

    const actionsRowHeightsAbove = rowHeights.filter( item => item.pos < a.position.start ).map( item => item.value )
      .reduce( ( acc, current ) => acc + current, 0 );

    const connectionGapHeightsAbove = connectionGapHeights.filter( item => item.pos < a.position.start )
      .map( item => item.value ).reduce( ( acc, current ) => acc + current, 0 );

    const connectionGapHeightsInner = connectionGapHeights.filter(
      item => item.pos >= a.position.start && item.pos < a.position.end )
      .map( item => item.value ).reduce( ( acc, current ) => acc + current, 0 );

    let x = canvasWidth * 0.3;
    let width = getAbsoluteValue( canvasWidth, (PARTICIPANTS_SIZE - 10) );
    if( showDetailedModel ) {
      x = aParticipant.x + getAbsoluteValue( canvasWidth, ACTION_MARGIN_LEFT );
      width = aParticipant.width - getAbsoluteValue( canvasWidth, ACTION_MARGIN_LEFT ) - getAbsoluteValue( canvasWidth,
        ACTION_MARGIN_RIGHT );
    }

    const y = caseY
      + getAbsoluteValue( canvasWidth, CASE_PADDING_TOP )
      + caseHeaderHeight
      + actionsRowHeightsAbove
      + connectionGapHeightsAbove;

    const height = rowHeights.filter( item => (item.pos >= a.position.start && item.pos <= a.position.end) )
        .map( item => item.value ).reduce( ( acc, current ) => acc + current )
      + connectionGapHeightsInner;

    return { action: a, x: x, y: y, width: width, height: height };
  } );
};

export const processDataSources = ( dataSources: DataSource[], rowHeights: RowHeight[],
  connectionGapHeights: ConnectionGapHeight[],
  caseY: number, canvasWidth: number, caseHeaderHeight: number ): ProcessedDataSource[] => {

  return dataSources.map( ds => {
    const dataSourcesRowHeightsAbove = rowHeights.filter( item => item.pos < ds.position.start )
      .map( item => item.value ).reduce( ( acc, current ) => acc + current, 0 );

    const connectionGapHeightsAbove = connectionGapHeights.filter( item => item.pos < ds.position.start )
      .map( item => item.value ).reduce( ( acc, current ) => acc + current, 0 );

    const connectionGapHeightsInner = connectionGapHeights.filter(
      item => item.pos >= ds.position.start && item.pos < ds.position.end )
      .map( item => item.value ).reduce( ( acc, current ) => acc + current, 0 );

    const x = getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_LEFT_OR_RIGHT );
    const y = caseY + getAbsoluteValue( canvasWidth, CASE_PADDING_TOP ) + caseHeaderHeight
      + dataSourcesRowHeightsAbove
      + connectionGapHeightsAbove;

    const width = getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_WIDTH );

    let height = rowHeights.filter( item => (item.pos >= ds.position.start && item.pos <= ds.position.end) )
        .map( item => item.value ).reduce( ( acc, current ) => acc + current, 0 )
      + connectionGapHeightsInner;

    return {
      dataSource: ds,
      x: x,
      y: y,
      width: width,
      height: height
    };
  } );
};

export const processDataPurposes = ( dataPurposes: DataPurpose[], rowHeights: RowHeight[],
  connectionGapHeights: ConnectionGapHeight[],
  caseY: number, canvasWidth: number, caseHeaderHeight: number ): ProcessedDataPurpose[] => {

  return dataPurposes.map( dp => {
    const dataSourcesRowHeightsAbove = rowHeights.filter( item => item.pos < dp.position.start )
      .map( item => item.value ).reduce( ( acc, current ) => acc + current, 0 );

    const connectionGapHeightsAbove = connectionGapHeights.filter( item => item.pos < dp.position.start )
      .map( item => item.value ).reduce( ( acc, current ) => acc + current, 0 );

    const connectionGapHeightsInner = connectionGapHeights.filter(
      item => item.pos >= dp.position.start && item.pos < dp.position.end )
      .map( item => item.value ).reduce( ( acc, current ) => acc + current, 0 );

    const x = getAbsoluteValue( canvasWidth,
      (100 - DATASOURCE_AND_DATAPURPOSE_WIDTH - DATASOURCE_AND_DATAPURPOSE_LEFT_OR_RIGHT) );

    const y = caseY + getAbsoluteValue( canvasWidth, CASE_PADDING_TOP ) + caseHeaderHeight
      + dataSourcesRowHeightsAbove
      + connectionGapHeightsAbove;

    const width = getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_WIDTH );

    let height = rowHeights.filter( item => (item.pos >= dp.position.start && item.pos <= dp.position.end) )
        .map( item => item.value ).reduce( ( acc, current ) => acc + current, 0 )
      + connectionGapHeightsInner;

    return {
      dataPurpose: dp,
      x: x,
      y: y,
      width: width,
      height: height
    };
  } );
};

export const calcRowHeights = ( showDetailMode: boolean, c: Case, processedParticipants: ProcessedParticipant[],
  canvasWidth: number ): RowHeight[] => {

  // HEIGHT FOR ACTIONS
  let actionList: RowHeight[] = [];
  if( showDetailMode ) {
    const maxPos = Math.max.apply( Math, c.actions.map( ( a: Action ) => {
      return a.position.end;
    } ) );

    actionList = Array.from( { length: maxPos + 1 }, ( v, i ): RowHeight[] => {
      const affectedActions = c.actions.filter( item => i >= item.position.start && i <= item.position.end );

      return affectedActions.map( ( a: Action ) => {
        const aParticipant = processedParticipants.find( p => p.participant.id === a.participantID )!;
        const width = aParticipant.width - getAbsoluteValue( canvasWidth, ACTION_MARGIN_LEFT ) - getAbsoluteValue(
          canvasWidth, ACTION_MARGIN_RIGHT )
          - getAbsoluteValue( canvasWidth, ACTION_PADDING_LEFT ) - getAbsoluteValue( canvasWidth,
            ACTION_PADDING_RIGHT );
        const aCellCount = a.position.end - a.position.start;

        const labelRows = a.label.map( ( label: string ) => {
            return getStringArrayByWidth( label, width, getAbsoluteValue( canvasWidth, ACTION_ROW_SIZE ) ).length;
          } ).reduce( ( sum, current ) => sum + current, 0 )
          + a.label.length - 1; // ABSÄTZE

        if( aCellCount <= 0 ) {
          const cellHeight = labelRows * getAbsoluteValue( canvasWidth, ACTION_ROW_SIZE )
            + getAbsoluteValue( canvasWidth, ACTION_PADDING_TOP )
            + getAbsoluteValue( canvasWidth, ACTION_PADDING_BOTTOM )
            + getAbsoluteValue( canvasWidth, ACTION_MARGIN_TOP )
            + getAbsoluteValue( canvasWidth, ACTION_MARGIN_BOTTOM );
          return { pos: i, value: cellHeight };
        }
        else {
          const cellHeight = (labelRows * getAbsoluteValue( canvasWidth, ACTION_ROW_SIZE )) / aCellCount
            + getAbsoluteValue( canvasWidth, ACTION_PADDING_TOP ) + getAbsoluteValue( canvasWidth,
              ACTION_PADDING_BOTTOM )
            + getAbsoluteValue( canvasWidth, ACTION_MARGIN_TOP ) + getAbsoluteValue( canvasWidth,
              ACTION_MARGIN_BOTTOM );
          return { pos: i, value: cellHeight };
        }

      } );

    } ).map( item => item!.reduce( ( prev, current ) => {
      return (prev!.value > current!.value) ? prev : current;
    } ) );
  }

  // HEIGHT FOR DATASOURCES / DATAPURPOSES
  const dataSourcesMaxPos = Math.max.apply( Math, c.dataSources.map( ( ds: DataSource ) => {
    return ds.position.end;
  } ) );

  const dataSourcesList = Array.from( { length: dataSourcesMaxPos + 1 }, ( v, i ): RowHeight[] => {
    const affectedDataSources = c.dataSources.filter( item => i >= item.position.start && i <= item.position.end );

    return affectedDataSources.map( ( ds: DataSource ) => {

      const textWidth = getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_WIDTH )
        - getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_LEFT )
        - getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_RIGHT );

      const dsCellCount = ds.position.end - ds.position.start;

      const labelRows = ds.label.map( ( label: string ) => {
          return getStringArrayByWidth( label, textWidth,
            getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_ROW_SIZE ) ).length;
        } ).reduce( ( sum, current ) => sum + current, 0 )
        + ds.label.length - 1 + 2;

      if( dsCellCount <= 0 ) {
        const cellHeight = labelRows * getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_ROW_SIZE )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_TOP )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_BOTTOM )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_MARGIN_TOP )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_MARGIN_BOTTOM );
        return { pos: i, value: cellHeight };
      }
      else {
        const cellHeight = (labelRows * getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_ROW_SIZE ))
          / dsCellCount
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_ROW_SIZE )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_TOP )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_BOTTOM )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_MARGIN_TOP )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_MARGIN_BOTTOM );
        return { pos: i, value: cellHeight };
      }

    } );

  } ).map( item => item!.reduce( ( prev, current ) => {
    return (prev!.value > current!.value) ? prev : current;
  } ) );

  // HEIGHT FOR  DATAPURPOSES
  const dataPurposesMaxPos = Math.max.apply( Math, c.dataPurposes.map( ( dp: DataPurpose ) => {
    return dp.position.end;
  } ) );

  const dataPurposesList = Array.from( { length: dataPurposesMaxPos + 1 }, ( v, i ): RowHeight[] => {
    const affectedDataPurposes = c.dataPurposes.filter( item => i >= item.position.start && i <= item.position.end );

    return affectedDataPurposes.map( ( dp: DataPurpose ) => {

      const textWidth = getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_WIDTH )
        - getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_LEFT )
        - getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_RIGHT );

      const dpCellCount = dp.position.end - dp.position.start;

      const labelRows = dp.label.map( ( label: string ) => {
          return getStringArrayByWidth( label, textWidth,
            getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_ROW_SIZE ) ).length;
        } ).reduce( ( sum, current ) => sum + current, 0 )
        + dp.label.length - 1 + 2; // TODO substitute const 2

      if( dpCellCount <= 0 ) {
        const cellHeight = labelRows * getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_ROW_SIZE )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_TOP )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_BOTTOM )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_MARGIN_TOP )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_MARGIN_BOTTOM );
        return { pos: i, value: cellHeight };
      }
      else {
        const cellHeight = (labelRows * getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_ROW_SIZE ))
          / dpCellCount
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_ROW_SIZE )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_TOP )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_PADDING_BOTTOM )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_MARGIN_TOP )
          + getAbsoluteValue( canvasWidth, DATASOURCE_AND_DATAPURPOSE_MARGIN_BOTTOM );
        return { pos: i, value: cellHeight };
      }

    } );

  } ).map( item => item!.reduce( ( prev, current ) => {
    return (prev!.value > current!.value) ? prev : current;
  } ) );

  const combinedList: RowHeight[] = [...actionList, ...dataSourcesList, ...dataPurposesList];
  const result: RowHeight[] = [];
  new Set( combinedList.map( item => item.pos ) ).forEach( pos => {
    result.push( {
      pos: pos,
      value: Math.max.apply( Math, combinedList.filter( item => item.pos === pos ).map( item => item.value ) )
    } )
  } );

  return result;
};

const calcConnectionGapHeights = ( showDetailedMode: boolean, rowCount: number, connections: Connection[],
  actions: Action[], dataSources: DataSource[], dataPurposes: DataPurpose[],
  processedParticipants: ProcessedParticipant[], canvasWidth: number ): ConnectionGapHeight[] => {

  return Array.from( { length: rowCount }, ( item, i ) => {

    const affectedConnections = connections.filter( con => con.position.start <= i && con.position.end >= i );

    const connectionTextGapHeights: number[] = affectedConnections.map( ( con: Connection ) => {

      actions.filter( item => item.id === con.source || item.id === con.destination );

      if( con.position.start === con.position.end ) { // horizontal
        return 0;
      }
      else {
        const conRowCount = con.position.end - con.position.start;

        if( conRowCount <= 0 ) {
          return getAbsoluteValue( canvasWidth, CONNECTION_ROW_SIZE )
            + getAbsoluteValue( canvasWidth, CONNECTION_ARROW_SIZE ) * 2;
        }
        else {
          return getAbsoluteValue( canvasWidth, CONNECTION_ROW_SIZE ) / conRowCount
            + getAbsoluteValue( canvasWidth, CONNECTION_ARROW_SIZE ) * 2;
        }
      }

    } );

    //ShortInfo Calculation
    const affectedActions = actions.filter( a => a.position.end === i );
    const affectedDataSources = dataSources.filter( ds => ds.position.end === i );
    const affectedDataPurposes = dataPurposes.filter( dp => dp.position.end === i );

    const affectedObjects = [...affectedActions, ...affectedDataSources, ...affectedDataPurposes];

    const shortInfoHeight = affectedObjects.map( o => o.shortInfo ).filter( o => o !== undefined ).length > 0 ?
      getAbsoluteValue( canvasWidth, SHORTINFO_MARGIN_BOTTOM ) :
      0;

    const result = (affectedConnections.length > 0 ? Math.max( ...connectionTextGapHeights ) : 0) + shortInfoHeight
      || getAbsoluteValue( canvasWidth, MIN_GAP_HEIGHT );

    return {
      pos: i,
      value: result
    };
  } );

};

export const getCaseHeaderHeight = ( labels: string[], canvasWidth: number ) => {
  const caseHeaderLabelRows =
    labels.map( ( label: string ) => {
      return getStringArrayByWidth( label, canvasWidth / 100 * 25,
        getAbsoluteValue( canvasWidth, CASE_HEADER_LABEL_SIZE ) ).length;
    } ).reduce( ( sum, current ) => sum + current, 0 );

  return (caseHeaderLabelRows <= 1 ? 2 : caseHeaderLabelRows) * getAbsoluteValue( canvasWidth,
    CASE_HEADER_HEIGHT );
};

export const processCases = ( showDetailedModel: boolean, cases: Case[], canvasWidth: number, canvasHeight: number,
  processedParticipants: ProcessedParticipant[], openCases: string[],
  connectionTypes: ConnectionType[], isLowMode: boolean ): ProcessedCase[] => {

  let caseHeights = cases.map( item => {
    return { id: item.id, height: getAbsoluteValue( canvasWidth, CASE_HEADER_HEIGHT ) }
  } );

  return cases.map( ( c, index ) => {

    const rowHeights = calcRowHeights( showDetailedModel, c, processedParticipants, canvasWidth );

    const connectionGapHeights = calcConnectionGapHeights( showDetailedModel, rowHeights.length, c.connections,
      c.actions, c.dataSources, c.dataPurposes,
      processedParticipants, canvasWidth );

    // CASE
    const caseHeaderHeight = getCaseHeaderHeight( [c.label], canvasWidth );

    const caseHeight = rowHeights.map( item => item.value ).reduce( ( sum: number, current: number ) => {
        return sum + current;
      }, 0 )
      + connectionGapHeights.map( con => con.value ).reduce( ( sum: number, current: number ) => {
        return sum + current;
      }, 0 )
      + caseHeaderHeight
      + getAbsoluteValue( canvasWidth, CASE_PADDING_TOP )
      + getAbsoluteValue( canvasWidth, CASE_PADDING_BOTTOM );

    caseHeights = caseHeights.map( item => {
      if( item.id === c.id ) {
        return openCases.includes( c.id ) ?
          { id: item.id, height: caseHeight } :
          { id: item.id, height: caseHeaderHeight }
      }
      else {
        return { id: item.id, height: item.height };
      }

    } );

    const casesHeightsAbove = caseHeights.filter( ( item, j ) => j < index ).map( item => item.height );

    const caseY = (casesHeightsAbove.length > 0 ? casesHeightsAbove.reduce( ( acc, current ) => acc + current ) : 0)

      + getAbsoluteValue( canvasWidth, HEADER_OFFSET ) + (getAbsoluteValue( canvasWidth, CASE_PADDING_TOP )
        + getAbsoluteValue( canvasWidth, CASE_MARGIN_BOTTOM )) * casesHeightsAbove.length;

    let processedActions: ProcessedAction[] = [];
    // ACTIONS
    processedActions = processActions( c.actions, processedParticipants, rowHeights, connectionGapHeights,
      caseY, canvasWidth, caseHeaderHeight, showDetailedModel );

    // DATASOURCE
    const processedDataSources = processDataSources( c.dataSources, rowHeights, connectionGapHeights,
      caseY,
      canvasWidth, caseHeaderHeight );
    const processedDataPurposes = processDataPurposes( c.dataPurposes, rowHeights, connectionGapHeights,
      caseY,
      canvasWidth, caseHeaderHeight );

    let processedConnections: ProcessedConnection[] = [];
    // Connections
    processedConnections = processConnections( c.connections, connectionTypes, processedActions, processedDataSources,
      processedDataPurposes, rowHeights,
      connectionGapHeights, caseY, canvasWidth, caseHeaderHeight, showDetailedModel, isLowMode );


    return {
      id: c.id,
      label: c.label,
      dataSources: processedDataSources,
      dataPurposes: processedDataPurposes,
      actions: processedActions,
      connections: processedConnections,
      shortInfo: [],
      infoTitle: c.infoTitle,
      info: c.info,
      permissions: c.permissions,

      isOpen: c.isOpen,
      x: 0,
      y: caseY,
      width: 0,
      height: openCases.includes( c.id ) ? caseHeight : caseHeaderHeight
    }

  } );

};