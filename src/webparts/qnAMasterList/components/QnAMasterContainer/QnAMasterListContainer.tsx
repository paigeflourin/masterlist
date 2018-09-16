import * as React from 'react';
import styles from './QnAMasterListContainer.module.scss';
import { IQnAMasterListContainerProps , IQnAMasterListContainerState} from './IQnAMasterListContainerProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { QnAMasterListForm } from '../QnAMasterForm/QnAMasterListForm';
import { QnAMasterListView } from '../QnAMasterListView/QnAMasterListView';
import { QnAActionHandler } from './QnAActionHandler';
import { ViewType } from '../../helper/ViewType';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';


export class QnAMasterListContainer extends React.Component<IQnAMasterListContainerProps, IQnAMasterListContainerState> {

  private actionHandler: QnAActionHandler;
  public token = null;
  

  constructor(props: IQnAMasterListContainerProps, state: IQnAMasterListContainerState){
    super(props);
    this.state = {  
      view: ViewType.Display,
      error: "",
      isDataLoaded: false,
      isOpen: false,
      masterListName: this.props.masterListName,
      masterListItems: [],
      showForm: false
    }
    this.changeView = this.changeView.bind(this);
    this.actionHandler = new QnAActionHandler(this, this.props.service);
    this.toggleFormView = this.toggleFormView.bind(this);
  }

  public componentWillReceiveProps(newProps): void {
    console.log("INSIDE WILL RECEIVE PROPS");
    this.loadData(newProps);

  }

  public async componentDidMount(): Promise<void> {
    this.setState({
      masterListItems: await this.actionHandler.getAllMasterListItems(),
        isDataLoaded: true,
    });
  }

  public toggleFormView(): void { 
    this.setState({ showForm: true});
  }

  public render(): React.ReactElement<IQnAMasterListContainerProps> {
    return (
      <div className={ styles.qnAMasterList }>
        <div className={ styles.container }>
          

          <h1>QnA Master List</h1>

          {this.state.showForm &&
              <QnAMasterListForm actionHandler={this.actionHandler} />
          }
         
            <PrimaryButton 
                      text="Add QnA Master List Item" 
                      onClick={this.toggleFormView} 
            />
            <QnAMasterListView masterListItems={this.state.masterListItems} changeView={this.changeView} actionHandler={this.actionHandler} />
          
          
          
        </div>
      </div>
    );
  }

  private async loadData(props): Promise<void> {
    console.log("INSIDE LOAD DATA!!");
    this.setState({
      masterListItems: await props.service.getAllItems(),
        isDataLoaded: true,
    });
  }

  private changeView(view: ViewType): void {
    this.setState({ view });
  } 

}
