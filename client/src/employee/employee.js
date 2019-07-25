import React, { Component } from 'react'
import axios from 'axios';

class Employee extends Component {
    constructor() {
        super();
        this.state = {
            employees: [],
            Name: "",
            EmpCode: 0,
            Salary: 0,
        }
    }
    //this is where the lifecycle methods go
    async componentDidMount() {
        try {
            this.refresh();
        } catch (error) {
            console.error(error)
        }
    }


    //Below this line is where our methods are going to live

    handleChange = (event) => {
        console.log(event.target.name)
        console.log(event.target.value)
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    addEmployee = async (event) => {
        event.preventDefault();
        const {Name, EmpCode, Salary} = this.state
        try {
            await axios.post('/employees', {Name, EmpCode, Salary})
            alert("Employee Added")
            this.refresh();
        } catch (error) {
            console.log(error)
        }
    }

    deleteEmployee = async (id) => {
        try {
            await axios.delete(`/employees/${id}`)
            console.log(`ID : ${id} was deleted`)
            this.refresh();
        } catch (error) {
            console.error(error)
        }

    }

    refresh = async () => {
        try {
            const res = await axios.get("/employees")
            this.setState({
                employees: res.data
            })
        } catch (error) {

        }
    }

    render() {
        if (this.state.employees.length) {
            return (
                <div>
                    <ul>
                        {this.state.employees.map(el => {
                            return <li key={el.EmpID}>{el.Name}
                                <button type="button" onClick={() => this.deleteEmployee(el.EmpID)}>DELETE</button></li>
                        })}
                    </ul>
                    <form onSubmit={this.addEmployee}>
                        <input name="Name" placeholder="Please enter the employees name here yay :)" onChange={this.handleChange} />
                        <input name="EmpCode" placeholder="Please enter the employees code here  :)" onChange={this.handleChange} />
                        <input name="Salary" placeholder="Please enter the employees Salary here yay :)" onChange={this.handleChange} />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )
        } else {
            return (
                <div>There isn't any employees to list :(</div>
            )
        }
    }
}

export default Employee;