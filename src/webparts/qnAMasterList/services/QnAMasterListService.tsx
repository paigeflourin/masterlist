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
        console.log(itemDetails.division, "save to sp");
        return sp.web.lists.getByTitle(masterListName).items.add({
            Title: "",
            Division: "CIT", //itemDetails.division[0], key missing
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
        
        return sp.web.lists.getByTitle(listname).fields.addMultilineText("Questions",6,false,false,false,false).then(q => {
             sp.web.lists.getByTitle(listname).fields.addMultilineText("Answers",5,false,false,false,false).then(a=>{
                 sp.web.lists.getByTitle(listname).fields.addChoice("Classification",["Public", "Staff", "Student"],6,true).then(c => {
                     sp.web.lists.getByTitle(listname).fields.addText("QnAID",255).then(qn => {
                          sp.web.lists.getByTitle(listname).fields.addMultilineText("Remarks",5,false,false,false,false).then(r => {
                            return r;
                        }).catch(err=>{
                            return err;
                        })
                    }).catch(err=>{
                        return err;
                    })
                }).catch(err=>{
                    return err;
                })
            }).catch(err=>{
                return err;
            })
        }).catch(err=>{
            return err;
        })


        // if you use add you _must_ include the correct FieldTypeKind in the extended properties
        // return sp.web.lists.getByTitle(this.listName).fields.add("Questions", "SP.FieldMultiLineText", { 
        //     FieldTypeKind: 3,
        // }).then(f => {
        //     sp.web.lists.getByTitle(this.listName).fields.add("Answer", "SP.FieldMultiLineText", { 
        //         FieldTypeKind: 3,
        //     }).then(f => {
        //         console.log(f);
        //         sp.web.lists.getByTitle(this.listName).fields.add("Remarks", "SP.FieldMultiLineText", { 
        //             FieldTypeKind: 3,
        //         }).then(f => {
        //             console.log(f);
        //             let choices = ['Staff', 'Public', 'Student'];
        //             sp.web.lists.getByTitle(this.listName).fields.add("Classification", "SP.FieldChoice", { 
        //                 FieldTypeKind: 6,
        //                 Choices: { results: choices }
        //             }).then(f => {
        //                 console.log(f);
        //             });
        //         });
        //     });
        //     console.log(f);
        // });
    }


    public addFieldsToView(listname: string): Promise<any>{ //, fieldsToAdd: any[]

        return sp.web.lists.getByTitle(listname).defaultView.fields.add("Questions").then(a => {
            sp.web.lists.getByTitle(listname).defaultView.fields.add("Answers").then(a => {
                sp.web.lists.getByTitle(listname).defaultView.fields.add("Classification").then(c => {
                    sp.web.lists.getByTitle(listname).defaultView.fields.add("QnAID").then(qid => {
                        sp.web.lists.getByTitle(listname).defaultView.fields.add("Remarks").then(r => {
                            return r;
                        }).catch(err=>{
                            return err;
                        })
                    }).catch(err=>{
                        return err;
                    })
                }).catch(err=>{
                    return err;
                })
            }).catch(err=>{
                return err;
            })
        }).catch(err=>{
            return err;
        })
       
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