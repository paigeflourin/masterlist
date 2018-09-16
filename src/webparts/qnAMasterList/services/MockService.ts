
import { BaseService } from '../services/BaseService/BaseService';
import { IQnAMasterListService } from './IQnAMasterListService';
import { IQnAMaster } from '../models/IQnAMaster';

export class MockService extends BaseService {

    private readonly masterListData = [
        {
            Items: [
                {
                    Id: "1",
                    Division: "Admission",
                    QnAListName: "AdmissionQnA",
                    Editors: ["admin-ptangalin@cupdev.onmicrosoft.com", "page@gamil.com"  ]
                },
                {
                    Id: "2",
                    Division: "Registrars Office",
                    QnAListName: "RegistrarsQnA",
                    Editors: ["admin-ptangalin@cupdev.onmicrosoft.com", "page@gamil.com"  ]
                }, {
                    Id: "3",
                    Division: "Finance",
                    QnAListName: "FinanceQnA",
                    Editors: [ "page@gamil.com"  ]
                }, {
                    Id: "4",
                    Division: "CIT",
                    QnAListName: "CITQnA",
                    Editors: ["page@gamil.com"  ]
                },
            ]
        }
    ];

    public getAllMasterListItems(): Promise<any[]> {
        const masterItems = this.masterListData[0].Items;
        return new Promise<any[]>((resolve) => {
           setTimeout(() => resolve(this.masterListData[0].Items) ,300 )
        });
    }


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
