import React, { Component } from 'react'
import { Button } from 'reactstrap'
import './css/deleteValidation.css'
export default class deleteValidation extends Component {
  
  render() {
    

    return (
      <div className='deleteMainContainer' hidden={!this.props.isDelete}>
        <div className='validationBox'>
          <span className='validationBoxText'>Are you sure you want to delete ?</span>
          <div>
            
            <Button
              className='validationButtons'
              color='dark'
              onClick={()=>this.props.DeleteValidation()}
            ><span className='material-symbols-outlined'>close</span></Button>
            <Button
              className='validationButtons'
              color='danger'
              onClick={()=>{
                this.props.delete(this.props.log);
                this.props.DeleteValidation(!this.props.isDelete)
                this.props.setListedItemsCount();
              }}
            ><span className='material-symbols-outlined'>delete</span></Button>
          </div>
        </div>
      </div>
    )
  }
}
