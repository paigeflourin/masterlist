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

    public async saveMasterItemtoSPList(itemDetails: IQnAMaster, callback: Function): Promise<any>{
  
        return null;
    }
    
    getUserIds:(email: string) => Promise<any>;
    getAllDivisionLists: () => Promise<any>;
    getAllSharePointGroups: () => Promise<any>;
    createDivisionList: (qnaListName: string) => Promise<any>;
    createListFields: (listname: string) => Promise<any>;
    addFieldsToView: (listname: string, fieldsToAdd: any[]) => Promise<any>;
    createSharePointGroup: (division: string) => Promise<any>;
    addUsersToSPGroup: (users: string[]) => Promise<any>;
    breakListPermission: (listName: string) =>Promise<any>;
    addGroupToList: (listName: string, groupToAdd: any[]) => Promise<any>;
    
}
