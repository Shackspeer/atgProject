import React, { Component } from 'react'
import { Input, InputGroup, InputGroupText, Button, Alert, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'



export default class insertSingle extends Component {


    state = {
        log: [],
        dataTypes: ["LanguageCode", "PageName", "ResourceCode", "Resource"],
        isOpen: false,
        
    }
    styleSheets = {
        main: {
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.2)",
            position: "fixed",
            zIndex: 2
        },
        container: {
            width: "35vw",
            height: 400,
            backgroundColor: "#fff",
            position: "absolute",
            inset: 0,
            margin: "auto",
            display: "grid",
            paddingLeft: "5%",
            alignItems: "center",
            borderRadius: 5,
            left: "10vw"

        },
        closeButton: {
            background: "transparent",
            border: "none",
            width: 30,
            height: 30,
            color: "#fff",
            position: "absolute",
            top: 30,
            right: 50
        },
        inputs: {
            width: "90%"
        },
        button: {
            width: "60%",
            marginLeft: "15%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none"
        },
        label: {
            width: 120,
            backgroundColor: "#333",
            color: "white",

            fontSize: 14
        },
        dataValidationContainer: {

            display: "grid",
            width: "25vw",
            height: 400,
            backgroundColor: "#fff",
            position: "absolute",
            margin: "auto",
            alignItems: "start",
            inset: 0,
            marginRight: "35vw"

        },
        readInputs: {
            width: "90%",
            height: "max-content",
            minHeight: 80,
            margin: "auto",
            wordBreak: "break-all"
        }

    }


    setLanguageCode = (entry) =>{

        let tempDataTypes = [...this.state.dataTypes]
        let tempLog = [...this.state.log]

        
        tempDataTypes[0] = tempLog[0] =  entry.target.innerText;
        
        this.setState({LanguageCode : entry.target.innerText,dataTypes : tempDataTypes,log : tempLog})
    }


    clearInputs = () => {
        const inputs = document.querySelectorAll(".Inputs")
        inputs.forEach(e => e.value = "")
        this.setState({ log: [] })
    }

    pushDataToTable = async data => {
        const { paths, url } = this.props
        const fetchUrl = url + paths.insert


        const tempData = data.filter((e) => e !== "" && e !== null && e !== undefined)


        if (tempData.length === 4) {


            

            let body = {
                LanguageCode: tempData[0],
                PageName: tempData[1],
                ResourceCode: tempData[2],
                Resource: tempData[3]
            }


            let options = {
                method: 'POST',
                headers: {
                    "Content-type": "Application/json"
                },
                body: JSON.stringify(body)
            }




            await fetch(fetchUrl, options)
                .then(resp => resp.json())
                .then(resp => resp.inserted ? alert("Log inserted successfully") : alert("Log cannot inserted"))





            this.props.setLogs()
        }
        else {
            alert("you must fill in all fields")
        }
    }


    toggle = () => {
        this.setState({ isOpen: !this.state.isOpen })
    }



    render() {
        const { main, container, closeButton, inputs, button, label, dataValidationContainer, readInputs } = this.styleSheets
        const { isInsert, setInsertState, setLogs } = this.props



        return (
            <div style={main} hidden={!isInsert}>
                <button
                    style={closeButton}
                    onClick={() => {
                        this.clearInputs()
                        setInsertState()
                    }}
                ><span className='material-symbols-outlined'>close</span></button>
                <div style={container}>
                    <form style={container}>
                        {this.state.dataTypes.map((e, index) => (index == 0 ? (

                            <div key={index}>
                                <Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
                                    <DropdownToggle caret>
                                    {e}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={this.setLanguageCode}>TR</DropdownItem>
                                        <DropdownItem onClick={this.setLanguageCode}>AR</DropdownItem>
                                        <DropdownItem onClick={this.setLanguageCode}>EN</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>)
                            : (
                                <InputGroup style={inputs} key={index} size="sm">
                                    <InputGroupText style={label}>{e}</InputGroupText>
                                    <Input
                                        className='Inputs'

                                        onChange={(e) =>{
                                            let newData = [...this.state.log]
                                            newData[index] = e.target.value
                                            this.setState({log : newData})
                                        } }
                                    />
                                </InputGroup>
                            )))}
                        <Button
                            size='sm'
                            type='button'
                            style={button}
                            color="success"
                            onClick={() => {
                                this.pushDataToTable(this.state.log);
                                setLogs();

                            }}

                        >
                            <span className='material-symbols-outlined'>add</span></Button>

                    </form>
                    <div style={dataValidationContainer}>
                        {this.state.log.length > 0 && (
                            this.state.log.map((e, index) => (
                                (e !== undefined && e !== null && (e.length > 0 && (
                                    <Alert readOnly={true} key={index} style={readInputs} color="primary">{this.state.dataTypes[index] + " : " + (index === 0 ? e.toUpperCase() : e)}</Alert>
                                )))

                            ))
                        )}
                    </div>
                </div>

            </div>
        )
    }
}
