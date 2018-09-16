import { IQnAMasterListService } from '../../services/IQnAMasterListService';
import { ViewType } from '../../helper/ViewType';

export interface IQnAMasterListContainerProps {
  //numberOfItems: number;
  masterListName: string;
  service: IQnAMasterListService;
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