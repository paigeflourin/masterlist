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
      showForm: false,
      editItem: []
    };
    this.changeView = this.changeView.bind(this);
    this.actionHandler = new QnAActionHandler(this, this.props.service);
    this.toggleFormView = this.toggleFormView.bind(this);
    this.onEditItem = this.onEditItem.bind(this);
    this.processData = this.processData.bind(this);
  }

  public componentWillReceiveProps(newProps): void {
    console.log("INSIDE WILL RECEIVE PROPS");
    this.loadData(newProps);

  }

  public async componentDidMount(): Promise<void> {
    this.loadData(this.props);
  }

  public processData(data) {
    console.log(data);
    this.loadData(this.props);
    this.setState({
      showForm: false
    });
  }

  public onEditItem(data){
    console.log(data.row._original.Editors);
    let newEd = data.row._original.Editors.map(ed =>{
      ed.primaryText = ed.title;
      ed.Description = ed.email;
      return ed;
    })
    console.log(newEd);
    //need to add this is editItem.Editors
    //primaryText: "Admin - Cristina Abellera" [get from data.title]

    // data.row._original.Editors.map((obj) => {
    //   obj.primaryText = obj.title;
    //   return obj;
    // })
    const { row } = data
    row._original.Editors = newEd
    this.setState(prevState => ({
      showForm: true,
      editItem: row._original
    }))
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
              onSubmission={this.processData}
              editItem={this.state.editItem}/>
           ) : (
            <div> 
              <PrimaryButton 
                  text="Add QnA Master List Item" 
                  onClick={() => this.toggleFormView(true)} 
              />
              <QnAMasterListView masterListItems={this.state.masterListItems} 
              changeView={this.changeView} 
              actionHandler={this.actionHandler} 
              masterListName={this.props.masterListName} 
              onEditItem={this.onEditItem}/>

            </div>
          )} 
        </div>
      </div>
    );
  }

 

}
