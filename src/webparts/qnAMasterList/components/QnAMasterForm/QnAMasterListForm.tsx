import * as React from 'react';
import styles from './QnAMasterListForm.module.scss';
import { IQnAMasterListFormProps , IQnAMasterListFormState} from './IQnAMasterListFormProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, Spinner, TextField } from 'office-ui-fabric-react/lib/';
import { IQnAMaster } from '../../models/IQnAMaster';
import  IItemResult  from '../../models/IItemResult';
import { TaxonomyPicker, IPickerTerms } from "@pnp/spfx-controls-react/lib/TaxonomyPicker";
import { PeoplePicker } from '../../services/PeoplePicker/PeoplePicker';
import { Label } from 'office-ui-fabric-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

export class QnAMasterListForm extends React.Component<IQnAMasterListFormProps, IQnAMasterListFormState> {
  private isEdit: boolean;
    constructor(props: IQnAMasterListFormProps, state: IQnAMasterListFormState) {
        super(props);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.setLoading = this.setLoading.bind(this);
        this.validateFormData = this.validateFormData.bind(this);
        this.onTaxPickerChange = this.onTaxPickerChange.bind(this);
        if (this.props.editItem.length == 0) {
            this.isEdit = false;
            this.state = {
              Id: "",
              division: [],
              divisionName: "",
              divisionQnAListName: "",
              Editors: [],
              //EditorsId: [],
              Errors: [],
              isLoading: false,
            };
        } else {
            this.isEdit = true;
            this.state = {
                Id: this.props.editItem.Id, 
                division: this.props.editItem.Division,
                divisionName: this.props.editItem.Division,
                divisionQnAListName: this.props.editItem.QnAListName,
                Editors: this.props.editItem.Editors,
                Errors: [],
                //EditorsId: this.props.editItem.Editors.map(u => u.id),
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
    if(this.validateFormData() === false) {
        return;
    }
    this.setLoading(true);
  
    try{
      if (!this.isEdit) {
        console.log("form is new"); 
        let extractuser = this.state.Editors.map(us => us.User);
        let userwithIds = await this.props.actionHandler.getUserIds(this.state.Editors);
        let ids = userwithIds.map(u => u.Id);

        const formData: IQnAMaster = {
          division: this.state.division,
          divisionQnAListName: this.state.divisionQnAListName,
          Editors: ids
        };

          let siteLists = await this.props.actionHandler.getAllDivisionLists(); 
          let spgroups = await this.props.actionHandler.getAllSharePointGroups();
          
          let divisionGroupName = this.state.divisionName + " Editors";
          let divisionExists = siteLists.find(l => l.Title == this.state.divisionQnAListName);
          let groupExists = spgroups.find(g => g.LoginName == divisionGroupName);
          
          if((divisionExists === undefined) && (groupExists === undefined )){

            let faqAdminGroup = spgroups.filter(g => g.Title == "FAQ Administrators");
            let faqAdminGrpid;
            let fullControlPermission = "1073741829"; //full controll = 1073741829
            let contributePermission = "1073741827";
            console.log(faqAdminGroup);
            if(faqAdminGroup.length == 0){
              //create admin group
              let res = await this.props.actionHandler.createSharePointGroup("FAQ Administrators");
              faqAdminGrpid = res.data.Id;
            } else {
              faqAdminGrpid = spgroups.filter(g => g.Title == "FAQ Administrators")[0].Id;
            }


            (async() => {
              const listData =    await this.props.actionHandler.createDivisionList(this.state.divisionQnAListName);
              console.log(listData, "in list creation");
              const res =         await this.props.actionHandler.createListFields(listData.data.Title);
              console.log(res, "after list field creation");
              const r =           await this.props.actionHandler.addFieldsToView(listData.data.Title);
              const groupInfo =   await this.props.actionHandler.createSharePointGroup(divisionGroupName);
              console.log(groupInfo, "in group creation");
              const afterAdd =    await this.props.actionHandler.addUsersToSPGroup(groupInfo.data.Title,userwithIds);
              console.log(afterAdd, "users added to group");
              const afterBreak =  await this.props.actionHandler.breakListPermission(this.state.divisionQnAListName);
              const admin =       await this.props.actionHandler.addGroupToList(this.state.divisionQnAListName,faqAdminGrpid,fullControlPermission);
              const last =        await this.props.actionHandler.addGroupToList(this.state.divisionQnAListName,groupInfo.data.Id,contributePermission);
              const res2 =        await this.props.actionHandler.saveMasterItemtoSPList(this.props.masterListName,formData);
              console.log(res2, "after saving!");
              toast.success("Successfully saved Item");
              this.props.onSubmission();
            })().catch(err=> {
              console.log(err);
              toast.error("error in saving master list item");
              this.setLoading(false);
              this.props.onSubmission();
            });
          
          } else if (divisionExists !== undefined){
            toast.error("Division is not unique");
            this.setLoading(false);
          } else if(groupExists !== undefined) {
            toast.error("Group is not unique");
            this.setLoading(false);
          }
      } else {
        console.log("EDIT", this.state.Editors);
        //check array of editors if it has id property 
        //if there is then add to a new array of ids
        //if none get userIds then append to the created array of ids
        let existuserids = [];
        let newusers =[];
        let newuserids = [];

        //create a new array with users add loginname to existing items
        let updatedEditors = this.state.Editors.filter( u => {
          if (u.id) {
             u["loginName"] = "i:0#.f|membership|" + u.email;
             console.log(u);
             return u;
          }
        });
        let newleyEnteredUsers = this.state.Editors.filter( u => {
          if (!u.id){
            return u;
          }
        });
        
        let NewEds = await this.props.actionHandler.getUserIdsEdit(updatedEditors);
        let NewAddedEds = await this.props.actionHandler.getUserIds(newleyEnteredUsers);
        let NewUpdatedEds = [...NewEds, ...NewAddedEds];
        console.log(NewUpdatedEds, "UPDATED EDITORS");


        for (let ed of this.state.Editors) {
          if(ed.id){
            existuserids.push(parseInt(ed.id));
          } else {
            newusers.push(ed);
            let userwithIds = await this.props.actionHandler.getUserIds(newusers);
            newuserids = userwithIds.map(u => u.Id);
            console.log(newuserids, "IDS");
          }
       }
        let updatedEditorIds = [...existuserids, ...newuserids];
        console.log(updatedEditorIds);
        
        let divisionGroupName = this.state.divisionName + " Editors";
        const formData: IQnAMaster = {
          Id: this.state.Id,
          division: this.state.division,
          divisionQnAListName: this.state.divisionQnAListName,
          Editors: updatedEditorIds
        };

        
        (async() => {
          const groupUsers =    await this.props.actionHandler.getGroupUsers(divisionGroupName);
          console.log(groupUsers, "in getgroupusers");
          const res2 =        await this.props.actionHandler.removeusersFromGroup(divisionGroupName,groupUsers);
          console.log(res2, "after user removal!");
          const addUsers =        await this.props.actionHandler.addUsersToSPGroup(divisionGroupName,NewUpdatedEds);
          console.log(addUsers, "after add users!");
          const saveItem =        await this.props.actionHandler.updateMasterItemstoSPList(this.props.masterListName,formData.Id,formData.Editors);
          toast.success("Successfully saved Item");
          this.props.onSubmission();
          this.setLoading(false);
        })().catch(err=> {
          console.log(err);
          toast.error("error in saving master list item");
          this.setLoading(false);
          this.props.onSubmission();
        });

      }
    } catch (err) {
      toast.error("Something went wrong");
      console.log(err);
      this.setLoading(false);
    }
   
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
    if(terms.length !== 0){
      this.setState({
        division: terms,
        divisionName: terms[0].name
      });
    }
  }

  public render(): React.ReactElement<IQnAMasterListFormProps> {



    if(this.isEdit){
      return (
        <div className={ styles.qnAMasterList }>
          <div className={ styles.container }>
         
            {this.state.isLoading && <LoadingSpinner />}
            
            <TextField required={true} 
                      id="division"
                      label="Division"
                      disabled={true}
                      value={this.state.divisionName}
                />
            <TextField required={true} 
                  id="divListName"
                  label="Division QnA List Name"
                  disabled={true}
                  value={this.state.divisionQnAListName}
            />
             <Label>Editors</Label>
                { <PeoplePicker 
                   placeholder='Enter email addresses here'
                   selectedItems={this.state.Editors}
                   onChange={(value) => this.updateEditorsState(value)}
                /> }
              <div className={styles.controlBtns}> 
                <PrimaryButton text="Submit" onClick={this.onSaveClick} />
                <PrimaryButton text="Cancel" onClick={() => this.props.onCancel(null)} />
              </div>
          </div>
        </div>
      );

    } else {
      return (  
        <div className={ styles.qnAMasterList }>
          <div className={ styles.container }>
            
            {this.state.isLoading && <LoadingSpinner />}
            
                <TaxonomyPicker
                  allowMultipleSelections={false}
                  //termsetNameOrID="9a72c139-d649-4342-970f-a53fe0ef72e3"
                  //termsetNameOrID="Department"
                  termsetNameOrID="6c285b4d-49f9-4666-981d-2b7be6872978"
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
  
                <div className={styles.controlBtns}> 
                  <PrimaryButton text="Submit" onClick={this.onSaveClick} />
                  <PrimaryButton text="Cancel" onClick={() => this.props.onCancel(null)} />
                </div>
                
          </div>
        </div>
      );
    }


   
  }


  

}
