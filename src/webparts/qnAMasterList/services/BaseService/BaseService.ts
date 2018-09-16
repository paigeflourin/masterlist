import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { CamlQuery, Web } from '@pnp/sp';
import { IBaseService } from './IBaseService';

export class BaseService implements IBaseService {
    private readonly httpClientOptions = {
        headers: {
            'Accept': 'application/json;odata=nometadata',
            'odata-version': ''
        }
    };

    public webPartContext: WebPartContext;

    constructor(webPartContext: WebPartContext) {
        this.webPartContext = webPartContext;
    }

    public getData(url: string): Promise<any> {
        return this.webPartContext.spHttpClient.get(url, SPHttpClient.configurations.v1, this.httpClientOptions)
            .then((response: SPHttpClientResponse) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then((json) => {
                return json.value ? json.value : json;
            })
            .catch((e) => {
                this.logError(e);
            });
    }

    public getViewCamlQuery(web: Web, listTitle: string, viewTitle: string, viewFields: string[],
        filter?: string, rowLimit?: number): Promise<CamlQuery> {
        return web.lists.getByTitle(listTitle).views.getByTitle(viewTitle)
            .select("ViewQuery")
            .get()
            .then((view): CamlQuery => {
                let query = view.ViewQuery;
                if (!!filter) {
                    if (query.indexOf("<Where>") !== -1) {
                        query = query.replace("<Where>", "<Where><And>" + filter).replace("</Where>", "</And></Where>");
                    } else {
                        query = `<Where>${filter}</Where>` + query;
                    }
                }
                const ViewXml = `<View>` +
                    `<ViewFields>${viewFields.map((item) => `<FieldRef Name='${item}'/>`).join('')}</ViewFields>` +
                    `<Query>${query}</Query>` +
                    (rowLimit ? `<RowLimit>${rowLimit}</RowLimit>` : '') +
                    `</View>`;
                return {
                    DatesInUtc: false,
                    ViewXml
                };
            });
    }

    private logError(e) {
        //console.log(e);
    }
}
