import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { IQnAMasterListService } from './IQnAMasterListService';
import { IQnAMaster } from '../models/IQnAMaster';
import { sp } from '@pnp/sp';

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
        return sp.web.lists.getByTitle(masterListName).items.select("Title", "ID", "Division", "QnAListName", "Editors").
        expand("Editors", "Division").get().then((response) => {
              console.log(response);
              return response;
        });
    };

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
        })
    }

    public getUserIds(loginName: string): Promise<any> {
       return sp.web.siteUsers.getByLoginName(loginName).get().then(res => {
            console.log(res);
            return res;
        }).catch(err => {
            return err;
        })
    }
    
    public getAllDivisionLists(): Promise<any>{
        return sp.web.lists.select("Title").get().then(lists => {
            console.log(lists);
            return lists;
        })
    }

    public getAllSharePointGroups(): Promise<any> {
        return sp.web.siteGroups.get().then(groups => {
            console.log(groups);
            return groups;
        })
    }

    public createDivisionList(qnaListName: string): Promise<any>{
        return sp.web.lists.add(
             qnaListName,
             "",
             100,
             true
        ).then(res => {
            console.log("list created", res);
            return res;
        }).catch(error => {
            return error;
        })
    }

    public createListFields(listname: string): Promise<any>{
        return Promise.all([
            sp.web.lists.getByTitle(this.listName).fields.addMultilineText("Questions",6,false,false,false,false),
            sp.web.lists.getByTitle(this.listName).fields.addMultilineText("Answers",5,false,false,false,false),
            sp.web.lists.getByTitle(this.listName).fields.addChoice("Classification",["Public", "Staff", "Student"],6,true),
            sp.web.lists.getByTitle(this.listName).fields.addText("QnAID",255),
            sp.web.lists.getByTitle(this.listName).fields.addMultilineText("Remarks",5,false,false,false,false)
        ]).then(res => {
            return res;
        }, (error: any) => {
            return error;
        }).catch(err => {
            return err;
        });
        // pnp.sp.web.fields.add('name', 'SP.FieldChoice', {
        //     FieldTypeKind: 6,
        //     Choices: { results: ['choice1', 'choice2'] }
        // });
      
    }
    public addFieldsToView(listname: string, fieldsToAdd: any[]): Promise<any>{
        return Promise.all([
            sp.web.lists.getByTitle(listname).defaultView.fields.add("Questions"),
            sp.web.lists.getByTitle(listname).defaultView.fields.add("Answers"),
            sp.web.lists.getByTitle(listname).defaultView.fields.add("Classification"),
            sp.web.lists.getByTitle(listname).defaultView.fields.add("QnAID"),
            sp.web.lists.getByTitle(listname).defaultView.fields.add("Remarks")
        ]).then(res => {
            return res;
        }, (error: any) => {
            return error;
        }).catch(err => {
            return err;
        });
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
            return error
        })
    }
    public addUsersToSPGroup(users: string[]): Promise<any>{
        return null;
    }
    public breakListPermission: (listName: string) => Promise<any>;
    public addGroupToList: (listName: string, groupToAdd: any[]) => Promise<any>;
}