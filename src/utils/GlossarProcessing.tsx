import { Case, GlossarItem } from "../components/Data";

export const processGlossar = ( glossar: GlossarItem[], cases: Case[], keywordColor: string ) => {

  const replaceKeyword = ( s: String, g: GlossarItem ) => {
    if( s ) {
      if( g.keywords ) {
        let newS = s;
        g.keywords.sort(function(a,b) {
          return b.length - a.length;
        });
        var i;
        for (i=0;i<g.keywords.length;i++) {
          newS = newS.replace( new RegExp(g.keywords[i],'g'), "###"+i+"###" );
        }
        for (i=0;i<g.keywords.length;i++) {
          newS = newS.replace( new RegExp("###"+i+"###",'g'), 
          "<span id=\"" + g.id + "\" class=\"keyword-trigger\" style=\"color: " + keywordColor + "; cursor: pointer\">" + g.keywords[i] + "</span>" );
        }
        s = newS ? newS : s;
      }
    }
    return s;
  };

  const replaceKeywords = ( item: any, g: GlossarItem ) => {
    if( item.info ) {
      item.info = replaceKeyword( item.info, g);
    }
    if( item.infoTitle ) {
      item.infoTitle = replaceKeyword( item.infoTitle, g);
    } else {
      if( item.label && item.info) {
        if (Array.isArray(item.label)) {
          item.infoTitle = replaceKeyword( item.label.toString(), g );
        } else {
          item.infoTitle = replaceKeyword( item.label, g);
        }                                        
      }
    }
    if( item.permissions ) {
      item.permissions = replaceKeyword( item.permissions, g);
    }
  };
  
  glossar.map( ( g ) => {
    return cases.map( c => {
      replaceKeywords( c, g );
      c.dataSources.map( ds => replaceKeywords( ds, g ) );
      c.dataPurposes.map( ds => replaceKeywords( ds, g ) );
      c.actions.map( ds => replaceKeywords( ds, g ) );
      return null;
    } )
  } );

  return cases;
};