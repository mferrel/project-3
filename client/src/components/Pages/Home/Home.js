import React from "react";
import PetWindow from "../../PetWindow/PetWindow";
import TodoList from "../../TodoList/TodoList";
import API from "../../utils/API";
import { Col, Row, Container } from "../../Grid";
import HowToPlay from "../../HowToPlay/HowToPlay.js";
import github from "../../../images/background/github.png"
import { Button, Modal } from "react-bootstrap";
 
// can import css from elsewhere, 

// this  is our homepage which displays pet after login screen
// showing animal chosen (when theres an option), its name, 
// a todo list that is (user made or could use a dropdownmenu with point values assigned such as work, fun, family etc, then allows user to type the specific task)
// showing health meter/happiness meter/hunger? of pet
// when happyness (or hunger?) level is sated it triggers a happiness event, (access to a minigame) which returns a change to the pet (increased happy, etc

class Home extends React.Component {
  state = {
    // using following state values to track/identify current user ID
    email: this.props.auth.email
  };

  updateLoginDate = () => {
    API.updateLogout(this.state.email).then(response => {
      console.log(response);
    }).catch(err => console.log(err));
  };

  componentWillMount() {
    API.calculateLogin(this.state.email).then(response => {
      console.log(response);
    }).catch(err => console.log(err));
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.updateLoginDate, false);
  }


  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.updateLoginDate, false);
    this.updateLoginDate();
  }

  render() {
    console.log(this.state);

    return (
      <div>
        <br>
        </br>
        <Container fluid>
          <Row>
            <Col size="md-6">

              <TodoList email={this.state.email} />
              <div class="pt-2">
                <HowToPlay />
              </div>
            </Col>
            <Col size="md-6">
              <PetWindow email={this.state.email} />
            </Col>
          </Row>
        </Container>

        <footer>
        <div className="footer-center" align="center">
          <h6>Proudly Built Using React.js</h6>
          <a href="https://github.com/zachyingling/project-3"><img src= {github} height= "50px" width= "50px" align="center"/></a>
          </div>
      </footer>
      </div>
    );
  }
}

export default Home;


