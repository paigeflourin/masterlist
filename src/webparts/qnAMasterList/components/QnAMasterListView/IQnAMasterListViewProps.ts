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
  masterItems: IQnAMaster[];
  showEditForm: boolean;
  editItem: any
}