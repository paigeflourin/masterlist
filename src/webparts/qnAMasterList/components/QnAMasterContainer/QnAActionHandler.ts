import { QnAMasterListContainer } from "./QnAMasterListContainer";
import { ViewType } from '../../helper/ViewType';
import { IQnAMasterListService } from '../../services/IQnAMasterListService';
import { sortBy } from "@microsoft/sp-lodash-subset";
import { IQnAMaster } from '../../models/IQnAMaster';

export class QnAActionHandler {
    constructor(private container: QnAMasterListContainer, private service: IQnAMasterListService) {
        this.changeView = this.changeView.bind(this);
    }

    public changeView(view: ViewType): void {
        this.container.setState({ view });
    }


    public async getAllMasterListItems(masterListName: string): Promise<any[]> {
        return await this.service.getAllMasterListItems(masterListName);
    }

    public async saveMasterItemtoSPList(masterListName: string, itemDetails: IQnAMaster): Promise<any>{
        let res = await this.service.saveMasterItemtoSPList(masterListName,itemDetails);
        return null;
    }

    public async updateMasterItemstoSPList(masterListName: string, itemId: number,  userIds: any[]): Promise<any>{
        let res = await this.service.updateMasterItemstoSPList(masterListName,itemId,userIds);
        return res;
    }
    
    public async getUserIds(userInfo: any[]):Promise<any>{
        let res = await this.service.getUserIds(userInfo);
        return res;
    }
    public async getAllDivisionLists():Promise<any>{
        let res = await this.service.getAllDivisionLists();
        return res;
    }
    public async getAllSharePointGroups (): Promise<any>{
        return await this.service.getAllSharePointGroups();
    }
    public async createDivisionList(qnaListName: string): Promise<any>{
        return await this.service.createDivisionList(qnaListName);
    }
    public async createListFields(listname: string) :Promise<any>{
        return await this.service.createListFields(listname);
    }
    public async addFieldsToView(listname: string) :Promise<any>{ //, fieldsToAdd: any[]
        return await this.service.addFieldsToView(listname);
    }
    public async createSharePointGroup(division: string):Promise<any>{
        return await this.service.createSharePointGroup(division);
    }
    public async addUsersToSPGroup(groupName: string, users: any[]):Promise<any>{
        return await this.service.addUsersToSPGroup(groupName, users);
    }
    public async breakListPermission(listName: string):Promise<any>{
        return await this.service.breakListPermission(listName);
    }
    public async addGroupToList(listName: string, groupId: any, roleId: any):Promise<any>{
        return await this.service.addGroupToList(listName, groupId, roleId);
    }

    public async removeusersFromGroup(groupName: string, users: any[]):Promise<any>{
        return await this.service.removeusersFromGroup(groupName, users);
    }
    public async getGroupUsers(groupName: string): Promise<any> {
        return await this.service.getGroupUsers(groupName);
    }
    
}
