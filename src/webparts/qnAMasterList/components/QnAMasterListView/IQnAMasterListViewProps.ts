import { QnAActionHandler } from '../QnAMasterContainer/QnAActionHandler'; 
import { IQnAMaster } from '../../models/IQnAMaster';

export interface IQnAMasterListViewProps {
  
  masterListItems: any[];
  //numberOfItems: number;
  changeView: Function;
  actionHandler: QnAActionHandler;
}


export interface IQnAMasterListViewState {
  masterItems: IQnAMaster[];
}