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
      isLoading: false,
      isOpen: false,
      masterListName: this.props.masterListName,
      masterListItems: [],
      showForm: false
    };
    this.changeView = this.changeView.bind(this);
    this.actionHandler = new QnAActionHandler(this, this.props.service);
    this.toggleFormView = this.toggleFormView.bind(this);
  }

  public componentWillReceiveProps(newProps): void {
    console.log("INSIDE WILL RECEIVE PROPS");
    this.loadData(newProps);

  }

  public async componentDidMount(): Promise<void> {
    // this.setState({
    //   masterListItems: await this.actionHandler.getAllMasterListItems(),
    //     isDataLoaded: true,
    // });
    this.loadData(this.props);
  }

  public toggleFormView(val: boolean): void { 
    console.log(val, "toggleform");
    this.setState({ showForm: val });
  }

  public render(): React.ReactElement<IQnAMasterListContainerProps> {
    
    if(!this.props.isConfigured){
      return(
        <div> Kindly configure webpart properties </div>
      );
    }

    return (
      <div className={ styles.qnAMasterList }>
        <div className={ styles.container }>
          

        <h1>QnA Master List</h1> 
         {console.log(this.state.showForm, "show form ")}
          {this.state.showForm ? ( 
            <QnAMasterListForm context={this.props.context} 
              actionHandler={this.actionHandler} 
              masterListName={this.props.masterListName}
              onSubmission={this.processData}/>
           ) : (
            <div> 
              <PrimaryButton 
                  text="Add QnA Master List Item" 
                  onClick={() => this.toggleFormView(true)} 
              />
              <QnAMasterListView masterListItems={this.state.masterListItems} changeView={this.changeView} actionHandler={this.actionHandler} />

            </div>
          )} 
        </div>
      </div>
    );
  }

  public processData(data) {
    console.log(data);
    this.setState({
      showForm: false
    });
  }
  private async loadData(props): Promise<void> {
    console.log("INSIDE LOAD DATA!!");
    this.setState({
      isLoading: true
    });
    let masterItems = await props.service.getAllMasterListItems(props.masterListName);

    this.setState({
      masterListItems: masterItems,
        isLoading: false,
        showForm: false
    });
  }

  private changeView(view: ViewType): void {
    this.setState({ view });
  } 

}
