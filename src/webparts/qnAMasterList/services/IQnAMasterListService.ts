import { IQnAMaster } from "../models/IQnAMaster";
//import IItemResult from "../models/IItemResult";

export interface IQnAMasterListService {
    getAllMasterListItems: (masterListName: string) => Promise<any>;
    saveMasterItemtoSPList: (masterListName: string, itemDetailds: IQnAMaster) => Promise<any>;
    updateMasterItemstoSPList:(masterListName: string, itemId: number,  userIds: any[])=> Promise<any>
    getUserIds:(userInfo: any[]) => Promise<any>;
    getAllDivisionLists: () => Promise<any>;
    getAllSharePointGroups: () => Promise<any>;
    createDivisionList: (qnaListName: string) => Promise<any>;
    createListFields: (listname: string) => Promise<any>;
    addFieldsToView: (listname: string) => Promise<any>; //, fieldsToAdd: any[]
    createSharePointGroup: (division: string) => Promise<any>;
    addUsersToSPGroup: (groupName: string, users: any[]) => Promise<any>;
    breakListPermission: (listName: string) =>Promise<any>;
    addGroupToList: (listName: string,  groupId: any, roleId: any) => Promise<any>;
    removeusersFromGroup: (groupName: string, users: any[]) => Promise<any>;
    getGroupUsers:(groupName: string)=> Promise<any> ;
    
  
}