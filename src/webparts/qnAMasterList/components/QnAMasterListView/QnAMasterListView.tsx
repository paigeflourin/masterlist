import * as React from 'react';
import styles from './QnAMasterListView.module.scss';
import { IQnAMasterListViewProps, IQnAMasterListViewState } from './IQnAMasterListViewProps';
import { DefaultButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import ReactTable from "react-table";
import "react-table/react-table.css";
import { QnAMasterListForm } from '../QnAMasterForm/QnAMasterListForm';

export class QnAMasterListView extends React.Component<IQnAMasterListViewProps, IQnAMasterListViewState> {


  constructor(props: IQnAMasterListViewProps, state: IQnAMasterListViewState) {
    super(props);
    this.state = {
      masterItems: [],
      showEditForm: false,
      editItem: []
    };
  }

  public componentWillReceiveProps(newProps): void {
    console.log("INSIDE WILL RECEIVE PROPS", newProps);
    let divisionList = newProps.masterListItems.map(item => ({
      Division: item.Division.Label,
      QnAListName: item.QnAListName,
      Editors: item.Editors,//item.Editors.map(u => {return u.title})
      Id: item.ID
    }));
    console.log(divisionList);
    this.setState({
      masterItems: divisionList
    });

  }

  public async componentDidMount(): Promise<void> {
    // this.setState({
    //   masterListItems: await this.actionHandler.getAllMasterListItems(),
    //     isDataLoaded: true,
    // });
    console.log(this.props);
    this.setState({
      masterItems: this.props.masterListItems
    });
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

  // public editItem(row) {
  //     //show edit form pass row value
  //   this.setState({
  //     showEditForm: true,
  //     editItem: row.row._original
  //   })
  // }


  public render(): React.ReactElement<IQnAMasterListViewProps> {
    return (
      <div className={ styles.qnAMasterList }>
        <div className={ styles.container }>
            <div> 
              <ReactTable
              //PaginationComponent={Pagination}
              data={this.state.masterItems}
              defaultPageSize={10}
              className="-striped -highlight"
              // filtered={this.state.filtered}
              // onFilteredChange={this.onFilteredChange.bind(this)}
              // filterable
              columns={[
                {
                  columns: [
                    {
                      Header: "Division",
                      accessor: "Division"
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
                          {/* <button
                            onClick={() =>
                              this.editItem({ row })
                            }
                          >
                            Edit
                          </button>
                           */}
                           <DefaultButton
                              data-automation-id="test"
                              text="EDIT"
                              onClick={() => this.props.onEditItem({row})}
                            />
                        </div>
                      ) //onClick={this.addToQnAList({row})}
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
