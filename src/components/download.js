import React, { Component } from 'react'
import { Button } from 'reactstrap'
import * as XLSX from 'xlsx';


export default class download extends Component {



    // internal(dosya içi) CSS

    styleSheets = {
        mainContainer: {
            width: 100,
            height: 50,
            backgroundColor: "#fff",
            position: "absolute",
            left: 120,
            top:52.5
        },
        downloadButton: {
            width : 50,
            height: 40,
            display : "flex",
            justifyContent : "center",
            alignItems : "center"
        },
        buttonSpan : {
            display : "flex",
            justifyContent : "center",
            alignItems : "center"
        }
    }
    convertJsonToExcel = data =>{
        
        const worksheet = XLSX.utils.json_to_sheet(data);
        
        
        let dateFormat = new Date().getTime()
        
        
        
        worksheet["!cols"] = [ //
            {wch : 10},        //
            {wch : 10},        // 
            {wch : 100},       // Kolon genişliklerini ayarlar 
            {wch : 70},        //
            {wch : 70}         //
        ]                      //




        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook,worksheet,"tables");
        XLSX.writeFile(workbook,`${dateFormat}-resource.xlsx`);
    }
    render() {

        const { mainContainer,downloadButton,buttonSpan} = this.styleSheets;
        const { logs,search } = this.props
        return (
            <div
                style={mainContainer}>
                <Button

                    color='secondary'
                    style={downloadButton}
                    title="Download table"
                    onClick={()=>this.convertJsonToExcel(logs) }
                ><span className='material-symbols-outlined' style={buttonSpan}>download</span></Button>
            </div>
        )
    }
}
