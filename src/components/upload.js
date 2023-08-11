
import React, { Component } from "react";
import { Button, FormGroup, Input, Table } from "reactstrap";
import * as XLSX from 'xlsx';


export default class Upload extends Component {
    state = {
        xlsxData: [],
        fileName: '',
        xlsxIndexes: 0,
        singleXLSX: [],
        backButtonState: true,
        nextButtonState: false,
        listedItemCount: 10
    };

    styleSheets = {
        uploadButton: {
            margin: "0px 10px 10px 10px",
            userSelect: "none"

        },
        cleanButton: {
            margin: "0px 10px 10px 10px",
            userSelect: "none"
        },
        directionButtons: {
            bottom: -130,
            width: "10vw",
            height: 100,
            position: "absolute",
            left: "40vw",
            display: "flex",
            justifyContent: "center",
            userSelect: "none"
        },
        button: {
            background: "transparent",
            color: "#333",
            border: "none",
            userSelect: "none"


        },
        buttonSpan: {
            fontSize: 30,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 700,
            userSelect: "none"
        },
        uploadMain: {
            width: "100vw",
            height: "100vh",
            backgroundColor: "#fff",
            position: "fixed",
            zIndex: 1,
            overflow: "scroll",
            overflowX: "hidden",
            display: "grid",
            justifyContent: "center",
            userSelect: "none"
        },
        fileInput: {
            position: "absolute",
            top: 10,
            left: 0,
            width: "30vw",
            left: "35vw",
            height: 35,
            userSelect: "none"
        },
        closeButton: {
            position: "absolute",
            left: 20,
            fontSize: 30,
            top: 10,
            cursor: "pointer",
            userSelect: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "max-content",
            backgroundColor: "#333",
            color: "#fff",
            borderRadius: 30,
            height: 40
        },
        previewTable: {
            position: "absolute",
            top: 200,
            left: "5vw",
            width: "80vw",
            userSelect: "none"
        },
        transactionButtons: {
            position: "absolute",
            display: "flex",
            alignItems: "center",
            width: 300,
            height: 100,
            right: -250,
            userSelect: "none"
        },
        announcer: {
            position: "absolute",
            display: "flex",
            alignItems: "center",
            width: 300,
            height: 100,
            userSelect: "none"

        },
        nextButton: {
            width: "5vw",
            position: "absolute",
            left: "10vw",
            background: "transparent",
            color: "#333",
            border: "none",
            display: "flex",
            justifyContent: "center",
            userSelect: "none"

        },
        backButton: {
            position: "absolute",
            right: "10vw",
            background: "transparent",
            color: "#333",
            border: "none",
            width: "5vw",
            display: "flex",
            justifyContent: "center",
            userSelect: "none"
        },
        tableItems: {
            wordBreak: "break-all",
            height: 100,
            userSelect: "none"
        },
        viewedPages: {
            position: "absolute",
            bottom: 35,
            right : 760
        }
    }








    setNextXLSX = () => {
        const { xlsxData, xlsxIndexes } = this.state

        const nextPageXLSX = xlsxIndexes + 10;

        if (nextPageXLSX < xlsxData.length) {
            const tempArray = xlsxData.slice(nextPageXLSX, nextPageXLSX + 10)
            this.setState({
                xlsxIndexes: nextPageXLSX,
                listedItemCount: this.state.listedItemCount + tempArray.length,
                singleXLSX: tempArray,
                backButtonState: nextPageXLSX < 10,
                nextButtonState: nextPageXLSX + 10 >= xlsxData.length
            }, () => console.log(this.state.xlsxIndexes))
        }
    }


    setPrevXLSX = () => {
        const { xlsxData, xlsxIndexes } = this.state


        const prevPageXLSX = xlsxIndexes - 10;

        if (prevPageXLSX >= 0) {
            const tempArray = xlsxData.slice(prevPageXLSX, prevPageXLSX + 10)

            this.setState({
                xlsxIndexes: prevPageXLSX,
                listedItemCount: this.state.listedItemCount - this.state.singleXLSX.length,
                singleXLSX: tempArray,
                backButtonState: prevPageXLSX < 10,
                nextButtonState: false
            }, () => console.log(this.state.singleXLSX))
        }
    }


    componentDidMount() {
        document.addEventListener("keydown", (event) => {
            if (!this.props.isUpload) {
                if (event.key === "Escape") this.props.setUploadState(!this.props.isUpload)
            }
        })
    }



    handleFile = (event) => {
        const file = event.target.files[0];
        if (file.name.includes(".xlsx"))
            this.convertExcelToJson(file);
        else {
            alert("Sadece xlsx uzantılı dosyalar listelenir")
        }
    };



    clearInput = () => {
        document.querySelector(".fileInput").value = ""
        this.setState({
            xlsxData: [],
            fileName: '',
            xlsxIndexes: 0,
            singleXLSX: [],
            backButtonState: true,
            nextButtonState: false
        }, () => this.props.getLogs())
    }








    pushDataToTable = data => {
        const { paths, url } = this.props
        const fetchUrl = url + paths.insert
        data.forEach((e) => {
            let body = {
                LanguageCode: e.LanguageCode,
                PageName: e.PageName,
                ResourceCode: e.ResourceCode,
                Resource: e.Resource
            }


            let options = {
                method: 'POST',
                headers: {
                    "Content-type": "Application/json"
                },
                body: JSON.stringify(body)
            }




            fetch(fetchUrl, options).then(resp=>resp.json()).then(resp=>console.log(resp))
        })
        alert("File inserted to database successfully")
        this.clearInput()
    }


    


    

    convertExcelToJson = (file) => {


        try {
            const reader = new FileReader();


            reader.onload = (event) => {
                let data = event.target.result;
                let workbook = XLSX.read(data, { type: 'binary' });
                let tempData = [];


                workbook.SheetNames.forEach((entry) => {
                    let worksheet = workbook.Sheets[entry];
                    let xlsxData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
                    tempData.push(xlsxData);
                    console.log(xlsxData);
                });



                this.setState({
                    xlsxData: tempData[0],
                }, () => {
                    let tempArray = []
                    for (let i = 0; i < 10; i++) {
                        tempArray.push(this.state.xlsxData[i])
                    }
                    this.setState({
                        singleXLSX: this.state.xlsxData.slice(0, 10),
                        nextButtonState: this.state.xlsxData.length > 10 ? false : true
                    })

                });
            };
            reader.readAsBinaryString(file);
        }
        catch (err) {
            alert("Yuklenen dosya xlsx olmalı")
        }
    };

    render() {
        const { xlsxData, nextButtonState, backButtonState, singleXLSX } = this.state;
        const {
            uploadButton,
            cleanButton,
            directionButtons,
            buttonSpan,
            uploadMain,
            fileInput,
            closeButton,
            previewTable,
            transactionButtons,
            announcer,
            nextButton,
            backButton,
            tableItems,
            viewedPages
        } = this.styleSheets

        return (
            <div style={uploadMain} hidden={this.props.isUpload}>


                <Button color="transparent" style={closeButton} onClick={() => { this.props.setUploadState(); this.clearInput() }}>
                    <span
                        className="close material-symbols-outlined"
                    >
                        undo
                    </span>
                </Button>
                <div className="uploadContainer">
                    <FormGroup>
                        <Input
                            className="fileInput"
                            type="file"
                            id="fileInput"
                            onChange={this.handleFile}
                            accept=".xlsx"
                            style={fileInput}
                        />
                    </FormGroup>
                    {singleXLSX.length > 0 && (
                        <div className="previewTable" style={previewTable}>
                            <Table>
                                <thead>
                                    <tr>
                                        {Object.keys(singleXLSX[0]).map((e, index) => (
                                            <th key={index} className="xlsxTableHeaders">{e}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(singleXLSX).map((e, index) => (
                                        <tr key={index} style={index == 0 ? { width: 100, height: 100 } : tableItems}>
                                            {Object.values(e).map((j, key) => (
                                                <td
                                                    key={key}
                                                    className="uploadTableItem"
                                                >{j}</td>

                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            <div className="pushButtons" style={transactionButtons}>
                                <div style={viewedPages}>
                                    {
                                        this.state.xlsxData.length > 0 && (
                                            <div>
                                                {this.state.listedItemCount}/{this.state.xlsxData.length}
                                            </div>
                                        )
                                    }

                                </div>
                                <Button
                                    color="success"
                                    onClick={() => { this.pushDataToTable(xlsxData) }}
                                    style={uploadButton}
                                >Upload</Button>
                                <Button
                                    color="dark"
                                    onClick={this.clearInput}
                                    style={cleanButton}
                                >Clear</Button>
                            </div>
                            <span className="logAnnouncer" style={announcer}>
                                {xlsxData.length} adet kayıt girildi
                            </span>
                            <div style={directionButtons}>
                                <Button
                                    style={backButton}
                                    onClick={this.setPrevXLSX}
                                    hidden={backButtonState}
                                ><span className="material-symbols-outlined" style={buttonSpan}>arrow_left_alt</span></Button>
                                <Button
                                    style={nextButton}
                                    onClick={this.setNextXLSX}
                                    hidden={nextButtonState}
                                ><span className="material-symbols-outlined" style={buttonSpan}>arrow_right_alt</span></Button>
                            </div>
                        </div>

                    )}

                </div>
            </div>
        );
    }
}
