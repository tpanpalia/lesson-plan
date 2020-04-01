import React, { Component } from "react";
import { IconButton } from "office-ui-fabric-react";

class LearningObjectives extends Component {
  constructor(props) {
    super(props);
    this.state = {
      done: false,
      notDoing: false,
      nextClass: false
    };
  }

  componentDidMount() {
    try {
      let objectiveStatus = JSON.parse(
        localStorage.getItem(`${this.props.objectiveData.id}`)
      );
      if (objectiveStatus === null) return undefined;
      this.setState({
        done: objectiveStatus.done,
        notDoing: objectiveStatus.notDoing,
        nextClass: objectiveStatus.nextClass
      });
    } catch (e) {
      alert(e);
      return undefined;
    }
  }

  componentDidUpdate() {
    try {
      localStorage.setItem(
        `${this.props.objectiveData.id}`,
        JSON.stringify(this.state)
      );
    } catch (e) {
      alert(e);
    }
  }

  //Function to set the color of the objective border based on Done, NotFoing and NextClass
  borderForObjective = () => {
    if (this.state.done) {
      return "#6ac259";
    } else if (this.state.notDoing) {
      return "#f05228";
    } else if (this.state.nextClass) {
      return "#017296";
    } else {
      return "white";
    }
  };

  render() {
    return (
      <div
        style={{
          margin: "1vw",
          backgroundColor: "white",
          borderRadius: "4%",
          border: "5px solid",
          borderColor: this.borderForObjective(),
          cursor: "pointer"
        }}
        onClick={() => {
          this.props.objectiveVideoDetails(
            this.props.objectiveData.objectiveVideosDetails
          );
          this.props.objectiveClassFlow(this.props.objectiveData.classFlow);
          this.props.objectiveActivity(this.props.objectiveData.activities);
        }}
      >
        <div style={{ margin: "1vw", fontWeight: "bold", textAlign: "center" }}>
          {this.props.objectiveData.title} (
          {this.props.objectiveData.durationInMinutes} Mins)
        </div>
        <div style={{ display: "flex", marginLeft : '-0.7vw' }}>
          <IconButton
            iconProps={{ iconName: "CheckMark" }}
            onClick={() => {
              this.setState({ done: true, notDoing: false, nextClass: false });
            }}
            style={{
              margin: "1vw 1vw 0 1vw",
              height: "30px",
              width: "30px",
              color: "white",
              borderRadius: "50%",
              backgroundColor: "#6ac259",
              boxShadow:
                "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
            }}
          />
          <IconButton
            iconProps={{ iconName: "Clear" }}
            onClick={() => {
              this.setState({ done: false, notDoing: true, nextClass: false });
            }}
            style={{
              margin: "1vw 1vw 0 1vw",
              height: "30px",
              width: "30px",
              color: "white",
              borderRadius: "50%",
              backgroundColor: "#f05228",
              boxShadow:
                "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
            }}
          />
          <IconButton
            iconProps={{ iconName: "Edit" }}
            onClick={() => {
              this.setState({ done: false, notDoing: false, nextClass: true });
            }}
            style={{
              margin: "1vw 1vw 0 1vw",
              height: "30px",
              width: "30px",
              color: "#ffd05b",
              borderRadius: "50%",
              backgroundColor: "#017296",
              boxShadow:
                "0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)"
            }}
          />
        </div>
      </div>
    );
  }
}

export default LearningObjectives;
