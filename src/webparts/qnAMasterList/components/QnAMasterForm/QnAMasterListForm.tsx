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
      Editors: this.state.Editors
    };

    if (!this.isEdit) {
        this.props.actionHandler.saveMasterItemtoSPList(formData, this.onSaveCallback);
    } else {
        formData.Id = this.props.editItem.Id;
        //this.props.actionHandler.updateMyTasks(formData, this.onSaveCallback);
    }
  }

  private onSaveCallback(result: IItemResult): void {
    if (result.status === false) {
        this.setState({ Errors: [result.message] });
    }
    this.setLoading(false);
  }

  private updateFormDataStateFabric(prop: any, event) {
    console.log("updateformdatastate!", event);
    this.setState({
      [prop]: event
    });
  }

  private updateFormDataState(prop: any, event) {
    this.setState({
        [prop]: event.target.value
    });
}
  private onTaxPickerChange(terms : IPickerTerms) {
    console.log("Terms", terms);
    this.setState({
      division: terms
    })
  }

  public render(): React.ReactElement<IQnAMasterListFormProps> {
    return (
      <div className={ styles.qnAMasterList }>
        <div className={ styles.container }>
         
                {/* <Dropdown
                  placeHolder="Select an Option"
                  label="Division"
                  id="qnaDivion"
                  options={[
                    { key: 'Admission', text: 'Admission', title: 'I am option a.' },
                    { key: 'CIT', text: 'CIT' },
                    { key: 'RegistrarsOffice', text: 'Registrars Office' },
                    { key: 'Finance', text: 'Finance' },
                  ]}
                // onFocus={this._log('onFocus called')}
                  //onBlur={this._log('onBlur called')}
                  //value={this.state.division}
              /> */}


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
                    //value={this.state.divisionListName}
                    onChange={(event) => this.updateFormDataState('divisionQnAListName', event)}
              />
              <Label>Editors</Label>
              <PeoplePicker 
                 placeholder='Enter email addresses here'
                 selectedItems={this.state.Editors}
                 onChange={(value) => this.updateFormDataStateFabric('Editors', value)}
              />

              <PrimaryButton text="Sumbit" onClick={this.onSaveClick} />
            
        
        </div>
      </div>
    );
  }


  

}
