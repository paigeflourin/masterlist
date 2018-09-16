import * as React from 'react';
import styles from './QnAMasterListView.module.scss';
import { IQnAMasterListViewProps } from './IQnAMasterListViewProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, BaseExtendedPeoplePicker, Spinner, TextField } from 'office-ui-fabric-react/lib/';


export class QnAMasterListView extends React.Component<IQnAMasterListViewProps, {}> {


  public render(): React.ReactElement<IQnAMasterListViewProps> {
    return (
      <div className={ styles.qnAMasterList }>
        <div className={ styles.container }>
            <div>
              <p>THIS IS WHERE TEH TABLE SHOULD BE</p>
            </div>
          
          {/* <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.description)}</p>
              <p className={ styles.description }>{escape(this.props.masterListName)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div> */}
        </div>
      </div>
    );
  }

}
