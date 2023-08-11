import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';


//CSS files
import './App.css';

//Components
import DeleteValidation from './components/deleteValidation'
import Update from './components/update'
import Searcher from './components/searcher'
import Upload from './components/upload'
import Download from './components/download'
import Insert from './components/insertSingle'
import DownloadSelected from './components/downloadSelected'



export default class App extends Component {


  state = {
    logs: [],
    allLogs: [],
    lastIndex: null,
    isUpdate: true,
    notFound: true,
    isDelete: false,
    isUpload: true,
    isInsert: false,
    nextButtonState: false,
    backButtonState: true,
    selectedLog: [],
    currentPagelastId: null,
    currnetPageFirstId: null,
    search: false,
    searchLogs: 0,
    url: "http://localhost:4444",
    paths: {
      update: "/update/",
      delete: "/delete/",
      getAllLogs: "/logs",
      insert: "/insert"
    },
    pageIndexes: 0,
    currentPageLogs: [],
    hoverState: true,
    direction: true,
    page: 1,
    listedItemsCount: 10,
    isDownloadSelected: true
  }
  styleSheets = {
    insertLog: {
      width: 50,
      height: 40.5,
      position: "absolute",
      border: "none",
      left: 190,
      top: 52,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white"
    },
    nextButton: {
      position: "absolute",
      width: "5vw",
      height: "2.5vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "transparent",
      color: "#333",
      fontWeight: 700,
      border: "none",
      fontSize: "30px",
      left: "15vw"

    },
    nextButtonSpan: {

      fontSize: "30px",
      fontWeight: 700,
      color: "#333",

    },
    backButton: {
      position: "absolute",
      width: "5vw",
      right: "15vw",
      height: "2.5vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "transparent",
      color: "#333",
      fontWeight: 700,
      border: "none",
      fontSize: "30px"
    },
    backButtonSpan: {

      fontSize: "30px",
      fontWeight: 700,
      color: "#333"
    },
    emptyMainContainer: {
      width: "100vw",
      height: "100vh",
      position: "absolute",
      margin: "auto",
      inset: 0
    },
    buttons: {
      height: 100,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    counter: {
      width: "5vw",
      height: 40,
      position: "relative",

    },
    directionContainer: {
      width: "20vw",
      height: 100,
      position: "absolute",
      backgroundColor: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      left: "40vw"
    },
    copyButton: {
      position: "absolute",
      left: 260,
      height: 40,
      top: 52
    },
    materialSymbols: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: 20,
      height: 30,
      backgroundColor: "inherit"
    },
    table: {
      width: "90vw"
    },
    logData: {
      height: "100px"
    },
    singleLogData: {
      paddingLeft: "25px",
      paddingRight: "25px",
      wordBreak: "break-all"
    },
    updateMain: {
      position: "absolute",
      top: 0,
      left: "0px"
    },
    mainContainer: {
      display: "grid",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: "200px",
      width: "90vw",
      paddingLeft: "100px"
    }
  
  }
  resetNotFoundState = () => {
    this.setState({ notFound: true })
  }
  setInsertState = () => {
    const { isInsert } = this.state;
    this.setState({ isInsert: !isInsert })
  }
  searchLogs = async (input, sortParam) => {
    const { searchLogs } = this.state
    if (input.length > 0) {

      const { allLogs } = this.state
      const unHandledLogs = [...allLogs]
      let sortedLogs = []
      switch (sortParam) {
        case 0: {
          sortedLogs = unHandledLogs.filter((a) => `${a.Id}`.includes(input))
          break;
        }
        case 1: {
          sortedLogs = unHandledLogs.filter((a) => a.LanguageCode.toLowerCase().includes(input.toLowerCase()))
          break;
        }
        case 2: {
          sortedLogs = unHandledLogs.filter((a) => a.PageName.toLowerCase().includes(input.toLowerCase()))
          break;
        }
        case 3: {
          sortedLogs = unHandledLogs.filter((a) => a.ResourceCode.toLowerCase().includes(input.toLowerCase()))
          break;
        }
        case 4: {
          sortedLogs = unHandledLogs.filter((a) => a.Resource.toLowerCase().includes(input.toLowerCase()))
          break;
        }
        default: {
          break;
        }
      }
      if (sortedLogs.length > 0) {


        this.setState({
          allLogs: sortedLogs,
          notFound: true,
          search: true,
          pageIndexes: 0,
          listedItemsCount: sortedLogs.length < 10 ? sortedLogs.length : 10,
          backButtonState: true,
          nextButtonState: sortedLogs.length < 10 ? true : false
        },

          () => {
            this.setState({
              logs: sortedLogs.slice(searchLogs, searchLogs + 10)
            })
          })

      }
      else {
        this.getLogs()
        this.setState({ notFound: false })
      }
    }
    else {
      this.setLogsAsFirstPage()
      this.setState({ search: false,nextButtonState : false })
    }
  }
  removeLogFromDB = log => {
    const { url, paths, logs } = this.state

    let newLogs = [...logs]
    newLogs = newLogs.filter(e => e.Id !== log.Id)
    this.setState({ logs: newLogs })
    let fetchUrl = url + paths.delete + log.Id
    fetch(fetchUrl).then(resp => resp.json())
    .then(() => { alert("removed successfully") })
    .then(() => this.getLogs())
    .then(() => { if (this.state.logs.length === 0) { this.getFirstLogs() } })

  }
  setDeleteState = () => {
    const { isDelete } = this.state
    this.setState({ isDelete: !isDelete })
  }

  setListedItemsCount = () =>{
    this.setState({listedItemsCount : this.state.listedItemsCount >= this.state.allLogs.length ? this.state.listedItemsCount - 1 : this.state.listedItemsCount})
  }


  sortLogsByResourceCode = (sortParameter) => {
    const { allLogs, pageIndexes } = this.state
    const sortedLogs = [...allLogs]

    switch (sortParameter) {
      case 1: {
        sortedLogs.sort((a, b) => a.Id - b.Id)
        this.setState({
          logs: sortedLogs.slice(pageIndexes, pageIndexes + 10),
          allLogs: sortedLogs
        })
        break
      }
      case 2: {
        sortedLogs.sort((a, b) => {
          if (a.LanguageCode < b.LanguageCode) return -1;
          if (a.LanguageCode > b.LanguageCode) return 1;
          return 0;
        });
        this.setState({
          logs: sortedLogs.slice(pageIndexes, pageIndexes + 10),
          allLogs: sortedLogs
        })
        break



      }
      case 3: {
        sortedLogs.sort((a, b) => {
          if (a.PageName < b.PageName) return -1;
          if (a.PageName > b.PageName) return 1;
          return 0;
        });
        this.setState({
          logs: sortedLogs.slice(pageIndexes, pageIndexes + 10),
          allLogs: sortedLogs
        })
        break
      }
      case 4: {
        sortedLogs.sort((a, b) => {
          if (a.ResourceCode.toLowerCase() > b.ResourceCode.toLowerCase()) return 1;
          if (a.ResourceCode.toLowerCase() < b.ResourceCode.toLowerCase()) return -1;
          return 0;
        });
        this.setState({
          logs: sortedLogs.slice(pageIndexes, pageIndexes + 10),
          allLogs: sortedLogs
        })
        break
      }
      case 5: {
        sortedLogs.sort((a, b) => {
          if (a.Resource.toLowerCase() > b.Resource.toLowerCase()) return 1;
          if (a.Resource.toLowerCase() < b.Resource.toLowerCase()) return -1;
          return 0;
        });
        this.setState({
          logs: sortedLogs.slice(pageIndexes, pageIndexes + 10),
          allLogs: sortedLogs
        })
        break
      }
      default: {
        break
      }
    }
  }
  getFirstLogs = () => {
    const { allLogs } = this.state;

    let tempArray = [];

    for (let i = 0; i < 10; i++) {
      tempArray.push(allLogs[i])
    }


    this.setState({
      logs: tempArray,
      backButtonState: true,
      nextButtonState: false
    })


  }

  setAllLogs = data =>{
    this.setState({allLogs : data})
  }
  getLogs = async () => {
    const { url, paths } = this.state
    let fetchUrl = url + paths.getAllLogs
    await fetch(fetchUrl).then(resp => resp.json()).then(resp => {
      this.setState({ lastIndex: resp.length }, () => {

      })
      this.setState({ allLogs: resp })
    })
  }
  setPageNext = () => {
    const { pageIndexes, allLogs, page, listedItemsCount } = this.state;
    const nextPageIndex = pageIndexes + 10;

    if (nextPageIndex < allLogs.length) {
      const tempArray = allLogs.slice(nextPageIndex, nextPageIndex + 10);
      this.setState({
        pageIndexes: nextPageIndex,
        page: page + 1,
        listedItemsCount: listedItemsCount + tempArray.length,
        logs: tempArray,
        backButtonState: nextPageIndex < 10,
        nextButtonState: nextPageIndex + 10 >= allLogs.length,
      });
    }
  };
  setPageBack = () => {
    const { pageIndexes, allLogs, page, listedItemsCount, logs } = this.state;
    const prevPageIndex = pageIndexes - 10
    if (prevPageIndex >= 0) {
      const tempArray = allLogs.slice(prevPageIndex, prevPageIndex + 10);
      this.setState({
        pageIndexes: prevPageIndex,
        listedItemsCount: listedItemsCount - logs.length,
        page: page - 1,
        logs: tempArray,
        nextButtonState: false,
        backButtonState: prevPageIndex < 10
      });
    }
  };
  async componentDidMount() {
    await this.getLogs()
    this.putLogsInTable();

  }
  setCurrentListMethod = element => {
    document.querySelectorAll(".listMethods").forEach(e => e.style.color = "#333")
    element.style.color = "rgb(29, 206, 41)"
  }
  setUpdateState = () => {
    const { isUpdate } = this.state
    this.setState({ isUpdate: !isUpdate })
  }
  putLogsInTable = () => {
    const { pageIndexes, allLogs } = this.state;
    let tempArray = [];
    if (allLogs.length > 0) {
      tempArray = allLogs.slice(0,10)
    }
    this.setState({ logs: tempArray,listedItemsCount : tempArray.length,nextButtonState : tempArray.length > 9 ? false : true });
  };
  setUploadState = () => {
    const { isUpload } = this.state;
    this.setState({ isUpload: !isUpload })
  }
  setLogsAsFirstPage = () => {
    const { url, paths } = this.state;
    fetch(url + paths.getAllLogs)
      .then(resp => resp.json())
      .then(resp => {
        this.setState({
          logs: resp.slice(0, 10),
          allLogs: resp,
          listedItemsCount: 10,
          pageIndexes: 0,
          backButtonState: true
        })

      })

  }

  




  setDownloadSelected = () => {
    this.setState({ isDownloadSelected: !this.state.isDownloadSelected })
  }
  render() {
    const {
      logs,
      selectedLog,
      allLogs,
      listedItemsCount,
      isDelete,
      nextButtonState,
      backButtonState,
      isDownloadSelected,
      isInsert,
      url,
      paths,
      search,
      notFound,
      isUpload,
      isUpdate
    } = this.state
    const {
      nextButton,
      backButton,
      insertLog,
      buttons,
      counter,
      directionContainer,
      copyButton,
      materialSymbols,
      nextButtonSpan,
      backButtonSpan,
      table,
      logData,
      singleLogData,
      updateMain,
      mainContainer,
      selectedButtonspan
    } = this.styleSheets
    return (

      <div>
        {logs.length > 0 && (
          <div>
            <DownloadSelected
              searchLogs={allLogs}
              isDownloadSelected={isDownloadSelected}
              setDownloadSelected={this.setDownloadSelected}
            />
            <Insert
              setInsertState={this.setInsertState}
              isInsert={isInsert}
              url={url}
              paths={paths}
              setLogs={this.setLogsAsFirstPage}
            />
            <Download
              logs={allLogs}
              search={search}
              setDownloadSelected={this.setDownloadSelected}
            />
            <Searcher
              searchLogs={this.searchLogs}
              logs={allLogs}
              notFound={notFound}
              reset={this.resetNotFoundState}
            />


            <div>
              <Button
                onClick={this.setDownloadSelected}
                color='warning'
                style={copyButton}
                title="Seçilenleri İndir"
              >
                <span
                  className='material-symbols-outlined'
                  style={materialSymbols}
                >
                  file_copy
                </span>

              </Button>
            </div>


            <div>
              <div>
                <Button
                  title='upload files'
                  className='uploadButton'
                  color='dark'
                  onClick={() => {
                    this.setUploadState()
                  }}
                >
                  <span
                    className='material-symbols-outlined'
                    style={materialSymbols}
                  >
                    upload_file
                  </span>
                </Button>
              </div>

              <div>
                <Button
                  title='insert single log'
                  style={insertLog}
                  color="success"
                  onClick={this.setInsertState}
                >
                  <span
                    className='material-symbols-outlined'
                    style={materialSymbols}
                  >
                    add
                  </span>
                </Button>
              </div>

            </div>



            <div
              className='mainContainer'
              style={mainContainer}
              hidden={!isUpload}
            >

              <div
                className='table'
                style={table}
              >
                {logs.length > 0 && (
                  <div>
                    <Table>
                      <thead>
                        <tr>
                          {Object.keys(logs[0]).map((e, index) => (
                            <th
                              key={index}
                              className="headerCol"
                            >
                              <h5
                                className={`listMethods lm-${index} headerCol`}
                                onClick={() => {
                                  this.sortLogsByResourceCode(index + 1);
                                  this.setCurrentListMethod(document.querySelector(`.lm-${index}`))
                                }}
                              >
                                {e}
                              </h5>
                            </th>
                          ))}
                          <th
                            style={{ textAlign: "center", wIdth: 50, position: "relative" }}
                          >
                            <h5>
                              Edit
                            </h5>
                          </th>
                          <th
                            style={{ textAlign: "center", wIdth: 50 }}
                          >
                            <h5>
                              Delete
                            </h5>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.length > 0 && (logs.map((e) => (
                          <tr
                            key={e.Id}
                            className='logData'
                            style={logData}
                          >
                            <td style={singleLogData}>{e.Id}</td>
                            <td style={singleLogData}>{e.LanguageCode}</td>
                            <td style={singleLogData}>{e.PageName}</td>
                            <td style={singleLogData}>{e.ResourceCode}</td>
                            <td style={singleLogData}>{e.Resource}</td>
                            <td
                              style={{ width: "3vw", position: "relative", left: "30px" }}
                            >
                              <Button
                                color='dark'
                                style={{ marginRight: 50 }}
                                onClick={() => {
                                  this.setUpdateState();
                                  this.setState({ selectedLog: e });
                                }}
                              >
                                <span
                                  className='material-symbols-outlined'
                                  style={materialSymbols}
                                >
                                  edit
                                </span>
                              </Button>
                            </td>
                            <td
                              style={{ width: "3vw", position: "relative" }}
                            >
                              <Button
                                color='danger'
                                onClick={() => {
                                  this.setState({ isDelete: !isDelete })
                                  this.setState({ selectedLog: e });
                                }}
                              >
                                <span
                                  className='material-symbols-outlined'
                                  style={materialSymbols}
                                >
                                  delete
                                </span>
                              </Button>
                            </td>
                          </tr>
                        )))}
                      </tbody>
                    </Table>
                    <div
                      style={directionContainer}
                    >
                      <div
                        style={buttons}
                      >
                        <Button
                          hidden={nextButtonState}
                          onClick={this.setPageNext}
                          style={nextButton}
                        >
                          <span
                            className="material-symbols-outlined rightArrow"
                            style={nextButtonSpan}
                          >
                            arrow_right_alt
                          </span>
                        </Button>
                      </div>


                      <span
                        style={counter}
                      >
                        {listedItemsCount}/{allLogs.length}
                      </span>


                      <div
                        style={buttons}
                      >
                        <Button
                          hidden={backButtonState}
                          onClick={this.setPageBack}
                          style={backButton}
                        >
                          <span
                            className="material-symbols-outlined rightArrow"
                            style={backButtonSpan}
                          >
                            arrow_left_alt
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>)}
              </div>
              <DeleteValidation
                DeleteValidation={this.setDeleteState}
                setListedItemsCount={this.setListedItemsCount}
                isDelete={isDelete}
                delete={this.removeLogFromDB}
                log={selectedLog}
              />
              <div
                className='updateMain'
                style={updateMain}
              >
                <Update
                  updateScreenState={this.setUpdateState}
                  isUpdate={isUpdate}
                  log={selectedLog}
                  getLogs={this.getLogs}
                  url={url}
                  paths={paths}
                  getFirstLogs={this.getFirstLogs}
                />
              </div>
            </div>
            <Upload
              isUpload={isUpload}
              setUploadState={this.setUploadState}
              paths={paths}
              url={url}
              allLogs={allLogs}
              getLogs={this.getLogs}
              setAllLogs={this.setAllLogs}
            />
          </div>
        )}
      </div>
    )
  }
}

