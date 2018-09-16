import * as React from 'react';
import styles from '../QnAMasterList.module.scss';
import { IQnAMasterListFormProps , IQnAMasterListFormState} from './IQnAMasterListFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, Spinner, TextField } from 'office-ui-fabric-react/lib/';
import { IQnAMaster } from '../../models/IQnAMaster';
import  IItemResult  from '../../models/IItemResult';
import { IPersonaProps, Persona } from 'office-ui-fabric-react/lib/Persona';
import {
  CompactPeoplePicker,
  IBasePickerSuggestionsProps,
  IBasePicker,
  ListPeoplePicker,
  NormalPeoplePicker,
  ValidationState
} from 'office-ui-fabric-react/lib/Pickers';
import { IPersonaWithMenu } from 'office-ui-fabric-react/lib/components/pickers/PeoplePicker/PeoplePickerItems/PeoplePickerItem.types';

export class QnAMasterListForm extends React.Component<IQnAMasterListFormProps, IQnAMasterListFormState> {
  private isEdit: boolean;
    constructor(props: IQnAMasterListFormProps) {
        super(props);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.onSaveCallback = this.onSaveCallback.bind(this);
        //this._updateFormDataState = this._updateFormDataState.bind(this);
        //this.validateFormData = this.validateFormData.bind(this);
        // if (!this.props.editItem) {
        //     this.isEdit = false;
        //     this.state = {
        //         Subject: "",
        //         StartDate: moment().format("YYYY-MM-DD"),
        //         DueDate: moment().format("YYYY-MM-DD"),
        //         Errors: [],
        //         isLoading: false,
        //     };
        // } else if (!this.props.editItem.DueDateTime || !this.props.editItem.StartDateTime) {
        //     this.isEdit = true;
        //     this.state = {
        //         Subject: this.props.editItem.Subject,
        //         StartDate: moment().format("YYYY-MM-DD"),
        //         DueDate: moment().format("YYYY-MM-DD"),
        //         Errors: [],
        //         isLoading: false
        //     };
        // } else {
        //     this.isEdit = true;
        //     this.state = {
        //         Subject: this.props.editItem.Subject,
        //         StartDate: moment(this.props.editItem.StartDateTime.DateTime).format("YYYY-MM-DD"),
        //         DueDate: moment(this.props.editItem.DueDateTime.DateTime).format("YYYY-MM-DD"),
        //         Errors: [],
        //         isLoading: false

        //     };
        // }
    }

    private setLoading(status: boolean): void {
      this.setState({ isLoading: status });
  }

  // private _updateFormDataState(prop: any, evt) {
  //     this.setState({
  //         [prop]: evt.target.value
  //     });
  // }

//   private onSaveCallback(result: IItemResult): void {
//     if (result.status === false) {
//         this.setState({ Errors: [result.message] });
//     }
//     this.setLoading(false);
// }

  public render(): React.ReactElement<IQnAMasterListFormProps> {
    return (
      <div className={ styles.qnAMasterList }>
        <div className={ styles.container }>
          <div className={styles.qnaMasterForm}>
                <Dropdown
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
              />
              <TextField required={true} 
                    placeholder="I am required." 
                    id="divListName"
                    //value={this.state.divisionListName}
              />
              <PrimaryButton text="Sumbit" onClick={this.onSaveClick} />
            
            </div>
        </div>
      </div>
    );
  }


  private validateFormData(): boolean {
    let isPassed: boolean = true;
    const errorList: string[] = [];
    const msg: string = "";

    if (this.state.division === '') {
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
    if (this.validateFormData() === false) {
        return;
    }
    this.setLoading(true);
    const formData: IQnAMaster = {
      Id: '',
      Division: '',
      DivisionId: 0,
      DivisionListName: '',
      Editor: []
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

}
