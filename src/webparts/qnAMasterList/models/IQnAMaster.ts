import { TaxonomyPicker, IPickerTerms } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
export interface IQnAMaster {
    Id?: number;
    division: IPickerTerms;
    //DivisionId: number;
    divisionQnAListName: string;
    Editors: any[];
}

//export default IQnAMaster;