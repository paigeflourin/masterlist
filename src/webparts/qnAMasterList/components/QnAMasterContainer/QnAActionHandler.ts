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


    public async getAllMasterListItems(): Promise<any[]> {
        return await this.service.getAllMasterListItems();
    }

    public async saveMasterItemtoSPList(itemDetails: IQnAMaster): Promise<any>{
        return await this.service.saveMasterItemtoSPList(itemDetailss)
    };
    
    
}
