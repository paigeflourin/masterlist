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

   
    private logError(e) {
        //console.log(e);
    }
}
