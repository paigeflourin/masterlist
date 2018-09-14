import * as React from 'react';
import styles from './QnAMasterList.module.scss';
import { IQnAMasterListProps } from './IQnAMasterListProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { Form, FormTextInput } from '@uifabric/experiments/lib/Form';

export default class QnAMasterList extends React.Component<IQnAMasterListProps, {}> {




  public render(): React.ReactElement<IQnAMasterListProps> {
    return (
      <div className={ styles.qnAMasterList }>
        <div className={ styles.container }>

          <Form onSubmit={this._onSubmit}>
            <FormTextInput textFieldProps={{ label: 'QnA List Name' }} inputKey="QnAListName" />
            <PrimaryButton>Submit</PrimaryButton>
          </Form>

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

  private _onSubmit = (values: { [key: string]: any }): void => {
    this.setState({ formResults: values });
  };

}
