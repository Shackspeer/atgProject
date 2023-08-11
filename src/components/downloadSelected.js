
import React, { Component } from 'react'
import { Table, Button } from 'reactstrap'
import * as XLSX from 'xlsx';
export default class downloadSelected extends Component {
    state = {
        selectedStates: {},
        selectedLogs: []
    }
    styleSheets = {
        mainContainer: {
            width: "100vw",
            height: "100vh",
            position: "fixed",
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 2
        },
        layoutContainer: {
            width: "80vw",
            height: "90vh",
            position: "absolute",
            margin: "auto",
            inset: 0,
            backgroundColor: "whitesmoke",
        },
        header: {
            width: "70vw",
            height: "8vh",
            backgroundColor: "#333",
            color: "#fff",
            position: "absolute",
            left: "5vw",
            top: "5vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"

        },
        queryTable: {
            width: "70vw",
            height: "80vh"
        },
        query: {
            fontSize: 12,
            width: "70vw",
            height: "inherit",
            wordBreak: "break-all",
            userSelect: "none",
            cursor: "pointer",
            whiteSpace: "pre"
        },
        tableBody: {
            position: "absolute",
            height: "50vh",
            left: "5vw",
            top: "20vh",
            width: "70vw",
            overflow: "hidden",
            overflowY: "scroll",
            backgroundColor: ""
        },
        copyButton: {
            width: "10vw",
            height: 40,
            position: "absolute",
            left: "20vw",
            bottom: "5vh"
        },
        selectButton: {
            width: "40px",
            height: "40px",
            position: "relative",
            top: 25,
            cursor: "pointer",
            userSelect: "none"
        },
        closeButton: {
            position: "absolute",
            background: "transparent",
            color: "#000",
            fontSize: 30,
            right: 50,
            top: 20,
            cursor: "pointer"
        },
        download: {
            width: "10vw",
            height: 40,
            backgroundColor: "#111",
            display: "flex",
            color: "#fff",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
            position: "absolute",
            left: "35vw",
            bottom: "5vh",
            cursor: "pointer"
        }
    }
    componentDidMount() {
        const { searchLogs } = this.props

        let tempArray = {};

        searchLogs.forEach(e => {
            tempArray[`${e.Id}`] = false
        })

        this.setState({ selectedStates: tempArray })

    }
    checkSelectedState = (entry, element) => {
        const { selectedStates, selectedLogs } = this.state
        let tempArray = {}

        tempArray = { ...selectedStates }


        tempArray[`${entry.Id}`] = !tempArray[`${entry.Id}`]



        this.setState({ selectedStates: tempArray }, () => {

            if (this.state.selectedStates[entry.Id]) {
                element.target.style.backgroundColor = "rgb(212, 212, 212)";
            }
            else {
                element.target.style.backgroundColor = "whitesmoke";
            }
            let tempArray = [...selectedLogs]

            if (this.state.selectedStates[entry.Id]) {
                tempArray.push(entry)
            }
            else {
                tempArray = tempArray.filter(e => e.Id !== entry.Id)
            }

            this.setState({ selectedLogs: tempArray })



        })
    }
    convertSelectionsToExcel = async () => {
        const { selectedLogs } = this.state

        if (selectedLogs.length > 0) {

            let tempData = [];

            selectedLogs.forEach(e => {
                tempData.push({ query: `insert into  [FORTUNA_CONSEPT].General.ResourceNewIB  values ('${e.LanguageCode}','${e.PageName}','${e.ResourceCode}','${e.Resource}')` })
            })




            const worksheet = XLSX.utils.json_to_sheet(tempData);
            let dateFormat = new Date().getTime();


            //  kolon genişliği ayarla
            worksheet["!cols"] = [
                { wch: 300 },
            ]




            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "tables");
            XLSX.writeFile(workbook, `${dateFormat}-resource.xlsx`);

        }
        else {
            const { searchLogs } = this.props;


            let tempData = [];


            searchLogs.forEach(e => {
                tempData.push({ query: `insert into  [FORTUNA_CONSEPT].General.ResourceNewIB  values ('${e.LanguageCode}','${e.PageName}','${e.ResourceCode}','${e.Resource}')` })
            })

            const worksheet = XLSX.utils.json_to_sheet(tempData);
            let dateFormat = new Date().getTime();


            //  kolon genişliği ayarla
            worksheet["!cols"] = [
                { wch: 300 },
            ]




            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "tables");
            XLSX.writeFile(workbook, `${dateFormat}-resource.xlsx`);



        }

    }
    copyQueries = () => {
        if (this.state.selectedLogs.length <= 0) {
            const elements = document.querySelectorAll(".query")
            let queryText = ""


            elements.forEach((entry) => {
                queryText = queryText + "\n" + entry.innerText
            })
            navigator.clipboard.writeText(queryText).then(() => alert("Table copied successfully"))
        }
        else {
            const { selectedLogs } = this.state;

            let queryText = ""

            selectedLogs.forEach(e => {
                queryText = queryText + "\n" + `insert into [FORTUNA_CONSEPT].General.ResourceNewIB values (${e.LanguageCode},${e.PageName},${e.ResourceCode},${e.Resource})`
            })

            navigator.clipboard.writeText(queryText).then(() => alert("Selected queries copied successfully"))
        }
    }
    
    render() {
        const { mainContainer, layoutContainer, header, queryTable, query, tableBody, copyButton, closeButton, download } = this.styleSheets
        const { isDownloadSelected, searchLogs, setDownloadSelected } = this.props



        return (
            <div style={mainContainer} hidden={isDownloadSelected}>
                <span className='material-symbols-outlined' style={closeButton} onClick={setDownloadSelected}>close</span>
                <div style={layoutContainer}>
                    <div>
                        <Table style={queryTable}>
                            <thead>
                                <tr style={header}>
                                    <th>Query Codes</th>
                                </tr>
                            </thead>
                            <tbody style={tableBody}>
                                {searchLogs.length > 0 && (
                                    searchLogs.map((e, index) => (

                                        <tr key={index}>
                                            <td
                                                style={query} className="query"
                                                onClick={(a) => {
                                                    this.checkSelectedState(e, a)
                                                }}

                                            >


                                                <p style={{ pointerEvents: "none", display: "flex" }}><span style={{ color: "red" }}>insert into</span> [FORTUNA_CONSEPT].General.ResourceNewIB  <span style={{ color: "red" }}>values</span> ('{e.LanguageCode}','{e.PageName}','{e.ResourceCode}','{e.Resource}')</p>
                                            </td>
                                        </tr>



                                    ))
                                )

                                }
                            </tbody>
                        </Table>
                        <Button
                            style={copyButton}
                            onClick={this.copyQueries}
                            color="dark"
                        >Copy</Button>
                        <span
                            className='material-symbols-outlined'
                            style={download}
                            onClick={this.convertSelectionsToExcel}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#222"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "#111"}
                        >download</span>
                    </div>
                </div>
            </div>
        )
    }
}
