import React, { Component } from "react";
// import "../PetWindow/Petwindow.css";
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
import { Col, Row, Container } from "../Grid";
import Jumbotron from "../Jumbotron";
import happy from "../../images/sprites/phoebe-affection-happy.gif";
import meh from "../../images/sprites/phoebe-meh-4fps.gif";
import pissy from "../../images/sprites/phoebe-pissy.gif";
import sad from "../../images/sprites/phoebe-sad.gif";
import API from "../utils/API";
import "./PetWindow.css";


// part of sound test
// import upAudio from "../../sounds/up-todogotchi.mp3";


class PetWindow extends Component {

    state = {
        // should pull initial values from database, setting manually for now
        happiness: 5,
        energy: 3,
        imgSrc: happy,
        happinessPercent: 100,
        email: this.props.email,
        currentUserId: "",
        currentPetId: "",
        elapsedTime: 0,
        didTimerRunOut: false,
        remainingTime: 0,
        showGame: "card-body pt-0 d-none pt-10"
    };

    // sets appropriate image according to happiness level
    getAnimationState() {
        if (this.state.happiness > 9) {
            this.setState({ imgSrc: happy })
        } else if (this.state.happiness > 6) {
            this.setState({ imgSrc: meh })
        } else if (this.state.happiness > 3) {
            this.setState({ imgSrc: pissy })
        } else {
            this.setState({ imgSrc: sad })
        }
    };

    decrementRemainingTime = () => {
        var newRemainingTime = this.state.remainingTime - 1000;
        this.setState({ remainingTime: newRemainingTime });
    };

    setNewElapsedTime = () => {
        if (this.state.didTimerRunOut === false) {
            API.updateUser(this.state.currentUserId,
                {
                    remainingCountdownTime: this.state.remainingTime
                }
            )
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    console.log(err);
                })
        } else if (this.state.didTimerRunOut === true) {
            API.updateUser(this.state.currentUserId,
                {
                    remainingCountdownTime: 0
                }
            )
                .then(response => {
                    console.log(response);
                })
                .catch(err => {
                    console.log(err);
                })
        }
    };

    // determine and set current user ID in state
    setCurrentUser = () => {
        API.getUsers()
            .then(res => {
                // console.log(res.data[0]._id);
                var userResults = res.data
                var i;
                for (i = 0; i < userResults.length; i++) {
                    if (userResults[i].email === this.state.email) {
                        this.setState({ currentUserId: userResults[i]._id, currentPetId: userResults[i].userPets[0], elapsedTime: userResults[i].elapsedTime })
                        console.log(userResults[i]._id);
                        console.log(userResults[i].userPets[0])
                    }
                };

                this.setState({ remainingTime: this.state.elapsedTime });

                this.intervalRemaining = setInterval(() => {
                    this.decrementRemainingTime();
                    console.log("remaining elapsedTime (this.state.remainingTime): " + this.state.remainingTime);
                }, 1000);

                this.intervalStats = setInterval(() => {
                    this.getStats();
                    if (this.state.happiness === 12) {
                        this.setState({ showGame: "card-body pt-10" })
                    } else {
                        this.setState({ showGame: "card-body pt-0 d-none" })
                    };
                    // this.setState({ happiness: this.state.happiness - 1 });
                    // this.decrementHappiness();
                    this.getAnimationState();
                    this.setState({ happinessPercent: this.state.happiness * 100 / 12 });
                    // post new happiness stat to database
                    console.log("Happiness has decreased to: " + this.state.happiness);
                }, 500);


                setTimeout(() => {
                    this.decrementHappiness();
                    this.setState({ didTimerRunOut: true });
                    console.log("The countdown has finished");
                    this.intervalHappiness = setInterval(() => {
                        this.getStats();
                        // this.setState({ happiness: this.state.happiness - 1 });
                        this.decrementHappiness();
                        this.getAnimationState();
                        this.setState({ happinessPercent: this.state.happiness * 100 / 12 });
                        // post new happiness stat to database
                        console.log("Happiness has decreased to: " + this.state.happiness);
                    }, 7200000);
                    // for demonstration, set 7200000 above to whatever a minute is
                },

                    this.state.elapsedTime);
                this.getStats();
                console.log(this.state);
            })
            .catch(err => console.log(err));
    };

    getStats = () => {
        API.getPetStats(this.state.currentPetId)
            .then(res => {
                console.log(res);
                this.setState({ happiness: res.data.moodStatus, energy: res.data.energyLevel });
            }
            )
            .catch(err => console.log(err));
    };

    // API experimentation
    // experiment = () => {
    //     console.log("clicked experiment button");
    //     // API.getTodos()
    //     //     .then(res =>
    //     //         console.log(res.data)
    //     //         )
    //     //         .catch(err => console.log(err));

    //     API.getUsers()
    //         .then(res =>
    //             console.log(res.data)
    //         )
    //         .catch(err => console.log(err));
    // };

    // experiment2 = () => {
    //     console.log("clicked experiment 2 button");
    //     // API.getTodos()
    //     //     .then(res =>
    //     //         console.log(res.data)
    //     //         )
    //     //         .catch(err => console.log(err));

    //     // API.getUsers()
    //     // .then(res => {
    //     //     console.log(res);
    //     //    })
    //     //     .catch(err => console.log(err));

    //     // API.updateUser(this.state.currentUserId, 
    //     //    {
    //     //        userToDos: {
    //     //         listItem: "laugh maniacally",
    //     //         completionStatus: true,
    //     //         lastUpdated: new Date(Date.now())
    //     //        }
    //     //    })
    //     //     .then(response => {
    //     //         console.log(response);
    //     //     })
    //     //     .catch(err => {
    //     //         console.log(err);
    //     //     })
    //     // this.handleTodoSave();
    //     this.getStats();
    //     console.log(this.state);

    // };

    // API experimentation
    handleTodoSave = () => {
        var newToDo;
        var myCurrentUser = this.state.currentUserId;
        API.saveTodo({
            listItem: "ahhhhhhh",
            completionStatus: false,
            lastUpdated: new Date(Date.now())
        })
            .then(response => {
                console.log(response.data);
                newToDo = response.data;
                console.log("my currentUserId: " + myCurrentUser);
                API.updateUser(myCurrentUser,
                    {
                        $push:
                        {
                            userToDos: newToDo
                        }
                    }
                )
                    .then(response => {
                        console.log(response);
                    })
                    .catch(err => {
                        console.log(err);
                    })

            })
            .catch(err => {
                console.log(err);
            })
    };

    decrementHappiness = () => {

        var decreasedHappiness;
        API.getPetStats(this.state.currentPetId)
            .then(res => {
                decreasedHappiness = res.data.moodStatus - 1;
                console.log("Happiness decreased to " + decreasedHappiness);
                if (decreasedHappiness >= 0) {
                    API.saveHappiness(this.state.currentPetId,
                        {
                            moodStatus: decreasedHappiness
                        }
                    )
                        .then(response => {
                            console.log(response);
                        })
                        .catch(err => {
                            console.log(err);
                        })
                } else {
                    console.log("Pet is already the saddest.")
                }
            })
            .catch(err => console.log(err));
    };


    componentDidMount() {
        // this will likely need to have some kind of .then function - get current state from database, .then load database stat values accordingly. otherwise it will reflect default state set above and then switch.

        // get current happiness and energy stats from the database. 
        // this.loadStats();


        // REMEMBER TOMORROW: run setTimeout function only after this.setCurrentUser() runs, I think settimeout is running when it still thinks this.state.elapsedTime is the default 0 as defined above. Maybe a .then function?




        this.setCurrentUser();
        this.getStats();

        // setTimeout(() => {
        //     this.decrementHappiness();
        //     this.interval = setInterval(() => {
        //         this.getStats();
        //         // this.setState({ happiness: this.state.happiness - 1 });
        //         this.decrementHappiness();
        //         this.getAnimationState();
        //         this.setState({ happinessPercent: this.state.happiness * 100 / 12 });
        //         // post new happiness stat to database
        //         console.log("Happiness has decreased to: " + this.state.happiness);
        //     }, 1000);
        // },

        //     this.state.elapsedTime);




        // api experimentation

        console.log(this.state);

    };

    componentWillUnmount() {
        this.setNewElapsedTime();
        clearInterval(this.intervalRemaining);
        clearInterval(this.intervalHappiness);
        clearInterval(this.intervalStats);
    }

    // load user's current energy and happiness stats from database. may need to pass user's id or something, also not sure about data passed in this.setState
    //   loadStats = () => {
    //       API.getStats()
    //       .then(res =>
    //         this.setState({ happiness: res.happiness, energy: res.energy })
    //         )
    //         .catch( err => console.log(err));
    //   };




    // will track when energy is earned and update energy stat in database. this will likely live on the todo component once configured
    incrementEnergy = () => {
        this.setState({ energy: this.state.energy + 4 });

        // post new energy stat to database
        // API.saveEnergy({ energy: this.state.energy})
        //     .then(res => this.loadStats())
        //     .catch(err => console.log(err));


        console.log("Energy has increased to: " + this.state.energy);
    };

    // will track consumption of energy and update energy stat in database. will likely live in todo copmonent
    decrementEnergy = () => {

        API.getPetStats(this.state.currentPetId)
            .then(res => {
                console.log(res);
                if (res.data.energyLevel === 0) {
                    console.log("You have no energy to play!");
                } else {
                    var newEnergy = res.data.energyLevel - 1;
                    if (res.data.moodStatus >= 12) {
                        var newHappiness = 12
                    } else {
                        var newHappiness = res.data.moodStatus + 1;
                    };
                    console.log("Energy level decreased to " + newEnergy);
                    console.log("Happiness level increased to " + newHappiness);
                    API.saveEnergy(this.state.currentPetId,
                        {
                            moodStatus: newHappiness,
                            energyLevel: newEnergy
                        }
                    )
                        .then(response => {
                            console.log(response);
                            this.getStats();
                        })
                        .catch(err => {
                            console.log(err);
                        })
                }



            }
            )
            .catch(err => console.log(err));


        // if (this.state.energy > 0) {
        //     this.setState({ energy: this.state.energy - 1 });

        //     // post new energy stat to database. unsure if passing correct data
        //     // API.saveEnergy({ energy: this.state.energy})
        //     //     .then(res => this.loadStats())
        //     //     .catch(err => console.log(err));

        //     console.log("Energy has decreased to: " + this.state.energy);
        // } else {
        //     console.log("Energy is already fully depleted. Proof: " + this.state.energy)
        // }
    };

    // will increase pet's happiness when user plays with it/pets it
    // incrementHappiness = () => {
    //     if (this.state.happiness < 12) {
    //         this.setState({ happiness: this.state.happiness + 1 });

    //         // post new happiness stat to database. unsure if passing correct data
    //         // API.saveHappiness({ happiness: this.state.happiness })
    //         //     .then(res => this.loadStats())
    //         //     .catch(err => console.log(err));

    //         console.log("Happiness has increased to: " + this.state.happiness);
    //     } else {
    //         console.log("Pet's health is already full. Proof: " + this.state.happiness)
    //         // should maybe alert player that pet's happiness is full
    //     }

    // };

        //test for upAudio
        // upAudio
        // let upAudio = new Audio(upAudio);


        


    render() {
        return (
            <Container fluid>
                <Row>
                    {/* <Col size="md-12">
                        <Jumbotron>
                            <h2>Signed in as: {this.state.email}</h2>
                            <h2>Happiness: {this.state.happiness}</h2>
                            <h2>Energy: {this.state.energy}</h2>
                        </Jumbotron>
                    </Col> */}
                    {/* <Col size="md-12">
                        <img src={this.state.imgSrc} alt="Pet Gif" />
                    </Col> */}
                    {/* <Col size="md-3">
                        <button className="btn btn-primary" onClick={this.incrementEnergy}>
                            Add 4 Energy
                        </button>
                    </Col> */}

                    {/* <Col size="md-3">
                        <button className="btn btn-danger"
                            onClick={() => {
                                this.experiment();
                            }}>
                            Experiment
                        </button>
                    </Col>
                    <Col size="md-3">
                        <button className="btn btn-danger"
                            onClick={() => {
                                this.experiment2();
                            }}>
                            Experiment 2
                        </button>
                    </Col> */}
                    <Col size="md-4">
                    </Col>
                    <Col size="md-4">
                        <div class="card w-100 bg-transparent shadow rounded-pill">
                            <div class="card-body">
                                <CircularProgressbarWithChildren value={this.state.happinessPercent} minvalue={0}
                                    maxvalue={12} counterClockwise={true} styles={buildStyles({
                                        textColor: "red",
                                        pathColor: "turquoise",
                                        trailColor: "gold"
                                    })}>
                                    {/* Put any JSX content in here that you'd like. It'll be vertically and horizonally centered. */}

                                    <img
                                        style={{ width: 150, marginTop: -85 }}
                                        src={this.state.imgSrc}
                                        alt="Pet Gif"
                                    />

                                </CircularProgressbarWithChildren>
                            </div>
                            <div class="card-body pt-0">
                                <div class="text-center">
                                    <div>
                                        <strong>Happiness:</strong> {(this.state.happinessPercent).toFixed(0)}%<br>
                                        </br> <p><strong>Energy:</strong> {this.state.energy}/12</p>
                                    </div>
                                    <button className="btn btn-primary rounded-circle petButton"
                                        onClick={() => {
                                            this.decrementEnergy();
                                            // this.upAudio();
                                            // this.incrementHappiness();
                                        }}>
                                        Pet
                        </button>
                        {/* pet button used to be Pet/Play */}
                                </div>
                            </div>
                            
                            {/* <div class="card-body mb-3">
                            <div class="text-center">
                            <button className="btn btn-success"
                                onClick={() => {
                                    this.decrementEnergy();
                                    this.incrementHappiness();
                                }}>
                                Play/Pet
                        </button>
                        </div>
                            </div> */}
                        </div>
                        {/* <CircularProgressbar
                            value={this.state.happinessPercent}
                            minvalue={0}
                            maxvalue={12}
                            counterClockwise={true}
                            strokeWidth={50}
                            // styles={buildStyles({
                            // strokeLinecap: "butt"
                            styles={buildStyles({
                                textColor: "red",
                                pathColor: "turquoise",
                                trailColor: "gold"
                            })}

                        /> */}
                        <div class={this.state.showGame}>
                                <div class="text-center">
                                    <div>
                                        {/* minigame area */}
                                        {/* <a href="https://benmulhollandpsl.github.io/todogotfree/"" */}

                                        <button class="fancy" onClick={() => window.open("https://benmulhollandpsl.github.io/todogotfree/", 'targetWindow',
                                            `status=no,
                                    menubar=no,
                                    width=550,
                                    height=550`)
                                        }>MINI Game!</button>
                                        {/* return false;"Popup link</a>" */}
                                    </div>
                                </div>
                            </div>
                    </Col>
                    <Col size="md-4">
                    </Col>
                    <Col size="md-12">

                    </Col>
                </Row>
            </Container>
        );
    }

}

export default PetWindow;