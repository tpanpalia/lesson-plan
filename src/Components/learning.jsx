import React from "react";
import {
  IconButton,
  PrimaryButton,
  Link,
  Spinner,
  SpinnerSize,
  Modal
} from "office-ui-fabric-react";
import logo from "../Assets/logo.PNG";
import viewActivity from "../Assets/viewActivity.PNG";
import viewClassRoom from "../Assets/viewClassroom.PNG";
import ReactPlayer from "react-player";
import LearningObjectives from "./learningObjectives";
import "./learning.css";

class Learning extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLessonDetails: [],
      objectiveVideosDetails: [],
      objectiveClassFlow: "",
      objectiveActivity: [],
      activityModal: false,
      classFlowModal: false,
      videoStart: false,
      recitalTitle: "",
      instrumentTitle: "",
      lessonDetails: [],
      lessonStatusId: [],
      lessonClicked: false,
      isLoading: false,
      error: null
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    fetch("https://api.myjson.com/bins/qubzl")
      .then(response => response.json())
      .then(data =>
        this.setState(
          {
            recitalTitle: data.recitalTitle,
            instrumentTitle: data.instrumentTitle,
            lessonDetails: data.lessonDetails
          },
          () => {
            this.setState({ isLoading: false });
            this.getLessonStatus(null);
          }
        )
      )
      .catch(error => this.setState({ error, isLoading: false }));
  }

  // Funtion to get the status of the lesson (done) based on the status of the objectives.
  getLessonStatus = x => {
    let lessonStatus = [];
    for (let i = 0; i < this.state.lessonDetails.length; i++) {
      let objectiveStatus = [];
      for (
        let j = 0;
        j < this.state.lessonDetails[i].objectiveDetails.length;
        j++
      ) {
        let localStorageData = JSON.parse(
          localStorage.getItem(
            `${this.state.lessonDetails[i].objectiveDetails[j].id}`
          )
        );
        let statusData = {
          objectiveId: this.state.lessonDetails[i].objectiveDetails[j].id,
          done: localStorageData !== null ? localStorageData.done : false,
          notDoing:
            localStorageData !== null ? localStorageData.notDoing : false,
          nextClass:
            localStorageData !== null ? localStorageData.nextClass : false
        };
        objectiveStatus.push(statusData);
      }
      let objectiveStatusDataObject = {
        lessonId: this.state.lessonDetails[i].id,
        objectiveStatusArray: objectiveStatus
      };
      lessonStatus.push(objectiveStatusDataObject);
    }
    let lessonStatusIdCopy = [...this.state.lessonStatusId];
    for (let i = 0; i < lessonStatus.length; i++) {
      let statusId = lessonStatus[i].objectiveStatusArray.map(x => {
        return x.done;
      });
      let statusData = {
        id: lessonStatus[i].lessonId,
        status: statusId.every(x => x === true) ? 0 : 2
      };
      if (this.state.lessonClicked) {
        if (
          statusData.id === lessonStatusIdCopy[i].id &&
          lessonStatusIdCopy[i].id !== x.id
        ) {
          lessonStatusIdCopy[i].status = statusData.status;
        }
      } else {
        lessonStatusIdCopy.push(statusData);
      }
    }
    this.setState({ lessonStatusId: lessonStatusIdCopy });
  };

  //Function to get the objective details of selected lesson
  onLessonClick = x => {
    this.setState({
      selectedLessonDetails: x.objectiveDetails,
      lessonClicked: true,
      objectiveVideosDetails: []
    });
    let lessonStatusIdCopy = [...this.state.lessonStatusId];
    for (let i = 0; i < lessonStatusIdCopy.length; i++) {
      if (lessonStatusIdCopy[i].id === x.id) {
        lessonStatusIdCopy[i].status = 1;
      } else {
        if (lessonStatusIdCopy[i].status === 0) {
          lessonStatusIdCopy[i].status = 0;
        } else {
          lessonStatusIdCopy[i].status = 2;
        }
        this.getLessonStatus(x);
      }
    }
    this.setState({ lessonStatusId: lessonStatusIdCopy }, () =>
      this.getLessonStatus(x)
    );
  };

  //Function to get the video details of selected objective
  getObjectiveVideoDetails = videoDetails => {
    this.setState({ objectiveVideosDetails: videoDetails, videoStart: false });
  };

  //Function to get the Classflow details of selected objective (to be displayed in modal)
  getobjectiveClassFlow = classFlow => {
    this.setState({ objectiveClassFlow: classFlow });
  };

  //Function to get the activity details of selected objective (to be displayed in modal)
  getObjectiveActivity = activity => {
    this.setState({ objectiveActivity: activity });
  };

  //Function to set the styles for video thumbnail and when the video is played
  getStylesForVideo = (objectiveVideosDetailsLength, index, style) => {
    for (let i = 0; i < objectiveVideosDetailsLength; i++) {
      if (i === index) {
        if (this.state.videoStart) {
          if (style === "width") {
            return "70vw";
          } else {
            return "70vh";
          }
        } else {
          return "100px";
        }
      }
    }
  };

  //Function to change the color of the lesson button based on current selection and the status of objectives in the lesson
  getBackgroundColorForLesson = id => {
    for (let i = 0; i < this.state.lessonStatusId.length; i++) {
      if (this.state.lessonStatusId[i].id === id) {
        if (this.state.lessonStatusId[i].status === 0) {
          return "#6ac259";
        } else if (this.state.lessonStatusId[i].status === 1) {
          return "white";
        } else {
          return "#f9a73b";
        }
      }
    }
  };

  render() {
    const {
      selectedLessonDetails,
      objectiveVideosDetails,
      objectiveClassFlow,
      objectiveActivity,
      isLoading,
      error
    } = this.state;
    if (error) {
      return <p>{error.message}</p>;
    }

    return (
      <div>
        <Modal
          containerClassName="classFlowActivityModal"
          isOpen={this.state.activityModal}
          onDismiss={() => this.setState({ activityModal: false })}
          isBlocking={false}
        >
          {objectiveActivity.length > 0 ? (
            objectiveActivity.map((x, index) => {
              return (
                <div
                  style={{
                    margin: "2vw",
                    fontWeight: "bold",
                    fontSize: "20px"
                  }}
                  key={index}
                >
                  {x}
                </div>
              );
            })
          ) : (
            <div
              style={{ margin: "2vw", fontWeight: "bold", fontSize: "20px" }}
            >
              No data available
            </div>
          )}
        </Modal>
        <Modal
          containerClassName="classFlowActivityModal"
          isOpen={this.state.classFlowModal}
          onDismiss={() => this.setState({ classFlowModal: false })}
          isBlocking={false}
        >
          <div style={{ margin: "2vw", fontWeight: "bold", fontSize: "20px" }}>
            {objectiveClassFlow}
          </div>
        </Modal>
        {isLoading ? (
          <div style={{ marginTop: "45vh" }}>
            <Spinner SpinnerSize={SpinnerSize.large} />
          </div>
        ) : (
          <div style={{ backgroundColor: "#e6e7e8", height: "100vh" }}>
            <div style={{ height: "20vh", display: "flex" }}>
              <div style={{ width: "15vw", height: "20vh" }}>
                <img
                  style={{ marginTop: "1vw", marginLeft: "4vw" }}
                  src={logo}
                  alt="logo"
                />
              </div>
              <div style={{ width: "70vw", textAlign: "center" }}>
                <div
                  style={{
                    margin: "1vw",
                    fontSize: "35px",
                    fontFamily: "Sans-Serif",
                    fontWeight: "bold",
                    color: "#c8588c"
                  }}
                >
                  {this.state.recitalTitle}
                </div>
                <div style={{ textAlign: "center" }}>
                  <span style={{ fontSize: "24px", fontWeight: "bold" }}>
                    Lessons
                  </span>
                  {this.state.lessonDetails.map((x, index) => {
                    return (
                      <IconButton
                        style={{
                          margin: "1vw 1vw 0 1vw",
                          fontWeight: "bold",
                          color: "black",
                          height: "40px",
                          width: "40px",
                          fontSize: "20px",
                          borderRadius: "50%",
                          backgroundColor: this.getBackgroundColorForLesson(
                            x.id
                          ),
                          boxShadow:
                            "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
                        }}
                        onClick={() => {
                          this.onLessonClick(x);
                        }}
                        key={x.id}
                      >
                        {index + 1}
                      </IconButton>
                    );
                  })}
                </div>
              </div>
              <div
                style={{
                  width: "15vw",
                  height: "20vh",
                  textAlign: "right"
                }}
              >
                <div
                  style={{
                    fontFamily: "Sans-Serif",
                    fontWeight: "bold",
                    color: "#c8588c",
                    height: "42%",
                    margin: "1vw",
                    fontSize: "23px"
                  }}
                >
                  {this.state.instrumentTitle}
                </div>
                <div style={{ height: "24%", margin: "1vw" }}>
                  <PrimaryButton
                    onClick={() => {
                      alert("Session logged out !");
                    }}
                    style={{
                      backgroundColor: "#c82828",
                      height: "5vh",
                      width: "10vw",
                      color: "white",
                      boxShadow:
                        "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
                    }}
                    text="Exit Session"
                  />
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                height: "75vh",
                margin: "1vw",
                boxShadow:
                  "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
              }}
            >
              <div
                style={{
                  width: "15vw",
                  backgroundColor: "#ffd05b",
                  border: "solid #ffd05b",
                  overflow: "scroll"
                }}
              >
                <div
                  style={{
                    height: "5vh",
                    textAlign: "center",
                    margin: "1vw",
                    fontWeight: "bold",
                    fontSize: "20px",
                    borderBottom: "solid"
                  }}
                >
                  Menu
                </div>
                {objectiveVideosDetails.map((x, index) => {
                  return (
                    <div
                      style={{ textAlign: "center", margin: "1vw" }}
                      key={index}
                    >
                      <Link
                        target="_blank"
                        style={{ color: "black" }}
                        href={x.url}
                      >
                        <u>Video Link {index + 1}</u>
                      </Link>
                    </div>
                  );
                })}
                {selectedLessonDetails.map((x, index) => {
                  return (
                    <LearningObjectives
                      objectiveData={x}
                      key={x.id}
                      objectiveClassFlow={classFlow =>
                        this.getobjectiveClassFlow(classFlow)
                      }
                      objectiveActivity={activity =>
                        this.getObjectiveActivity(activity)
                      }
                      objectiveVideoDetails={videoDetails =>
                        this.getObjectiveVideoDetails(videoDetails)
                      }
                    />
                  );
                })}
              </div>
              <div
                style={{
                  borderBottom: "1px solid",
                  borderTop: "1px solid",
                  borderRight: "1px solid",
                  width: "83vw"
                }}
              >
                <div style={{ float: "right" }}>
                  <div style={{ margin: "1vw" }}>
                    <img
                      style={{ width: "150px", height: "100px" }}
                      src={viewActivity}
                      alt="activity"
                    ></img>
                  </div>
                  <div style={{ margin: "1vw" }}>
                    <PrimaryButton
                      onClick={() => {
                        this.setState({ activityModal: true });
                      }}
                      style={{
                        backgroundColor: "black",
                        width: "150px",
                        border: "solid black"
                      }}
                      disabled={this.state.objectiveVideosDetails.length === 0}
                      text="View Activity"
                    />
                  </div>
                  <div style={{ margin: "1vw" }}>
                    <img
                      style={{ width: "150px", height: "100px" }}
                      src={viewClassRoom}
                      alt="classFlow"
                    ></img>
                  </div>
                  <div style={{ margin: "1vw" }}>
                    <PrimaryButton
                      onClick={() => {
                        this.setState({ classFlowModal: true });
                      }}
                      style={{
                        backgroundColor: "black",
                        width: "150px",
                        border: "solid black"
                      }}
                      disabled={this.state.objectiveVideosDetails.length === 0}
                      text="View Classflow"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    position: "absolute",
                    bottom: "1vw"
                  }}
                >
                  {objectiveVideosDetails.map((x, index) => {
                    return (
                      <div key={index}>
                        <ReactPlayer
                          controls={true}
                          style={{ margin: "1vw" }}
                          onStart={() => this.setState({ videoStart: true })}
                          light={true}
                          url={x.url}
                          //playing={false}
                          loop={this.state.videoStart}
                          width={this.getStylesForVideo(
                            objectiveVideosDetails.length,
                            index,
                            "width"
                          )}
                          height={this.getStylesForVideo(
                            objectiveVideosDetails.length,
                            index,
                            "height"
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Learning;
