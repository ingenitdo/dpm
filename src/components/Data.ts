export type ObjectId = string;

export type BrowserCompatibility = {
  EDGE: number,
  FIREFOX: number,
  CHROME: number,
  OPERA: number,
  SAFARI: number
};

export type GlossarItem = {
  id: ObjectId;
  keywords: string[];
  title: string;
  content: string; //Rich-Text
}

export type RevisionHistory = {
  id: ObjectId;
  info?: string; //Rich-Text
}
export type SourceInformation = {
  id: ObjectId;
  info?: string; //Rich-Text
}

export type Participant = {
  id: ObjectId;
  label: string[];
}

export type Case = {
  id: ObjectId;
  label: string;
  dataSources: DataSource[];
  dataPurposes: DataPurpose[];
  actions: Action[];
  connections: Connection[];
  shortInfo?: string[]; //visible bubble
  infoTitle?: string; //Rich-Text
  info?: string; //Rich-Text
  permissions?: string; // Rich-Text
  isOpen: boolean;
}

export type DataSource = {
  id: ObjectId;
  label: string[];
  position: Position;
  shortInfo?: string[]; //visible bubble
  infoTitle?: string; //Rich-Text
  info?: string; //Rich-Text
  erasurePolicy?: string; //clock icon: ... 
  storagePolicy?: string; //storage icon: ...
  typeId?: string; //BoxType
}

export type Position = {
  start: number;
  end: number;
}

export type DataPurpose = {
  id: ObjectId;
  label: string[];
  position: Position;
  shortInfo?: string[]; //visible bubble
  infoTitle?: string; //Rich-Text
  info?: string; //Rich-Text
  erasurePolicy?: string; //clock icon: ... 
  storagePolicy?: string; //storage icon: ...
  typeId?: string; //BoxType
}

export type Action = {
  id: ObjectId;
  label: string[];
  participantID?: string;
  position: Position;
  shortInfo?: string[]; //visible bubble
  infoTitle?: string; //Rich-Text
  info?: string; //Rich-Text
  erasurePolicy?: string; //clock icon: ... 
  storagePolicy?: string; //storage icon: ...
  typeId?: string; //BoxType
}

export type Connection = {
  id: ObjectId;
  label: string;
  typeId?: string; //ConnectionType
  source: string; //DataSource | Action;
  destination: string; //DataPurpose | Action;
  position: Position;
}

export type ConnectionType = {
  id: ObjectId;
  color: string;
  textColor: string;
  colorInactive?: string;
  textColorInactive?: string;
  strokeDasharray?: string;
  legend?: boolean;
  legendOrder?: number;
  legendLabel?: string;
  default?: boolean;
}

export type BoxType = {
  id: ObjectId;
  color: string;
  textColor: string;
  colorInactive: string;
  textColorInactive: string;
  borderColor?: string;
  borderWidth?: number;
  borderStrokeDasharray?: string;
  legend?: boolean;
  legendOrder?: number;
  legendLabel?: string;
  sourceDefault?: boolean;
  purposeDefault?: boolean;
  actionDefault?: boolean;

  shortInfoBackground?: string;
  shortInfoActiveBackground?: string;
  infoIconBackground?: string;
  infoIconActiveBackground?: string;
  policyIconBackground?: string;
  policyIconActiveBackground?: string;
}

export type FixedLabels = {
  headerSource?: string;
  headerPurpose?: string;
  headerProcess?: string;
  detailedModel?: string;
  simpleModel?: string;
  legend?: string;
  policy?: string;
  durationOfStorage?: string;
  locationOfStorage?: string;
  permissions?: string;
  listOfSources?: string;
  revisionHistory?: string;
  info?: string;
  close?: string;
  credits?: string;
  legalNoticeLabel?: string;
  legalNotice?: string;
  toolDescription?: string;
  implementationBy?: string;
  sponsoredBy?: string;
  legalDisclaimer?: string;
}

export type Colors = {
  canvasBackground: string;

  headerSourceLabel:  string;
  headerSourceIcon: string;
  headerSourceBackground: string;
  headerSourceArrowBackground: string;

  headerProcessLabel:  string;
  headerProcessIcon: string;
  headerProcessBackground: string;
  headerProcessArrowLeftBackground: string;
  headerProcessArrowRightBackground: string;

  headerPurposeLabel:  string;
  headerPurposeIcon: string;
  headerPurposeBackground: string;
  headerPurposeArrowBackground: string;

  caseHeaderLabel: string;
  caseHeaderIcon: string;
  caseHeaderBackground: string;
  caseHeaderBackgroundGradient: string | null;
  caseBodyBackground: string;
  caseBorder: string;

  participantLabel: string;
  participantIcon: string;
  participantBorder: string;
  participantBackground: string;
  participantBackgroundGradient: string;

  caseActionIdentifierChecked: string;
  caseActionIdentifierUnchecked: string;

  legendTriggerLabel: string;
  legendTriggerBackground: string;
  legendTriggerBackgroundHover: string,

  modelModeLabel: string;
  modelModeBackground: string;

  textEllipsisBackground: string;
  textEllipsisLabel: string;

  policyBackground: string;
  policyIcon: string;
  policyLabel: string;

  glossarKeyword: string
}

export type Language = 'en' | 'de';

export interface Model {
  language: Language;
  title?: string;
  subtitle?: string;
  participants: Participant[];
  connectionTypes: ConnectionType[];
  boxTypes: BoxType[];
  cases: Case[];
  sourceInformation?: SourceInformation;
  revisionHistory?: RevisionHistory;
  glossar?: GlossarItem[];
  isDialogFullsize: boolean;
  isDetailedIcons: boolean;
  fixedLabels?: FixedLabels;
  colors: Colors;
}