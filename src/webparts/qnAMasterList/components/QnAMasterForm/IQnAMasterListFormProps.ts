import { SharePointUserPersona } from '../../models/IPeoplePicker';
import { QnAActionHandler } from '../QnAMasterContainer/QnAActionHandler'; 
import { IQnAMaster } from '../../models/IQnAMaster';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { TaxonomyPicker, IPickerTerms } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
export interface IQnAMasterListFormProps {
  onChange?: (items: SharePointUserPersona[]) => void;
  actionHandler: QnAActionHandler;
  editItem?: IQnAMaster;
  context: WebPartContext;
  onClick?: void;
  masterListName: string;
  onSubmission: Function;
}


export interface IQnAMasterListFormState {
  //termKey?: string | number;
  division: IPickerTerms;
  divisionName: string;
  divisionQnAListName: string;
  Editors: SharePointUserPersona[];
  Errors: string[];
  isLoading: boolean;
  EditorsId: any[];

}