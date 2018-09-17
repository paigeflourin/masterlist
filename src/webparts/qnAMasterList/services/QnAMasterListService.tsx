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

    getAllMasterListItems(): Promise<any>{
        return sp.web.lists.getByTitle(this.listName).items.select("Title", "ID", "Division", "QnAListName", "Editors").
        expand("Editors", "Division").get().then((response) => {
              console.log(response);
              return response;
        });
    };

    saveMasterItemtoSPList: (itemDetails: IQnAMaster) => Promise<any>;
    
    getAllDivisionLists(): Promise<any>{
        return sp.web.lists.select("Title").get().then(lists => {
            console.log(lists);
            return lists;
        })
    };
    getAllSharePointGroups: () => Promise<any>;
    createDivisionList: () => Promise<any>;
    createListFields: (listname: string) => Promise<any>;
    addFieldsToView: (listId: string, fieldsToAdd: any[]) => Promise<any>;
    createSharePointGroup: () => Promise<any>;
    addUsersToSPGroup: (users: string[]) => Promise<any>;
    breakListPermission: (listName: string) => Promise<any>;
    addGroupToList: (listName: string, groupToAdd: any[]) => Promise<any>;
}