import React, { Component } from 'react'
import { Container,Dropdown,DropdownItem,DropdownMenu,DropdownToggle,Input } from 'reactstrap'
import './css/searcher.css'
export default class searcher extends Component {
  
    
    state = {
        inputValue : '',
        logs : this.props.logs,
        dropDownIsOpen : false,
        defaultFilterText : '<SearchOption>',
        sections : ["Id","LanguageCode","PageName","ResourceCode","Resource"],
        selectedListMethod : 0
    }


   
    

    handleInput =  async (element,sortParams)=>{
       
        this.props.searchLogs(element.target.value,sortParams)
        console.log(this.state.selectedListMethod)
   } 

    handleDefaultFilterText = index =>{
      this.setState({defaultFilterText : this.state.sections[index]})
      this.setState({selectedListMethod : index})
    }
    

    openFilterList = () =>{
      this.setState({dropDownIsOpen : !this.state.dropDownIsOpen})
    } 
   

  
    render() {
       

        const { inputValue } = this.state



    
    return (
      <div className='searchMain'>
        <div className='main'>
        
        <div className='searcher'>
            <Input onChange={(e)=>{this.handleInput(e,this.state.selectedListMethod)}} className='searchInput' placeholder='search(Default:Id)'></Input>
            <p hidden={this.props.notFound} className="announce">Aradığınız {this.state.sections[this.state.selectedListMethod]}  bulunamadı</p>
        </div>
        </div>
        <div className='filterSections'>
          <Dropdown isOpen={this.state.dropDownIsOpen} toggle={this.openFilterList} className="dropdown">
            <DropdownToggle color={"white"} outline={false} className="toggle">{this.state.defaultFilterText}</DropdownToggle>
            <DropdownMenu>
              {this.state.sections.map((e,index)=>(
                <DropdownItem 
                  key={index}
                  onClick={()=>{
                    this.props.reset();
                    this.handleDefaultFilterText(index)
                  }}
                >{e}</DropdownItem>
              ))}
            </DropdownMenu>
            
          </Dropdown>
        </div>

      </div>
      
    )
  }
}
