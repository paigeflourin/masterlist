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
    constructor(props: IQnAMasterListFormProps, state: IQnAMasterListFormState) {
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
              divisionName: "",
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
                divisionName: this.props.editItem.division[0].name,
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

    let userwithIds = await this.props.actionHandler.getUserIds(this.state.Editors);
    let ids = userwithIds.map(u => u.Id);
    console.log(ids, "IDS");
    const formData: IQnAMaster = {
      Id: '',
      division: this.state.division,
      divisionQnAListName: this.state.divisionQnAListName,
      Editors: ids
    };

    if (!this.isEdit) {
      console.log("form is new"); 
  
        let siteLists = await this.props.actionHandler.getAllDivisionLists(); 
        let spgroups = await this.props.actionHandler.getAllSharePointGroups();
        
        let divisionGroupName = this.state.divisionName + " Editors";
        let divisionExists = siteLists.find(l => l.Title == this.state.divisionQnAListName);
        let groupExists = spgroups.find(g => g.LoginName == divisionGroupName);
        
        console.log(divisionExists, " and group ", groupExists);

        if((divisionExists === undefined) && (groupExists === undefined )){

          let faqAdminGroup = spgroups.filter(g => g.Title == "FAQ Administrators");
          let fullControlPermission = "1073741829"; //full controll = 1073741829
          let contributePermission = "1073741827";
          console.log(faqAdminGroup);


          //test()
          //.then(()=> {
          //    a.then()
          //})
          //. then(() => {
          //  b.then()
          //})
          //.then(() => {....}

          this.props.actionHandler.createDivisionList(this.state.divisionQnAListName).then(listData => {
              console.log(listData, "in list creation");
              //createListFields 
              this.props.actionHandler.createListFields(listData.data.Title).then(res=>{
                  //addFieldsToView (
                  console.log(res, "after list field creation");
                  this.props.actionHandler.addFieldsToView(listData.data.Title).then(r => {
                    this.props.actionHandler.createSharePointGroup(this.state.divisionName).then(groupInfo => {
                      console.log(groupInfo, "in group creation");
                      //add users to group 
                      this.props.actionHandler.addUsersToSPGroup(groupInfo.data.Title,userwithIds).then(afterAdd => {
                        //break list permission
                        this.props.actionHandler.breakListPermission(this.state.divisionQnAListName).then(afterBreak => {
                          //addGroup to list
                          this.props.actionHandler.addGroupToList(this.state.divisionQnAListName,faqAdminGroup[0].Id,fullControlPermission).then(admin => {
                            this.props.actionHandler.addGroupToList(this.state.divisionQnAListName,groupInfo.data.Id,contributePermission).then(last => {

                              this.props.actionHandler.saveMasterItemtoSPList(this.props.masterListName,formData).then(res => {
                                //if success pass success else pass fail to the container
                                console.log(res, "after saving!");
                                //this.props.onSubmission(res);
                              });
                            });
                          });
                        });
                      });  
                    });
                  });
              });
          });
          
          
          

          // Promise.all([createDivisionList, createGroup]).then(res => {
          //     console.log(res, "in promise");
          // })
       
        
        } else if (divisionExists !== undefined){
          //toastr.error("Division is not unique");
          console.log("division not unique");
        } else if(groupExists !== undefined) {
          //toastr.error("Group is not unique");
          console.log("group not unique");
        }
    } else {
      console.log("EDIT");
        formData.Id = this.props.editItem.Id;
      

    }
  }

  private onSaveCallback(result: IItemResult): void {
    if (result.status === false) {
        this.setState({ Errors: [result.message] });
    }
    this.setLoading(false);
  }

  private updateEditorsState(event) {
    console.log("updateformdatastatefabric!", event);
  
    this.setState({
      "Editors": event
    });
  }

  private updateDivisionListName(event) {
    this.setState({
      divisionQnAListName: event
    });
}
  private onTaxPickerChange(terms : IPickerTerms) {
    console.log("Terms", terms);
    this.setState({
      division: terms,
      divisionName: terms[0].name
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
                    onChanged={(event) => this.updateDivisionListName(event)}
              />
              <Label>Editors</Label>
              { <PeoplePicker 
                 placeholder='Enter email addresses here'
                 selectedItems={this.state.Editors}
                 onChange={(value) => this.updateEditorsState(value)}
              /> }

              <PrimaryButton text="Sumbit" onClick={this.onSaveClick} />
            
        
        </div>
      </div>
    );
  }


  

}
