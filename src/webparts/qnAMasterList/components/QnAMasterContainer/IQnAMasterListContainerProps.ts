import { IQnAMasterListService } from '../../services/IQnAMasterListService';
import { ViewType } from '../../helper/ViewType';
import { ContextInfo } from '@pnp/sp';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IQnAMasterListContainerProps {
  //numberOfItems: number;
  masterListName: string;
  service: IQnAMasterListService;
  context: WebPartContext;
  isConfigured: boolean;
}


export interface IQnAMasterListContainerState {
  isDataLoaded: boolean;
  view: ViewType;
  error: string;
  isOpen: boolean;
  masterListName: string;
  masterListItems: any[];
  showForm: boolean;
}