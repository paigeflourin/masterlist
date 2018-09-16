import { SharePointUserPersona } from '../../models/IPeoplePicker';
import { QnAActionHandler } from '../QnAMasterContainer/QnAActionHandler'; 
import { IQnAMaster } from '../../models/IQnAMaster';

export interface IQnAMasterListFormProps {
  //masterListName: string;
  //show: boolean;
  //onClose: () => void;
  onChange?: (items: SharePointUserPersona[]) => void;
  actionHandler: QnAActionHandler;
  editItem?: IQnAMaster;
}


export interface IQnAMasterListFormState {
  division: string,
  divisionQnAListName: string;
  Editors: any[],
  Errors: string[];
  isLoading: boolean;

}