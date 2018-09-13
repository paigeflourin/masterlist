import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'QnAMasterListWebPartStrings';
import QnAMasterList from './components/QnAMasterList';
import { IQnAMasterListProps } from './components/IQnAMasterListProps';

export interface IQnAMasterListWebPartProps {
  description: string;
  masterListName: string;
}

export default class QnAMasterListWebPart extends BaseClientSideWebPart<IQnAMasterListWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IQnAMasterListProps > = React.createElement(
      QnAMasterList,
      {
        description: this.properties.description,
        masterListName: this.properties.masterListName
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
