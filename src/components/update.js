
import React, { Component } from 'react'
import { Alert, Button } from 'reactstrap'
import './css/update.css'
export default class update extends Component {
    

    state = {
        logData : {},
        inserted : false,
    }

    styleSheets = {
        logData : {
            overflow : "auto",
            width : "50%",
            padding : 50
        }
    }

    componentDidMount() {
        


        document.addEventListener("keydown", (event) => {
            if (!this.props.isUpdate) {
                if (event.key === "Escape") this.props.updateScreenState()
            }
        })
    }

    
    updateTexts = () =>{
        


        const elements = document.querySelectorAll(".data")
        const inputs = document.querySelectorAll(".updateBoxes")

        let data = [];


        inputs.forEach(e=>data.push(e.value))

        
        elements.forEach((e,index)=>{
            console.log(data[index])
            e.innerText =  data[index] !== "" ? data[index] : Object.values(this.props.log)[index + 1]
        })
    }


    updateUser = async () =>{
        const { url,paths } = this.props

        const elements = document.querySelectorAll(".updateBoxes")
        const { log } = this.props
        const { logData } =this.state
        console.log(log)
        let tempArray = {
            LanguageCode : log.LanguageCode,
            PageName : log.PageName,
            ResourceCode :  log.ResourceCode,
            Resource : log.Resource
        }
        

        elements.forEach((e,index)=>{
            
            
            if((e.value.trim() !=="")){
            

                let key = Object.keys(tempArray)[index];
                tempArray[key] = e.value
               
                
            }
        })
       

        this.setState({inserted : !this.state.inserted})



        
        
        let options = {
            method : "POST",
            headers : {
                "Content-type" : "Application/json"
            },
            body : JSON.stringify(tempArray)
        }

        let fetchUrl = url + paths.update + log.Id
        
        await fetch(fetchUrl,options)
        .then(resp=>resp.json())
        .then(resp=>{resp.updateState ? alert("Updated successfully") : alert("an error occured")})
        .then(this.updateTexts)
        .then(this.props.getLogs)
         
    }

   





    render() {


        const { logData } = this.styleSheets
        const { updateScreenState, isUpdate, log } = this.props
        

        return (




            <div
                className='updateMainContainer'
                hidden={isUpdate}
            >
                <span className='material-symbols-outlined icon'
                    onClick={() => {
                        updateScreenState(!isUpdate)
                    }}
                >close</span>
                <div className='updateContainer'>
                    <div className='logData' style={logData}>
                        {Object.keys(log).map((e, index) => (
                            <p
                                
                                style={{ fontWeight: 700 }}
                                key={index}
                            >{e.charAt(0).toUpperCase() + e.slice(1).toLowerCase() + " : "}<span className={index > 0 ? "data" : "id"} style={{ fontWeight: 500 }}>{Object.values(log)[index]}</span></p>
                        ))}
                    </div>


                    <div className='updateInput'>
                        {Object.values(log).map((e, index) => (
                            index != 0 && (
                                <input
                                key={index}
                                className={index > 0 ? 'updateBoxes' : "Id"}
                                style={{ outline: "none" }}
                                placeholder={e}
                            />
                            )
                        ))}

                        <Button
                            className='updateButton'
                            color={"dark"}
                            onClick={()=>{this.updateUser();}}
                        ><span className='material-symbols-outlined'>edit</span></Button>
                    </div>

                </div>
            </div>
        )
    }
}
