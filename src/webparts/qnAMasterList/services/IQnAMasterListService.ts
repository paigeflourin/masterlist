import { IQnAMaster } from "../models/IQnAMaster";
//import IItemResult from "../models/IItemResult";

export interface IQnAMasterListService {
    getAllMasterListItems: (masterListName: string) => Promise<any>;
    saveMasterItemtoSPList: (masterListName: string, itemDetailds: IQnAMaster) => Promise<any>;
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
    
    
    // addNewRequest: (formData: IPurchaseRequisition) => Promise<IItemResult>;
    // updateRequest(formData: IPurchaseRequisition): Promise<IItemResult>;
    // deleteRequest(Id: string): Promise<IItemResult>;
    // // updateWebpartProps(propertyPath:string, newValue:any):void;
    // changeStatus(Id:string,newStatus:string):Promise<IItemResult>;
}