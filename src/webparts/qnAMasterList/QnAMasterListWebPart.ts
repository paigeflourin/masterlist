import "@pnp/polyfill-ie11";
import 'es6-promise';
import 'core-js/es6/array';
import 'core-js/es6/number';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { Environment, EnvironmentType } from '@microsoft/sp-core-library';
import * as strings from 'QnAMasterListWebPartStrings';
import { QnAMasterListContainer } from './components/QnAMasterContainer/QnAMasterListContainer';
import { IQnAMasterListContainerProps } from './components/QnAMasterContainer/IQnAMasterListContainerProps';
import { IQnAMasterListService } from './services/IQnAMasterListService';
import { QnAMasterListService } from './services/QnAMasterListService';
import { sp } from '@pnp/sp';

export interface IQnAMasterListWebPartProps {
  description: string;
  masterListname: string;
  //numberOfItems: number;
}

export default class QnAMasterListWebPart extends BaseClientSideWebPart<IQnAMasterListWebPartProps> {
  private service: IQnAMasterListService;

  protected onInit(): Promise<void> {
    console.log("here", Environment.type);
    //if (Environment.type === EnvironmentType.Local) {
    //  console.log("environment is local");
    //  this.service = new MockQnAService.MockService(null);
    //} else {
      this.service = new QnAMasterListService(this.properties.masterListname, this.context);
    //}
      return super.onInit().then(_ => {
        sp.setup({
          spfxContext: this.context,
          sp: {
            headers: {
              Accept: 'application/json; odata=verbose'
            }
          }
        });
      });

      //this.service = new QnAMasterListService(this.properties.masterListName, this.context);
      //return super.onInit();
  }
  public render(): void {
    const element: React.ReactElement<IQnAMasterListContainerProps > = React.createElement(
      QnAMasterListContainer,
      {
        masterListName: this.properties.masterListname,
        service: this.service,
        context: this.context,
        isConfigured: this.needsConfiguration()
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('masterListname', {
                  label: strings.MasterListNameFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }


  private needsConfiguration(): boolean {
    console.log("needscionfig");
    let config =  !!this.properties.masterListname;
        return config;
  }
}
