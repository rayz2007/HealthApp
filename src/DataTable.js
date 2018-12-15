import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import matchSorter from 'match-sorter'


export class DataTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            totalCalories: 0,
            left: 0,
            email: "",
            subEmail: "",
            today: ""
        }
        this.renderEditable = this.renderEditable.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
    }

    componentWillMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    email: user.email,
                    subEmail: user.email.substr(0, user.email.indexOf('@'))
                })

                let data = []

                let today = new Date();
                let dd = today.getDate();
                let mm = today.getMonth();
                let yyyy = today.getFullYear();

                today = [mm + 1] + '/' + dd + '/' + yyyy;

                this.setState({
                    today: today
                })

                let leftCal = firebase.database().ref('Profile/' + this.state.subEmail + '/Author/Calories');
                leftCal.on('value', (snapshot) => {
                    let snap = snapshot.val();
                    this.setState({
                        left: snap
                    })
                })

                let reference = firebase.database().ref('Profile/' + this.state.subEmail + '/Meals');
                reference.on('value', (snapshot) => {
                    let snap = snapshot.val();
                    if (snap !== null) {
                        data = Object.values(snap);
                        let keys = Object.keys(snap);

                        // Step 1: add the id ("key") to each object in data array
                        for (let i = 0; i < data.length; i++) {
                            data[i].keys = keys[i];
                        }

                        let total = 0;

                        data.map((item) => {
                            if (item["date"] === today) {
                                total += Number(item["calories"])
                            }
                            return null
                        })

                        this.setState({
                            data: data,
                            totalCalories: total
                        })
                    } else {
                        this.setState({
                            data: [],
                            totalCalories: 0
                        })
                    }
                })
            }
        })
    }

    componentWillUnmount() {
        this.authUnlisten();
    }

    renderEditable(cellInfo) {
        let reference = firebase.database().ref('Profile/' + this.state.subEmail + '/Meals');

        return (
            <div
                style={{ backgroundColor: "#fafafa" }}
                contentEditable
                suppressContentEditableWarning
                onBlur={e => {
                    const data = [...this.state.data];

                    // make a reference to a specific key
                    let key = reference.child(data[cellInfo.index].keys)
                    // update value in each cell in database too
                    key.child(cellInfo.column.id).set(e.target.innerHTML)

                    data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;

                    this.setState({ data });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        )
    }

    deleteRow(props) {
        let row = props.original.keys
        let reference = firebase.database().ref('Profile/' + this.state.subEmail + '/Meals');
        reference.child(row).remove()
    }

    render() {
        let reg = [{ header: 'Date', accessor: 'date', id: "date", filterAll: true, cell: null},
        { header: 'Meal Type', accessor: 'mealType', id: 'mealType', filterAll: true, cell: null },
        { header: 'Meal', accessor: 'meal', id: "meal", filterAll: true, cell: this.renderEditable }]

        // let edit = [{ header: 'Meal', accessor: 'meal', id: "meal", filterAll: true, cell: this.renderEditable },
        // { header: 'Calories', accessor: 'calories', id: "calories", filterAll: true, cell: this.renderEditable }]


        let regArray = reg.map((d) => {
            return {
                Header: d.header,
                accessor: d.accessor,
                id: d.id,
                filterAll: d.filterAll,
                Cell: d.cell,
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: [d.id] })
            }
        })
        
        let columns = [
            regArray[0],
            regArray[1],
            regArray[2],
            {
                Header: 'Calories',
                accessor: 'calories',
                id: "calories",
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: ["calories"] }),
                filterAll: true,
                Cell: this.renderEditable,
                Footer: (
                    <div>
                        <span><strong>{this.state.today}</strong></span>
                        <br />
                        <br />
                        <span>
                            <strong>Total Calorie Intake {<br />} for the Day: </strong>{" "}
                            {this.state.totalCalories}
                        </span>
                        <br />
                        <br />
                        <span>
                            <strong>Leftover Calories{<br />} for the Day: </strong>{" "}
                            {this.state.left - this.state.totalCalories}
                        </span>
                    </div>
                ),

            },
            {
                Header: 'Actions',
                Cell: props => {
                    return (
                        <button className="btn btn-default"
                            onClick={() => {
                                this.deleteRow(props)
                            }}>DELETE</button>
                    )
                },
                sortable: false,
                filterable: false,
                width: 100,
                minWidth: 100,
                maxWidth: 100
            }
        ]
        return (
            <div className="reactTable" aria-label="Meals and Calorie Recorder">
                <ReactTable
                    className="-striped -highlight"
                    columns={columns}
                    data={this.state.data}
                    defaultPageSize={5}
                    defaultSorted={[
                        {
                            id: "date",
                            desc: true
                        }
                    ]}
                    filterable
                    defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value}
                    showPaginationTop
                    noDataText={"Please Input Meals Above..."}>
                </ReactTable>
            </div>
        )
    }
}