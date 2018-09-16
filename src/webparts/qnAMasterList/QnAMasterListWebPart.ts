import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'QnAMasterListWebPartStrings';
import { QnAMasterListContainer } from './components/QnAMasterContainer/QnAMasterListContainer';
import { IQnAMasterListContainerProps } from './components/QnAMasterContainer/IQnAMasterListContainerProps';
import { IQnAMasterListService } from './services/IQnAMasterListService';
import { QnAMasterListService } from './services/QnAMasterListService';


export interface IQnAMasterListWebPartProps {
  description: string;
  masterListName: string;
  //numberOfItems: number;
}

export default class QnAMasterListWebPart extends BaseClientSideWebPart<IQnAMasterListWebPartProps> {
  private service: IQnAMasterListService;

  protected onInit(): Promise<void> {
      this.service = new QnAMasterListService(this.properties.masterListName, this.context);
      return super.onInit();
  }
  public render(): void {
    const element: React.ReactElement<IQnAMasterListContainerProps > = React.createElement(
      QnAMasterListContainer,
      {
        masterListName: this.properties.masterListName,
        service: this.service
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
