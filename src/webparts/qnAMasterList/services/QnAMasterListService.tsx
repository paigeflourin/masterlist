import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { IQnAMasterListService } from './IQnAMasterListService';
import { IQnAMaster } from '../models/IQnAMaster';
import { sp, RenderListDataOptions } from '@pnp/sp';

export class QnAMasterListService  implements IQnAMasterListService {
    private listName: string;
    private context: WebPartContext;
    public webPartContext: WebPartContext;

    constructor(listName: string, webPartContext: WebPartContext) {
        //super(webPartContext);
        this.listName = listName;
        this.context = webPartContext;
    }

    public getAllMasterListItems(masterListName: string): Promise<any>{
        console.log("get master items");
        // return sp.web.lists.getByTitle(masterListName).items.select("Title", "ID", "Division", "QnAListName", "Editors/Id", "Editors/EMail",).
        // expand("Editors").get().then((response) => {
        //       console.log(response);
        //       return response;
        // });

        return sp.web.lists.getByTitle(masterListName).renderListDataAsStream({
            RenderOptions: RenderListDataOptions.ListData,
            ViewXml :  `<View>
                            <Query> 
                                <ViewFields>
                                    <FieldRef Name="Division"/>
                                    <FieldRef Name="QnAListName"/>
                                    <FieldRef Name="Editors"/>
                                </ViewFields>   
                            
                            </Query>   
                        </View>`
        }).then((userDivision) => {
            console.log(userDivision);
            return userDivision.Row;
        });
    }

    public saveMasterItemtoSPList(masterListName: string, itemDetails: IQnAMaster): Promise<any>{
        return sp.web.lists.getByTitle(masterListName).items.add({
            Title: "",
            Division: itemDetails.division,
            QnAListName: itemDetails.divisionQnAListName,
            EditorsId: {
                results: itemDetails.Editors
            }
        }).then(i =>{
            return i;
        }).catch(err => {
            return err;
        });
    }

    public getUserIds(userInfo: any[]): Promise<any> {
        //let promises = [];
        let resp;
        let promises = userInfo.map( u => {
            console.log(u.user.Description);
            return sp.web.siteUsers.getByEmail(u.user.Description).get().then(); //res => {
              //  return res.Id;   
            //});
        });

        return Promise.all(promises)
        .then(res => {
            console.log(res);
           return  res;
        })
        .catch(err => { 
            return err
        });

        //return resp;
    }

    public getAllDivisionLists(): Promise<any>{
        return sp.web.lists.select("Title").get().then(lists => {
            console.log(lists);
            return lists;
        });
    }

    public getAllSharePointGroups(): Promise<any> {
        return sp.web.siteGroups.get().then(groups => {
            console.log(groups);
            return groups;
        });
    }

    public createDivisionList(qnaListName: string): Promise<any>{
        return sp.web.lists.add(
             qnaListName,
             "",
             100,
             true
        ).then(res => {
            //console.log("list created", res);
            return res;
        }).catch(error => {
            return error;
        });
    }

    public createListFields(listname: string): Promise<any>{
        const list = sp.web.lists.getByTitle(listname);
        // add all the fields in a single batch call
         const batch = sp.web.createBatch();
 
        let fieldsToCreate = [
            {"type": "multiline", "value" : "Questions" },
            {"type": "multiline", "value" :  "Answers"},
            {"type": "choice", "value" : "Classification"},
            {"type": "text", "value" : "QnAID"},
            {"type": "multiline", "value" : "Remarks"}
        ];
    
      
        fieldsToCreate.forEach(f => {
            
            console.log(f.type);
            switch (f.type){
                case "multiline":
                    list.fields.inBatch(batch).addMultilineText(f.value.toString(),6,false,false,false,false);
                case "choice": 
                    list.fields.inBatch(batch).addChoice(f.value.toString(),["Public", "Staff", "Student"],6,true);
                case "text":
                    list.fields.inBatch(batch).addText(f.value.toString(),255);
                default:
                    return null;
            }
        })
        // execute the batch
        return batch.execute().then(res => {
            console.log(res);
            return res;
        }).catch(err => {
            console.log(err);
            return err;
        });

    }
    public addFieldsToView(listname: string): Promise<any>{ //, fieldsToAdd: any[]

        const list = sp.web.lists.getByTitle(listname);
        const view = list.defaultView;

        const batch = sp.web.createBatch();

        const fields = ['LinkTitle', 'Questions', 'Answers', 'Classification', 'QnAID', 'Remarks'];

        view.fields.inBatch(batch).removeAll();
        fields.forEach(fieldName => {
            view.fields.inBatch(batch).add(fieldName);
        });

        return batch.execute().then(res => {
            console.log(res);
            return res;
        }).catch(err => {
            console.log(err);
            return err;
        });

        // return Promise.all([
        //     sp.web.lists.getByTitle(listname).defaultView.fields.add("Questions"),
        //     sp.web.lists.getByTitle(listname).defaultView.fields.add("Answers"),
        //     sp.web.lists.getByTitle(listname).defaultView.fields.add("Classification"),
        //     sp.web.lists.getByTitle(listname).defaultView.fields.add("QnAID"),
        //     sp.web.lists.getByTitle(listname).defaultView.fields.add("Remarks")
        // ]).then(res => {
        //     return res;
        // }, (error: any) => {
        //     return error;
        // }).catch(err => {
        //     return err;
        // });
    }

    public createSharePointGroup(division: string): Promise<any>{
        return sp.web.siteGroups.add({
            Title: division + " Editors",
            Description: "Editors for " + division + " list"
        }).then(res => {
            return res;
        }, (error: any) => {
            return error;
        }).catch(error => {
            return error;
        });
    }

    public addUsersToSPGroup(groupName: string, users: any[]): Promise<any>{
        console.log(users);
       let promises = users.map(u => {
            return sp.web.siteGroups.getByName(groupName).users.add(u.LoginName);
        });

        return Promise.all(promises).then(res => {
            console.log(res);
            return res;
        }).catch(err => {
            return err;
        })
         
    }
    public breakListPermission(listName: string):Promise<any>{
        return sp.web.lists.getByTitle(listName).breakRoleInheritance(false,true).then(res =>{
            return res;
        }, (error) => {
            return error;
        }).catch(err =>{
            return err;
        });
    }
    public addGroupToList(listName: string, groupId: any, roleId: any):Promise<any>{
        return sp.web.lists.getByTitle(listName).roleAssignments.add(groupId,roleId).then(res =>{
            return res;
        }, (error) => {
            return error;
        }).catch(err =>{
            return err;
        });
    }
}