import * as React from 'react';
import styles from './QnAMasterListView.module.scss';
import { IQnAMasterListViewProps, IQnAMasterListViewState } from './IQnAMasterListViewProps';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { QnAMasterListForm } from '../QnAMasterForm/QnAMasterListForm';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';


export class QnAMasterListView extends React.Component<IQnAMasterListViewProps, IQnAMasterListViewState> {


  constructor(props: IQnAMasterListViewProps, state: IQnAMasterListViewState) {
    super(props);
    this.state = {
      masterItems: [],
      showEditForm: false,
      editItem: [],
      isLoading: false
    };
  }

  public componentWillReceiveProps(newProps): void {
    console.log("INSIDE WILL RECEIVE PROPS", newProps);
    this.setState({
      isLoading: true
    });
    let divisionList = newProps.masterListItems.map(item => ({
      Division: item.Division.Label,
      QnAListName: item.QnAListName,
      Editors: item.Editors,//item.Editors.map(u => {return u.title})
      Id: item.ID
    }));
    console.log(divisionList);
    this.setState({
      masterItems: divisionList,
      isLoading: false
    });

  }

  public async componentDidMount(): Promise<void> {
    console.log("inside component did mount");
    // this.setState({
    //   masterListItems: await this.actionHandler.getAllMasterListItems(),
    //     isDataLoaded: true,
    // });
    if(this.props.masterListItems.length !== 0) {
      this.setState({
        isLoading: true
      });
      let divisionList = this.props.masterListItems.map(item => ({
        Division: item.Division.Label,
        QnAListName: item.QnAListName,
        Editors: item.Editors,//item.Editors.map(u => {return u.title})
        Id: item.ID
      }));
      console.log(divisionList);
      this.setState({
        masterItems: divisionList,
        isLoading: false
      });
    }
    
  }

  public renderEditorsField(cellInfo) {
    console.log(cellInfo.original.Editors);
    return cellInfo.original.Editors.map(editor => {
      //console.log(editor)
      return (
        <div>
          <span> {editor.title} </span>
        </div>
      );
    });
  }

  // public renderDivisionField(cellInfo) {
  //   console.log(cellInfo.original.Division);
  //   return cellInfo.original.Division.map(division => {
  //     //console.log(editor)
  //     return (
  //       <div>
  //         <span> {division.Label} </span>
  //       </div>
  //     );
  //   });
  // }

  public render(): React.ReactElement<IQnAMasterListViewProps> {
    return (
      
      <div className={ styles.qnAMasterList }>
        <div className={ styles.container }>
          {this.state.isLoading && <LoadingSpinner />}
            <div> 
              <ReactTable
              data={this.state.masterItems}
              defaultPageSize={10}
              className="-striped -highlight"
              columns={[
                {
                  columns: [
                    {
                      Header: "Division",
                      accessor: "Division"
                     // Cell: this.renderDivisionField
                    },
                    {
                      Header: "QnA List Name",
                      accessor: "QnAListName"
                    },
                    {
                      Header: "Editors",
                      accessor: "Editors",
                      Cell: this.renderEditorsField
                    },
                    {
                      Header: "Actions",
                      accessor: "newQuestionsActions",
                      Cell: ({ row }) => (
                        <div>
                           <DefaultButton
                              data-automation-id="test"
                              text="EDIT"
                              onClick={() => this.props.onEditItem({row})}
                            />
                        </div>
                      )
                    }
                  ]
                }
              ]}
            />
            </div>
        </div>
      </div>
    );
  }
}
