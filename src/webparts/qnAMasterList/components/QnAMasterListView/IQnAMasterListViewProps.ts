import { QnAActionHandler } from '../QnAMasterContainer/QnAActionHandler'; 
import { IQnAMaster } from '../../models/IQnAMaster';

export interface IQnAMasterListViewProps {
  
  masterListItems: any[];
  //numberOfItems: number;
  changeView: Function;
  actionHandler: QnAActionHandler;
  masterListName: string;
  onEditItem: Function;
}


export interface IQnAMasterListViewState {
  masterItems: any[];
  showEditForm: boolean;
  editItem: any;
}