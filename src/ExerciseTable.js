import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import ReactTable from "react-table";
import 'react-table/react-table.css'
import matchSorter from 'match-sorter'

export class ExerciseTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            totalCalories: 0,
            left: 0,
            email: "",
            subEmail: "",
            // today: "",
            first: true
        }
    }

    componentWillMount() {
        this.authUnlisten = firebase.auth().onAuthStateChanged(user => {
            if (user) {

                this.setState({
                    email: user.email,
                    subEmail: user.email.substr(0, user.email.indexOf('@')),
                })

                let data = []

                let reference = firebase.database().ref('Profile/' + this.state.subEmail + '/Exercises');
                reference.on('value', (snapshot) => {
                    let snap = snapshot.val();
                    if (snap !== null) {
                        data = Object.values(snap);
                        let keys = Object.keys(snap);

                        for (let i = 0; i < data.length; i++) {
                            data[i].keys = keys[i];
                        }

                        this.setState({
                            data: data
                        })
                    } else {
                        this.setState({
                            data: []
                        })
                    }
                })
            }
        })
    }

    componentWillUnmount() {
        this.authUnlisten();
    }

    render() {
        let titles = [{ header: 'Exercise', accessor: 'exercise', id: 'exercise', filterAll: true },
        { header: 'Calories', accessor: 'calories', id: 'calories', filterAll: true }]

        let array = titles.map((d) => {
            return {
                Header: d.header,
                accessor: d.accessor,
                id: d.id,
                filterAll: d.filterAll,
                filterMethod: (filter, rows) =>
                    matchSorter(rows, filter.value, { keys: [d.id] })
            }
        })

        let columns = [
            array[0],
            array[1]
        ]
        return (
            <div className="reactTable" aria-label="Exercise and Calorie Recorder">
                <ReactTable
                    className="-striped -highlight"
                    columns={columns}
                    data={this.state.data}
                    defaultPageSize={5}
                    defaultSorted={[
                        {
                            desc: true
                        }
                    ]}
                    filterable
                    defaultFilterMethod={(filter, row) =>
                        String(row[filter.id]) === filter.value}
                    showPaginationTop
                    noDataText={"Please Input Exercises Above..."}>
                </ReactTable>
            </div>
        )
    }
}