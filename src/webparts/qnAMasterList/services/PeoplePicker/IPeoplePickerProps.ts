import { SharePointUserPersona } from '../../models/IPeoplePicker';

export interface IPeoplePickerProps {
    onChange?: (items: SharePointUserPersona[]) => void;
    selectedItems?: SharePointUserPersona[];
    placeholder?: string;
}
