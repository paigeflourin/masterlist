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
                                    <FieldRef Name="ID"/>
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
        console.log(itemDetails.division, "save to sp", itemDetails.Editors);
        return sp.web.lists.getByTitle(masterListName).items.add({
            Title: "",
            Division: {
                __metadata: { "type": "SP.Taxonomy.TaxonomyFieldValue" },
                Label: itemDetails.division[0].name,
                TermGuid: itemDetails.division[0].key,
                WssId: -1
            },
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

    public updateMasterItemstoSPList(masterListName: string, itemId: number,  userIds: any[]): Promise<any> {
        return sp.web.lists.getByTitle(masterListName).items.getById(itemId).update({
            EditorsId: {
                results: userIds
            }
        }).then(i =>{
            return i;
        }).catch(err => {
            return err;
        });
    }

    public getUserIds(userInfo: any[]): Promise<any> {
        //let promises = [];
        //Issue with editing since the edited item does not return the login name.
        let resp;
        let promises = userInfo.map( u => {
            console.log(u.user);
            return sp.web.siteUsers.getByLoginName(u.user.Key).get().then(); //res => {
              //  return res.Id;   
            //});
        });

        return Promise.all(promises)
        .then(res => {
            console.log(res);
           return  res;
        })
        .catch(err => { 
            return err; 
        });

        //return resp;
    }

    public getUserIdsEdit(userInfo: any[]): Promise<any> {
        //let promises = [];
        //Issue with editing since the edited item does not return the login name.
        let resp;
        let promises = userInfo.map( u => {
            console.log(u);
            //return sp.web.siteUsers.getByLoginName(u.loginName).get().then(); //res => {
            return sp.web.siteUsers.getById(u.id).get().then();
              //  return res.Id;   
            //});
        });

        return Promise.all(promises)
        .then(res => {
            console.log(res);
           return  res;
        })
        .catch(err => { 
            return err; 
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
        
        return sp.web.lists.getByTitle(listname).fields.addMultilineText("Questions",6,false,false,false,false)
        .then(() => sp.web.lists.getByTitle(listname).fields.addMultilineText("Answer",5,true,false,false,true))
        .then(() => sp.web.lists.getByTitle(listname).fields.addChoice("Classification",["Public", "Staff", "Student"],6,true))
        .then(() => sp.web.lists.getByTitle(listname).fields.addNumber("QnAID",0))
        .then(() => sp.web.lists.getByTitle(listname).fields.addMultilineText("Remarks",5,false,false,false,false))
        .then(() => sp.web.lists.getByTitle(listname).fields.addText("Rating",255));
    }


    public addFieldsToView(listname: string): Promise<any>{ //, fieldsToAdd: any[]

        return sp.web.lists.getByTitle(listname).defaultView.fields.add("Questions")
        .then(() => sp.web.lists.getByTitle(listname).defaultView.fields.add("Answer"))
        .then(()=> sp.web.lists.getByTitle(listname).defaultView.fields.add("Classification"))
        .then(()=> sp.web.lists.getByTitle(listname).defaultView.fields.add("QnAID"))
        .then(()=> sp.web.lists.getByTitle(listname).defaultView.fields.add("Remarks"))
        .then(()=> sp.web.lists.getByTitle(listname).defaultView.fields.add("Rating"))
        .catch(err=>{
            return err;
        });

       
        // const list = sp.web.lists.getByTitle(listname);
        // const view = list.defaultView;

        // const batch = sp.web.createBatch();

        // const fields = ['LinkTitle', 'Questions', 'Answers', 'Classification', 'QnAID', 'Remarks'];

        // view.fields.inBatch(batch).removeAll();
        // fields.forEach(fieldName => {
        //     view.fields.inBatch(batch).add(fieldName);
        // });

        // return batch.execute().then(res => {
        //     console.log(res);
        //     return res;
        // }).catch(err => {
        //     console.log(err);
        //     return err;
        // });

    }

    public createSharePointGroup(division: string): Promise<any>{
        return sp.web.siteGroups.add({
            Title: division,
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
        });
         
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

    public getGroupUsers(groupName: string): Promise<any> {
        return sp.web.siteGroups.getByName(groupName).users.get().then(users => {
            //let userArray = [];
            //if(!Array.isArray(users)){
           //     userArray.push(users);
            //    return userArray;
            //} else {
                return users;
           // }
        }, (error) => {
            return error;
        }).catch(err =>{
            return err;
        });
    }

    public removeusersFromGroup(groupName: string, users: any[]): Promise<any>{
        console.log(users);

        let promises = users.map(u => {
            return sp.web.siteGroups.getByName(groupName).users.removeByLoginName(u.LoginName);
        });

        return Promise.all(promises).then(res => {
            console.log(res);
            return res;
        }).catch(err => {
            return err;
        });

    }

}