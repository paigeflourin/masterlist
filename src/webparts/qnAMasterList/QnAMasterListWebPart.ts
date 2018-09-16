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
import * as MockQnAServiceImport from './services/MockService';
let MockQnAService: typeof MockQnAServiceImport;
if (DEBUG) {
  MockQnAService = require('./services/MockService');
}
export interface IQnAMasterListWebPartProps {
  description: string;
  masterListName: string;
  //numberOfItems: number;
}

export default class QnAMasterListWebPart extends BaseClientSideWebPart<IQnAMasterListWebPartProps> {
  private service: IQnAMasterListService;

  protected onInit(): Promise<void> {
    console.log("here", Environment.type);
    if (Environment.type === EnvironmentType.Local) {
      console.log("environment is local");
      this.service = new MockQnAService.MockService(null);
    } else {
      this.service = new QnAMasterListService(this.properties.masterListName, this.context);
    }
      return super.onInit();

      //this.service = new QnAMasterListService(this.properties.masterListName, this.context);
      //return super.onInit();
  }
  public render(): void {
    const element: React.ReactElement<IQnAMasterListContainerProps > = React.createElement(
      QnAMasterListContainer,
      {
        masterListName: this.properties.masterListName,
        service: this.service,
        context: this.context
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
}
