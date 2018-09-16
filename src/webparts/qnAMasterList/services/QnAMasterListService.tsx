import { IWebPartContext } from '@microsoft/sp-webpart-base';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { SPHttpClient, HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { IQnAMasterListService } from './IQnAMasterListService';
import { IQnAMaster } from '../models/IQnAMaster';
import { Web } from '@pnp/sp';

export class QnAMasterListService  implements IQnAMasterListService {
    private listName: string;
    private context: WebPartContext;
    public webPartContext: WebPartContext;

    constructor(listName: string, webPartContext: WebPartContext) {
        //super(webPartContext);
        this.listName = listName;
        this.context = webPartContext;
    }


    getAllMasterListItems: () => Promise<any>;
    saveMasterItemtoSPList: (itemDetails: IQnAMaster) => Promise<any>;
    getAllDivisionLists: () => Promise<any>;
    getAllSharePointGroups: () => Promise<any>;
    createDivisionList: () => Promise<any>;
    createListFields: (listname: string) => Promise<any>;
    addFieldsToView: (listId: string, fieldsToAdd: any[]) => Promise<any>;
    createSharePointGroup: () => Promise<any>;
    addUsersToSPGroup: (users: string[]) => Promise<any>;
    breakListPermission: (listName: string) => Promise<any>;
    addGroupToList: (listName: string, groupToAdd: any[]) => Promise<any>;
}