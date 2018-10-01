import * as React from 'react';
import styles from '../QnAMasterList.module.scss';
import { IQnAMasterListFormProps , IQnAMasterListFormState} from './IQnAMasterListFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, Spinner, TextField } from 'office-ui-fabric-react/lib/';
import { IQnAMaster } from '../../models/IQnAMaster';
import  IItemResult  from '../../models/IItemResult';
import { TaxonomyPicker, IPickerTerms } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import { PeoplePicker } from '../../services/PeoplePicker/PeoplePicker';
import { Label } from 'office-ui-fabric-react';


export class QnAMasterListForm extends React.Component<IQnAMasterListFormProps, IQnAMasterListFormState> {
  private isEdit: boolean;
    constructor(props: IQnAMasterListFormProps) {
        super(props);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.onSaveCallback = this.onSaveCallback.bind(this);
        //this.updateFormDataState = this.updateFormDataState.bind(this);
        this.validateFormData = this.validateFormData.bind(this);
        this.onTaxPickerChange = this.onTaxPickerChange.bind(this);
        if (!this.props.editItem) {
            this.isEdit = false;
            this.state = {
              division: [],
              divisionQnAListName: "",
              Editors: [],
              EditorsId: [],
              Errors: [],
              isLoading: false,
            };
        } else {
            this.isEdit = true;
            this.state = {
                division: this.props.editItem.division,
                divisionQnAListName: this.props.editItem.divisionQnAListName,
                Editors: this.props.editItem.Editors,
                Errors: [],
                EditorsId: [],
                isLoading: false

            };
        }
    }

    private setLoading(status: boolean): void {
      this.setState({ isLoading: status });
  }

  private validateFormData(): boolean {
    let isPassed: boolean = true;
    const errorList: string[] = [];
    const msg: string = "";

    if (this.state.division.length === 0) {
        isPassed = false;
        errorList.push('Division is required');
    }
    if (this.state.divisionQnAListName === '') {
      isPassed = false;
      errorList.push('Division QnA List Name is required');
  }

    if (isPassed === false) {
        this.setState({ Errors: errorList });
    }
    return isPassed;
}

  private async onSaveClick(): Promise<void> {
    console.log("on save click");
    console.log("state", this.state);
    if (this.validateFormData() === false) {
        return;
    }
    this.setLoading(true);
    const formData: IQnAMaster = {
      Id: '',
      division: this.state.division,
      divisionQnAListName: this.state.divisionQnAListName,
      Editors: this.state.Editors //pass the id of the editors only
    };

    if (!this.isEdit) {
      console.log("form is new"); 
        //getAllDivisionList; check if the division list name is unique
        //gettAllSharePointGroups; check if the group name is unique
        //createDiviionList
          //createListFields
          //addFieldsToView
        //createSharePointGroup
          //add users to group
          //break list permission
          //addGroup to list


        this.props.actionHandler.saveMasterItemtoSPList(formData, this.onSaveCallback).then();
       
    } else {
        formData.Id = this.props.editItem.Id;
      

    }
  }

  private onSaveCallback(result: IItemResult): void {
    if (result.status === false) {
        this.setState({ Errors: [result.message] });
    }
    this.setLoading(false);
  }

  private updateEditorsState(prop: any, event) {
    console.log("updateformdatastatefabric!", event);
//GET THE ID OF THE USER USING EVENT EMAIL THEN SET EDITORSID STATE WITH THE iD OF THE USER
    this.setState({
      [prop]: event
    });
  }

  private updateFormDataState(someting, event) {
    // console.log("list name", someting);
    this.setState({
      [someting]: event
    });
}
  private onTaxPickerChange(terms : IPickerTerms) {
    console.log("Terms", terms);
    this.setState({
      division: terms
    });
  }

  public render(): React.ReactElement<IQnAMasterListFormProps> {
    return (
      <div className={ styles.qnAMasterList }>
        <div className={ styles.container }>
      
              <TaxonomyPicker
                allowMultipleSelections={false}
                termsetNameOrID="9a72c139-d649-4342-970f-a53fe0ef72e3"
                panelTitle="Select Term"
                label="Division Picker"
                context={this.props.context}
                onChange={this.onTaxPickerChange}
                //onChange={(event) => this.updateFormDataState('division', event)}
                isTermSetSelectable={false}
              />
              
              <TextField required={true} 
                    placeholder="I am required." 
                    id="divListName"
                    label="Division QnA List Name"
                    value={this.state.divisionQnAListName}
                    onChanged={(event) => this.updateFormDataState("divisionQnAListName",event)}
              />
              <Label>Editors</Label>
              { <PeoplePicker 
                 placeholder='Enter email addresses here'
                 selectedItems={this.state.Editors}
                 onChange={(value) => this.updateEditorsState('Editors', value)}
              /> }

              <PrimaryButton text="Sumbit" onClick={this.onSaveClick} />
            
        
        </div>
      </div>
    );
  }


  

}
