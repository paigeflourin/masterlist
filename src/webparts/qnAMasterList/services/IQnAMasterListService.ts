import { IQnAMaster } from "../models/IQnAMaster";
//import IItemResult from "../models/IItemResult";

export interface IQnAMasterListService {
    getAllMasterListItems: () => Promise<any>;
    saveMasterItemtoSPList: (itemDetailds: IQnAMaster) => Promise<any>;
    getAllDivisionLists: () => Promise<any>;
    getAllSharePointGroups: () => Promise<any>;
    createDivisionList: () => Promise<any>;
    createListFields: (listname: string) => Promise<any>;
    addFieldsToView: (listId: string, fieldsToAdd: any[]) => Promise<any>;
    createSharePointGroup: () => Promise<any>;
    addUsersToSPGroup: (users: string[]) => Promise<any>;
    breakListPermission: (listName: string) =>Promise<any>;
    addGroupToList: (listName: string, groupToAdd: any[]) => Promise<any>;
    
    
    // addNewRequest: (formData: IPurchaseRequisition) => Promise<IItemResult>;
    // updateRequest(formData: IPurchaseRequisition): Promise<IItemResult>;
    // deleteRequest(Id: string): Promise<IItemResult>;
    // // updateWebpartProps(propertyPath:string, newValue:any):void;
    // changeStatus(Id:string,newStatus:string):Promise<IItemResult>;
}