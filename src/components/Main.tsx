/** @jsx jsx */
import { jsx } from '@emotion/core'

import React, { useEffect, useState } from "react";
import { useMeasure, useToggle } from "react-use";
import { Action, DataPurpose, DataSource, FixedLabels, } from "./Data";
import { Dialog } from "./dialog/Dialog";
import { SVGLegend } from "./graph/SVGLegend";
import { SVGParticipant } from "./graph/SVGParticipant";
import { SVGCase } from "./graph/SVGCase";
import {
  getCaseHeaderHeight,
  processCases,
  ProcessedAction,
  ProcessedCase,
  ProcessedConnection,
  ProcessedDataPurpose,
  ProcessedDataSource,
  ProcessedParticipant,
  processParticipants
} from "../utils/Processing";
import { SVGAction } from "./graph/SVGAction";

import { SVGDataSource } from "./graph/SVGDataSource";
import { SVGConnection } from "./graph/SVGConnection";
import { SVGDataPurpose } from "./graph/SVGDataPurpose";
import {
  BROWSER_COMPABILITY,
  CASE_HEADER_HEIGHT,
  CASE_MARGIN_BOTTOM, CONTROLS_HEIGHT, HEADER_MARGIN_BOTTOM, HEADER_MARGIN_TOP,
  HEADER_OFFSET, LEGEND_LABEL_ICON_SIZE, LEGEND_LABEL_SIZE,
  PARTICIPANTS_LABEL_SIZE, SHOW_DETAILED_VIEW, SUBTITLE_MARGIN_BOTTOM, TITLE_OFFSET
} from "./Constants";
import { SVGPolicy } from "./graph/SVGPolicy";
import { EllipsisDialogData } from "./graph/SVGText";
import { SVGEllipsisDialog } from "./graph/SVGEllipsisDialog";
import { useMobile } from "../hooks/useMobile";
import { SVGCaseActionIdentifier } from "./graph/SVGCaseActionIdentifier";
import { processGlossar } from "../utils/GlossarProcessing";
import { GlossarDialog } from "./dialog/GlossarDialog";
import { filter_blur } from "../style/style";

import { useIsBrowserCompatible } from "../hooks/useIsBrowserCompatible";
import { BrowserCompatibilityWarning } from "./dialog/BrowserCompatibilityWarning";
import { Header } from "./header/Header";
import { useBrowser } from "../hooks/useBrowser";
import { getAbsoluteValue } from "../utils/LayoutCalc";
import { CreditsDialog } from "./dialog/CreditsDialog";
import { LegalNoticeDialog } from "./dialog/LegalNoticeDialog";

import lang_en from "../assets/lang/lang_en.json";
import lang_de from "../assets/lang/lang_de.json";

interface Props {
  detailedModel: any;
  simpleModel: any;
}

const Main: React.FunctionComponent<Props> = props => {

  const [isBrowserCompatible, isLowMode] = useIsBrowserCompatible( BROWSER_COMPABILITY );
  const [isBrowserCompabilityWarningClosed, setIsBrowserCompabilityWarningClosed] = useState<boolean>( false );
  const isMobile = useMobile();
  const [browserName] = useBrowser();

  const [ref, { width, height }] = useMeasure();
  const currentRef = React.createRef<HTMLDivElement>();
  const [yScrollOffset, setYScrollOffset] = useState<number>( 0 );
  let baseYScrollOffset = 0;
  const [openCases, setOpenCases] = useState<string[]>( [] );
  const [activeObjects, setActiveObjects] = useState<string[]>( [] );

  const [infoIconSize, setInfoIconSize] = useState<number>( 0 );
  const [ellipsisDialogData, setEllipsisDialogData] = useState<EllipsisDialogData | null>( null );
  const [policy, setPolicy] = useState<{ erasurePolicy: string, storagePolicy: string, x: number, y: number } | null>(
    null );
  const [canvasHeight, setCanvasHeight] = useState<number>( 0 );
  const [actualHeight, setActualHeight] = useState<number>( 0 );

  const [infoDialogContent, setInfoDialogContent] = useState<{ title: string[], content: string } | null>( null );

  const [legendShown, toggleLegendShown] = useToggle( false );

  const [showDetailedModel, setShowDetailedModel] = useState<boolean>( SHOW_DETAILED_VIEW );

  let { language, title, subtitle, participants, connectionTypes, boxTypes, cases, sourceInformation, revisionHistory, glossar, isDialogFullsize, isDetailedIcons, fixedLabels, colors }
    = (showDetailedModel ? props.detailedModel : props.simpleModel);
  const [activeLang, setActiveLang] = useState<FixedLabels>(lang_en);

  const [isCreditsDialog, setIsCreditsDialog] = useState<boolean>( false );
  const [isLegalNoticeDialog, setIsLegalNoticeDialog] = useState<boolean>( false );
  const [glossarInfoContent, setGlossarInfoContent] = useState<{ title: string, content: string } | null>( null );

  //Blur
  const [isInfoDialogBlurred, setIsInfoDialogBlurred] = useState<boolean>( false );
  const [isGlossarDialogBlurred, setIsGlossarDialogBlurred] = useState<boolean>( false );

  //ZOOMING
  const [canvasWidth, setCanvasWidth] = useState<number>( width );
  const [canvasX, setCanvasX] = useState<number>( 0 );
  const [canvasY, setCanvasY] = useState<number>( 0 );
  const [factorizedCanvasWidth, setFactorizedCanvasWidth] = useState<number>( width );
  const [zoomFactor, setZoomFactor] = useState<number>( 1.0 ); //0.0 - 1.0

  //FULLSCREEN
  const isInFullscreen = () => {
    return document.fullscreenElement || (document as any).webkitFullscreenElement;
  };

  const toggleFullscreen = () => {
    const uncheckedElement = document.getElementById( "data-process-modeler" ) as any;
    const anyDocument = document as any;

    if( !isInFullscreen() ) {
      if( uncheckedElement ) {
        if( uncheckedElement.requestFullscreen ) {
          uncheckedElement.requestFullscreen();
        }
        else if( uncheckedElement.mozRequestFullScreen ) { /* Firefox */
          uncheckedElement.mozRequestFullScreen();
        }
        else if( uncheckedElement.webkitRequestFullscreen ) { /* Chrome, Safari & Opera */
          uncheckedElement.webkitRequestFullscreen();
        }
        else if( uncheckedElement.msRequestFullscreen ) { /* IE/Edge */
          uncheckedElement.msRequestFullscreen();
        }
      }
    }
    else {
      if( anyDocument.exitFullscreen ) {
        anyDocument.exitFullscreen();
      }
      else if( anyDocument.mozCancelFullScreen ) { /* Firefox */
        anyDocument.mozCancelFullScreen();
      }
      else if( anyDocument.webkitExitFullscreen ) { /* Chrome, Safari and Opera */
        anyDocument.webkitExitFullscreen();
      }
      else if( anyDocument.msExitFullscreen ) { /* IE/Edge */
        anyDocument.msExitFullscreen();
      }
    }
  };

  //Language
  useEffect(() => {
    if(language === 'de') {
      setActiveLang(lang_de);
    } else {
      setActiveLang(lang_en)
    }
  },[language]);

  //SCROLLING
  const resetYScrollOffset = () => {
    setYScrollOffset( 0 );
    window.scrollTo( 0, 0 );
  };

  useEffect( () => {

    //use seperate var, because ref doesnt work when updates called by browser event listener(out of hook lifecycle)
    const currentWrapper = currentRef.current;

    const update = () => {
      if( currentWrapper ) {
        setCanvasWidth( currentWrapper.getBoundingClientRect().width );
        setCanvasHeight( currentWrapper.getBoundingClientRect().height );
        setCanvasX( currentWrapper.getBoundingClientRect().x );
        setCanvasY( currentWrapper.getBoundingClientRect().y );
      }
    };

    const handleScroll = () => {
      if( currentWrapper ) {
        if( currentWrapper.getBoundingClientRect().y < 0 ) {
          setYScrollOffset( window.scrollY - baseYScrollOffset );
        }
        else {
          setYScrollOffset( 0 )
        }
      }
    };

    update();
    if( currentWrapper ) {
      baseYScrollOffset = currentWrapper.getBoundingClientRect().y;
    }

    window.addEventListener( 'resize', update );
    window.addEventListener( 'scroll', handleScroll );
    return () => {
      window.removeEventListener( 'resize', update );
      window.removeEventListener( 'scroll', handleScroll );
    };

  }, [currentRef.current] );

  useEffect( () => {
    if( isMobile ) {
      setShowDetailedModel( true );
    }
  }, [isMobile] );

  useEffect( () => {
    resetYScrollOffset();
    setOpenCases( [] );
  }, [showDetailedModel] );

  useEffect( () => {
    setFactorizedCanvasWidth( canvasWidth * zoomFactor );
  }, [canvasHeight, height, width, zoomFactor] );

  useEffect( () => {
    !!glossarInfoContent ? setIsGlossarDialogBlurred( true ) : setIsGlossarDialogBlurred( false );
  }, [glossarInfoContent] );
  useEffect( () => {
    //BLUR
    !!infoDialogContent ? setIsInfoDialogBlurred( true ) : setIsInfoDialogBlurred( false );

    //GLOSSAR
    let keywordTriggerList = document.getElementsByClassName( "keyword-trigger" );
    for( let i = 0; i < keywordTriggerList.length; i++ ) {
      const id = keywordTriggerList[i].id;
      const glossarItem = glossar?.find( ( g: any ) => g.id === id );
      keywordTriggerList[i].addEventListener( "click", ( e ) => {

        if( glossarItem ) {
          setGlossarInfoContent( { title: glossarItem.title, content: glossarItem.content } );
        }
      }, false );
    }
  }, [glossar, infoDialogContent] );

  useEffect( () => {
    if( glossar ) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      cases = processGlossar( glossar, cases, colors.glossarKeyword );
    }
  }, [glossar, cases] );

  let processedParticipants = processParticipants( participants, factorizedCanvasWidth, actualHeight );
  let processedCases = processCases( showDetailedModel, cases, factorizedCanvasWidth, actualHeight,
    processedParticipants, openCases,
    connectionTypes, isLowMode );

  useEffect( () => {
    setOpenCases( cases.filter( ( c: any ) => c.isOpen ).map( ( c: any ) => c.id ) );
    //window.screen.orientation.lock( 'landscape-primary' );
  }, [cases] );

  useEffect( () => {
    setEllipsisDialogData( null );
    setPolicy( null );
  }, [width] );

  useEffect( () => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    processedParticipants = processParticipants( participants, factorizedCanvasWidth, actualHeight );
    // eslint-disable-next-line react-hooks/exhaustive-deps
    processedCases = processCases( showDetailedModel, cases, factorizedCanvasWidth, actualHeight,
      processedParticipants, openCases,
      connectionTypes, isLowMode );
    setEllipsisDialogData( null );
  }, [openCases] );

  useEffect( () => {
    if( showDetailedModel ) {
      setInfoIconSize( processedParticipants[0].width * 0.1 );
    }
    else {
      setInfoIconSize( processedCases[0].dataSources[0].width * 0.075 );
    }
  }, [processedCases, processedParticipants, showDetailedModel] );

  const handleCaseClick = ( id: string ) => {
    openCases.includes( id )
      ? setOpenCases( openCases.filter( item => item !== id ) )
      : setOpenCases( openCases.concat( id ) );

    let pc = processedCases.find( ( c ) => c.id === id );
    if( pc ) {
      handleObjectClick( pc, pc.dataSources[0].dataSource, true );
    }
  };

  useEffect( () => {

    const newHeight = getAbsoluteValue( factorizedCanvasWidth, HEADER_OFFSET ) + processedCases
      .map( item => item.height )
      .reduce( ( acc, current ) => acc + current ) + processedCases.length * getAbsoluteValue( factorizedCanvasWidth,
      CASE_MARGIN_BOTTOM );
    const heightLastItem = openCases.includes( processedCases[processedCases.length - 1].id ) ?
      0 :
      processedCases[processedCases.length - 1].height;

    setActualHeight(
      newHeight + heightLastItem + getAbsoluteValue( factorizedCanvasWidth,
      CASE_MARGIN_BOTTOM ) );

  }, [processedCases] );

  const handleObjectClick = ( c: ProcessedCase, obj: DataSource | Action | DataPurpose,
    isCaseOpeningEvent: boolean ) => {

    if( activeObjects.includes( obj.id ) && !isCaseOpeningEvent && obj.infoTitle && obj.info ) {
      setInfoDialogContent( {
        title: [obj.infoTitle],
        content: obj.info
      } )
    }
    else {
      const getInterval = ( obj: DataSource | Action | DataPurpose ) => {
        return Array( obj.position.end - obj.position.start + 1 ).fill( obj )
          .map( ( _, idx: any ) => obj.position.start + idx );
      };
      const hasIntersection = ( obj: DataSource | Action | DataPurpose ) => {
        let arrB = getInterval( obj );
        return arrA.filter( x => arrB.includes( x ) ).length > 0;
      };
      const arrA = getInterval( obj );
      let list: string[] = [obj.id];

      list.push(
        ...c.dataSources.filter( item => {
          return hasIntersection( item.dataSource )
        } ).map( item => {
          return item.dataSource.id
        } ),
        ...c.actions.filter( item => hasIntersection( item.action ) ).map( item => {
          return item.action.id
        } ),
        ...c.dataPurposes.filter( item => hasIntersection( item.dataPurpose ) ).map( item => {
          return item.dataPurpose.id
        } )
      );
      setActiveObjects( list );
    }

  };

  return (
    <div ref={currentRef}
         css={theme => ([{
           height: "100%",
           overflowY: 'auto',
           overflowX: 'hidden'
         }])}
         onScroll={( e ) => {
           setYScrollOffset( e.currentTarget.scrollTop )
         }}
    >

      <div className={"canvas"}
           css={theme => ({
             width: 'calc(' + factorizedCanvasWidth + ' - 6px)',
             paddingRight: '6px',
             height: "100%",
             backgroundColor: "white"
           })}
           ref={ref}
      >

        <div css={theme => ({
          display: 'flex',
          flexDirection: 'column'
        })}>

          <Header showDetailedModel={showDetailedModel}
                  fixedLabels={fixedLabels}
                  language={activeLang}
                  toggleMode={() => setShowDetailedModel( !showDetailedModel )}
                  toggleLegend={() => toggleLegendShown()}
                  marginTop={canvasWidth / 100 * HEADER_MARGIN_TOP}
                  labelSize={canvasWidth / 100 * LEGEND_LABEL_SIZE}
                  iconSize={canvasWidth / 100 * LEGEND_LABEL_ICON_SIZE}
                  isMobile={isMobile}
                  yScrollOffset={yScrollOffset}
                  canvasWidth={canvasWidth}
                  zoomFactor={zoomFactor}
                  onZoomIn={() => {
                    setZoomFactor( zoomFactor < 1 ? zoomFactor + 0.05 : zoomFactor )
                  }}
                  onZoomOut={() => {
                    setZoomFactor( zoomFactor > 0.5 ? zoomFactor - 0.05 : zoomFactor )
                  }}

                  onFullscreen={toggleFullscreen}

                  colors={colors}
                  isFullscreen={isInFullscreen()}
                  sourceLabel={fixedLabels.headerSource || activeLang.headerSource!}
                  purposeLabel={fixedLabels.headerPurpose || activeLang.headerPurpose!}
                  processLabel={fixedLabels.headerProcess || activeLang.headerProcess!}
                  height={height}
                  isLowMode={isLowMode}
                  factorizedCanvasWidth={factorizedCanvasWidth}
                  isInfoDialogBlurred={isInfoDialogBlurred}
                  processedParticipants={processedParticipants}
                  isIos={browserName == 'Safari'}
                  title={title}
                  subtitle={subtitle}
          />


          <div css={theme => ([{
            width: canvasWidth,
            display: 'flex',
            justifyContent: 'center'
          }])}>
            <svg key={Math.random()}
                 xmlns="http://www.w3.org/2000/svg"
                 version={"1.2"}

                 viewBox={"0 0 " + factorizedCanvasWidth + " " + (actualHeight + 500)}

                 css={theme => ([{
                   width: factorizedCanvasWidth,
                   marginTop: getAbsoluteValue( factorizedCanvasWidth, HEADER_MARGIN_TOP )
                     + getAbsoluteValue( factorizedCanvasWidth, CONTROLS_HEIGHT )
                     + getAbsoluteValue( factorizedCanvasWidth, HEADER_MARGIN_BOTTOM )
                     + (!!title ? getAbsoluteValue( factorizedCanvasWidth, TITLE_OFFSET ) : 0)
                     + (1 - zoomFactor) * (canvasWidth / 10)
                     + (!!subtitle ? getAbsoluteValue( factorizedCanvasWidth, SUBTITLE_MARGIN_BOTTOM ) * 2 : 0)
                 }, isInfoDialogBlurred && filter_blur])}
            >


              {/*SHADOW DEFS*/}
              <defs>
                <linearGradient id="CoronaGradient1">
                  <stop offset="29%" stopColor={'#b4daf1'}/>
                  <stop offset="126%" stopColor={'#b4daf1'}/>
                </linearGradient>
                <linearGradient id="CoronaGradient_middle">
                  <stop offset="29%" stopColor={'#b4daf1'}/>
                  <stop offset="126%" stopColor={'#b07894'}/>
                </linearGradient>
                <linearGradient id="CoronaGradient2">
                  <stop offset="29%" stopColor={'#b07894'}/>
                  <stop offset="126%" stopColor={'#AE4261'}/>
                </linearGradient>
                <linearGradient id="CoronaGradient3">
                  <stop offset="29%" stopColor={'#b4daf1'}/>
                  <stop offset="126%" stopColor={'#AE4261'}/>
                </linearGradient>
                <filter id="shadow">
                  <feDropShadow dx="2" dy="4" stdDeviation="2" floodColor={'#7D7D7D'}/>
                </filter>

                <filter id="shadow_sides">
                  <feDropShadow dx="2" dy="0" stdDeviation="2" floodColor={'#7D7D7D'}/>
                </filter>

                <filter id="highlight">
                  <feComponentTransfer in='SourceAlpha'>
                    <feFuncA type="table" tableValues="1 0"/>
                  </feComponentTransfer>
                  <feGaussianBlur stdDeviation="4"/>
                  <feOffset dx="2" dy="2" result="offsetblur"/>
                  <feFlood floodColor="rgba(0,0,0,0.7)" result="color"/>
                  <feComposite in2="offsetblur" operator="in"/>
                  <feComposite in2="SourceAlpha" operator="in"/>
                  <feMerge>
                    <feMergeNode in="SourceGraphic"/>
                    <feMergeNode/>
                  </feMerge>
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor={"white"}/>
                </filter>

                <linearGradient id="white_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="80%" stopColor="white" stopOpacity="100%"/>
                  <stop offset="100%" stopColor="white" stopOpacity="0%"/>
                </linearGradient>
                <linearGradient id="blue_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="15%" stopColor={'#d4eaf7'} stopOpacity="100%"/>
                  <stop offset="100%" stopColor={'#d4eaf7'} stopOpacity="0%"/>
                </linearGradient>
                <linearGradient id="gray_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="15%" stopColor={'#F2F2F2'} stopOpacity="100%"/>
                  <stop offset="100%" stopColor={'#F2F2F2'} stopOpacity="0%"/>
                </linearGradient>
              </defs>


              {processedCases.map( ( c ) => {
                return (
                  <SVGCase key={Math.random()}
                           case={c}
                           x={c.x}
                           y={c.y}
                           width={c.width}
                           canvasWidth={factorizedCanvasWidth}
                           height={c.height}
                           openCases={openCases}
                           toggle={( id: string ) => handleCaseClick( id )}
                           onShowInfoText={( title: string[] | undefined, content: string | undefined ) => {
                             setInfoDialogContent( {
                               title: title ? title : [""],
                               content: content ? content : ""
                             } )
                           }}
                           fixedLabels={fixedLabels}
                           language={activeLang}
                           colors={colors}
                           isLowMode={isLowMode}
                  />
                )
              } )
              }

              {processedParticipants.map( ( p: ProcessedParticipant, index: number ) => {
                return (
                  <SVGParticipant key={Math.random()}
                                  participant={p.participant}
                                  x={p.x}
                                  y={p.y}
                                  width={p.width}
                                  height={actualHeight}
                                  fontSize={PARTICIPANTS_LABEL_SIZE}
                                  index={index}
                                  canvasWidth={factorizedCanvasWidth}
                                  colors={colors}
                                  isLowMode={isLowMode}
                  />
                );
              } )}

              {processedCases.map( ( c ) => {

                if( openCases.includes( c.id ) ) {

                  let anies = c.actions.map( ( processedAction: ProcessedAction, index: number ) => {

                    return (
                      <SVGAction key={index}
                                 processedAction={processedAction}
                                 boxTypes={boxTypes}
                                 processedParticipants={processedParticipants}
                                 activeObjects={activeObjects}
                                 onShowInfoText={( title: string[] | undefined, content: string | undefined ) => {
                                   setInfoDialogContent( {
                                     title: title ? title : [""],
                                     content: content ? content : ""
                                   } )
                                 }}
                                 onClick={() => handleObjectClick( c, processedAction.action, false )}
                                 onPolicyClick={( erasurePolicy: string | undefined, storagePolicy: string | undefined,
                                   x: number, y: number ) => {
                                   setPolicy( {
                                     erasurePolicy: erasurePolicy ? erasurePolicy : "",
                                     storagePolicy: storagePolicy ? storagePolicy : "",
                                     x: x,
                                     y: y
                                   } )
                                 }}
                                 canvasWidth={factorizedCanvasWidth}
                                 infoIconSize={infoIconSize}
                                 showDetailedModel={showDetailedModel}
                                 fixedLabels={fixedLabels}
                                 language={activeLang}
                                 isLowMode={isLowMode}
                                 colors={colors}
                      />

                    );
                  } );

                  let dataSources = c.dataSources.map( ( processedDataSource: ProcessedDataSource, index: number ) => {

                    return (
                      <SVGDataSource key={index}
                                     processedDataSource={processedDataSource}
                                     boxTypes={boxTypes}
                                     activeObjects={activeObjects}
                                     onShowInfoText={( title: string[] | undefined, content: string | undefined ) => {
                                       setInfoDialogContent( {
                                         title: title ? title : [""],
                                         content: content ? content : ""
                                       } )
                                     }}
                                     canvasWidth={factorizedCanvasWidth}
                                     infoIconSize={infoIconSize}
                                     onClick={() =>
                                       handleObjectClick( c, processedDataSource.dataSource, false )
                                     }
                                     fixedLabels={fixedLabels}
                                     language={activeLang}
                                     isLowMode={isLowMode}
                                     colors={colors}
                      />
                    )
                      ;
                  } );
                  let dataPurposes = c.dataPurposes.map(
                    ( processedDataPurposes: ProcessedDataPurpose, index: number ) => {

                      return (
                        <SVGDataPurpose key={index}
                                        processedDataPurpose={processedDataPurposes}
                                        boxTypes={boxTypes}
                                        activeObjects={activeObjects}
                                        onShowInfoText={( title: string[] | undefined,
                                          content: string | undefined ) => {
                                          setInfoDialogContent( {
                                            title: title ? title : [""],
                                            content: content ? content : ""
                                          } )
                                        }}
                                        infoIconSize={infoIconSize}
                                        onClick={() => handleObjectClick( c, processedDataPurposes.dataPurpose, false )}
                                        canvasWidth={factorizedCanvasWidth}
                                        fixedLabels={fixedLabels}
                                        language={activeLang}
                                        isLowMode={isLowMode}
                                        colors={colors}
                        />
                      );
                    } );

                  let connections = c.connections.map( ( processedConnection: ProcessedConnection, index: number ) => {

                    return (
                      <SVGConnection key={index}
                                     processedConnection={processedConnection}
                                     activeObjects={activeObjects}
                                     canvasWidth={factorizedCanvasWidth}
                                     onEllipsisClick={( ellipsisDialogData: EllipsisDialogData ) => {
                                       setEllipsisDialogData( ellipsisDialogData );
                                     }}
                                     showDetailedModel={showDetailedModel}
                                     isLowMode={isLowMode}
                                     colors={colors}
                      />
                    );
                  } );
                  let caseActionIdentifier = processedParticipants.map( ( p: ProcessedParticipant, index: number ) => {
                    let size = getAbsoluteValue( width, CASE_HEADER_HEIGHT );
                    return (
                      <SVGCaseActionIdentifier key={index}
                                               x={p.x}
                                               y={c.y}
                                               width={p.width}
                                               height={getCaseHeaderHeight( [c.label], factorizedCanvasWidth )}
                                               size={size}
                                               hasAction={c.actions.filter(
                                                 a => a.action.participantID === p.participant.id ).length > 0}
                                               onClick={() => handleCaseClick( c.id )}
                                               colors={colors}
                                               isDetailedIcons={isDetailedIcons}
                                               participantCount={index}
                      />
                    );
                  } );

                  return (
                    <React.Fragment key={Math.random()}>
                      {connections}
                      {anies}
                      {dataSources}
                      {dataPurposes}
                      {caseActionIdentifier}
                    </React.Fragment>
                  );
                }
                else {
                  let caseActionIdentifier = processedParticipants.map( ( p: ProcessedParticipant, index: number ) => {
                    let size = getAbsoluteValue( width, CASE_HEADER_HEIGHT );

                    return (
                      <SVGCaseActionIdentifier key={index}
                                               x={p.x}
                                               y={c.y}
                                               width={p.width}
                                               height={getCaseHeaderHeight( [c.label], factorizedCanvasWidth )}
                                               size={size}
                                               hasAction={c.actions.filter(
                                                 a => a.action.participantID === p.participant.id ).length > 0}
                                               onClick={() => handleCaseClick( c.id )}
                                               colors={colors}
                                               isDetailedIcons={isDetailedIcons}
                                               participantCount={index}
                      />
                    );
                  } );

                  return (
                    <React.Fragment key={Math.random()}>
                      {caseActionIdentifier}
                    </React.Fragment>
                  );
                }
              } )}

              {!!policy && (
                <SVGPolicy erasurePolicy={policy?.erasurePolicy}
                           storagePolicy={policy?.storagePolicy}
                           x={policy.x}
                           y={policy.y}
                           width={processedParticipants.length > 0 ? processedParticipants[0].width : canvasWidth * 0.1}
                           onMouseLeave={() => {
                             setPolicy( null )
                           }}
                           canvasWidth={factorizedCanvasWidth}
                           fixedLabels={fixedLabels}
                           language={activeLang}
                           colors={colors}
                />
              )}

              {!!ellipsisDialogData && (
                <SVGEllipsisDialog ellipsisDialogData={ellipsisDialogData}
                                   onMouseLeave={() => {
                                     setEllipsisDialogData( null )
                                   }}
                                   canvasWidth={factorizedCanvasWidth}
                                   participantsWidth={processedParticipants[0].width}
                                   isLowMode={isLowMode}
                                   colors={colors}
                />
              )}

              <SVGLegend isOpen={legendShown}
                         width={canvasWidth}
                         height={height}
                         yScrollOffset={yScrollOffset}
                         connectionTypes={connectionTypes}
                         boxTypes={boxTypes}
                         toggle={toggleLegendShown}
                         canvasWidth={canvasWidth}
                         factorizedCanvasWidth={factorizedCanvasWidth}
                         sourceInformation={sourceInformation}
                         revisionHistory={revisionHistory}
                         onShowInfoText={( title: string[] | undefined, content: string | undefined ) => {
                           setInfoDialogContent( {
                             title: title ? title : [""],
                             content: content ? content : ""
                           } )
                         }}
                         fixedLabels={fixedLabels}
                         language={activeLang}
                         colors={colors}
                         isLowMode={isLowMode}
                         onLegendHeight={( lHeight: number ) => {
                         }}
                         onCreditsClick={() => {
                           setIsCreditsDialog( true );
                           setIsInfoDialogBlurred( true );
                         }}
              />
            </svg>
          </div>


        </div>

        {!!infoDialogContent && (
          <Dialog
            html={infoDialogContent.content}
            title={infoDialogContent.title}
            onClose={() => setInfoDialogContent( null )}
            blur={isGlossarDialogBlurred}
            canvasHeight={actualHeight}
            canvasWidth={canvasWidth}
            canvasX={canvasX}
            canvasY={canvasY}
            isDialogFullsize={isDialogFullsize}
          />
        )}

        {!!glossarInfoContent && (
          <GlossarDialog html={glossarInfoContent.content}
                         title={glossarInfoContent.title}
                         onClose={() => setGlossarInfoContent( null )}
                         canvasHeight={actualHeight}
                         canvasWidth={canvasWidth}
                         canvasX={canvasX}
                         canvasY={canvasY}
                         isDialogFullsize={isDialogFullsize}
          />
        )}

        {isCreditsDialog && (
          <CreditsDialog onClose={() => {
            setIsCreditsDialog( false );
            setIsInfoDialogBlurred( false );
          }}
                         canvasHeight={actualHeight}
                         canvasWidth={canvasWidth}
                         canvasX={canvasX}
                         canvasY={canvasY}
                         isDialogFullsize={isDialogFullsize}
                         onLegalNoticeClick={() => {
                           setIsLegalNoticeDialog( true )
                         }}
                         fixedLabels={fixedLabels}
                         language={activeLang}
          />
        )}

        {isLegalNoticeDialog && (
          <LegalNoticeDialog onClose={() => {
            setIsLegalNoticeDialog( false );
          }}
                             canvasHeight={actualHeight}
                             canvasWidth={canvasWidth}
                             canvasX={canvasX}
                             canvasY={canvasY}
                             isDialogFullsize={isDialogFullsize}
                             language={activeLang}
          />
        )}

        {!isBrowserCompatible && !isBrowserCompabilityWarningClosed && (
          <BrowserCompatibilityWarning onClose={() => {
            setIsBrowserCompabilityWarningClosed( true )
          }}/>
        )}

      </div>
      {/*</div>*/}


    </div>
  );

};

export { Main };
