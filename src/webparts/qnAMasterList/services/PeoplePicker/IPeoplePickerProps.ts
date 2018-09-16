import { SharePointUserPersona } from '../../models/IPeoplePicker';
import { IPersonaProps, Persona } from 'office-ui-fabric-react/lib/Persona';

export interface IPeoplePickerProps {
    onChange?: (items: SharePointUserPersona[]) => void;
    selectedItems?: SharePointUserPersona[];
    placeholder?: string;
}


export interface IPeoplePickerState {
    currentPicker?: number | string;
    delayResults?: boolean;
    peopleList: IPersonaProps[];
    mostRecentlyUsed: IPersonaProps[];
    currentSelectedItems?: IPersonaProps[];
  }