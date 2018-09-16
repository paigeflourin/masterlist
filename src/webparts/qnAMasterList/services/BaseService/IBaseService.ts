import { CamlQuery, Web } from "@pnp/sp";

export interface IBaseService {
    getData(url: string): Promise<any>;
    //getViewCamlQuery(web: Web, listTitle: string, viewTitle: string, viewFields: string[], filter?: string): Promise<CamlQuery>;
}
