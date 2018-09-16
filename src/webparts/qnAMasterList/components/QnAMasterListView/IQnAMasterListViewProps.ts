import { QnAActionHandler } from '../QnAMasterContainer/QnAActionHandler'; 

export interface IQnAMasterListViewProps {
  
  masterListItems: any[];
  //numberOfItems: number;
  changeView: Function;
  actionHandler: QnAActionHandler;
}


export interface IQnAMasterListViewState {
  
}