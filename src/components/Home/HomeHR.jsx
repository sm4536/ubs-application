import React, { Component } from "react";
import ls from "local-storage";
import { Container, Tab, Tabs } from "react-bootstrap";
import HeaderHR from "../Header/HeaderHR";
import HorizontalBarGraph from "../graphs/horizontalBarGraph";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

class HomeHR extends Component {

  constructor(props) {
    super(props);
    this.state = {
      batch_result: [],
      btnTitle: 'Batch Number',
      dataHorizontalGender: {
        labels: ["Male", "Female", "Other", "Prefer not to say"],
        datasets: [
          {
            label: 'Acceptance',
            data: [],
            fill: false,
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            stack: '2',
          },
          {
            label: 'Rejection',
            data: [],
            fill: false,
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            stack: '2',
          }
        ]
      },
      dataHorizontalEthnicity: {
        labels: ["American Indian", "Asian", "Black American", "Hispanic Latino", "Pacific Islander", "White", "Other", "Prefer not to say "],
        datasets: [
          {
            label: 'Acceptance',
            data: [],
            fill: false,
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            stack: '2',
          },
          {
            label: 'Rejection',
            data: [],
            fill: false,
            backgroundColor: [],
            borderColor: [],
            borderWidth: 1,
            stack: '2',
          }
        ]
      },

      barChartOptions: {
        scales: {
          xAxes: [{

            stacked: true,
          }],
          yAxes: [{

            stacked: true,
          }]
        }
      }

    };
    this.loadData = this.loadData.bind(this);

  }



  componentDidMount() {
    const token = ls.get("token");
    if (token === null || token === "") {
      window.location.href = "/login"
    }

    const reviewer_id = ls.get("userid")

    fetch("https://ubs-app-api-dev.herokuapp.com/api/v1/getAllBatches/" + reviewer_id + "/", {
      headers: {
        "Content-type": "application/json",
        "Authorization": token
      },
    })
      .then((res) => res.json())
      .then((res) => {
        this.setState({ batch_result: res.results });
        if (res.results.length > 0)
          this.loadData(res.results[0]["batch_no"])
        else
        this.loadData("")
      })


  }


  loadData(event) {
    const token = ls.get("token");
    if (token === null || token === "") {
      window.location.href = "/login"
    }
    const reviewer_id = ls.get("userid")
    const batchNo = event;

    const acceptBgColor = "rgba(29, 183, 40, 0.5)"
    const acceptBorderColor = "rgba(0,  150, 15, 1)"
    const rejectBgColor = "rgba(240, 30, 30, 0.5)"
    const rejectBorderColor = "rgba(220, 0, 0, 1)"
    const dataHorizontalGender = this.state.dataHorizontalGender;
    const dataHorizontalEthnicity = this.state.dataHorizontalEthnicity;
    var acceptance_gender = []
    var rejection_gender = []
    var acceptance_ethnicity = []
    var rejection_ethnicity = []
    var val = "Batch Number : " + event + " "
    var get_count=""
    var get_ethnicity=""

    if(event===""){
      get_count="https://ubs-app-api-dev.herokuapp.com/api/v1/getCount/" + reviewer_id + "/";
      get_ethnicity="https://ubs-app-api-dev.herokuapp.com/api/v1/getCountByEthnicity/" + reviewer_id + "/";
    }
    else{
      get_count="https://ubs-app-api-dev.herokuapp.com/api/v1/getCount/" + reviewer_id + "/" + batchNo + "/";
      get_ethnicity="https://ubs-app-api-dev.herokuapp.com/api/v1/getCount/Ethnicity/" + reviewer_id + "/" + batchNo + "/";
    }


    Promise.all([fetch(get_count, { headers: { "Content-type": "application/json", "Authorization": token } }),
    fetch(get_ethnicity, { headers: { "Content-type": "application/json", "Authorization": token } })])

      .then(([res1, res2]) => {
        return Promise.all([res1.json(), res2.json()])

      })
      .then(([res1, res2]) => {


        Object.keys(res1).forEach(function (key) {
          if (key === "accepted_male_count") {
            acceptance_gender.push(res1.accepted_male_count)
          }
          else {
            rejection_gender.push(res1.declined_male_count)
          }
          if (key === "accepted_female_count") {
            acceptance_gender.push(res1.accepted_female_count)
          }
          else {
            rejection_gender.push(res1.declined_female_count)
          }

          if (key === "accepted_other_count") {
            acceptance_gender.push(res1.accepted_other_count)
          }
          else {
            rejection_gender.push(res1.declined_other_count)
          }
          if (key === "accepted_undisclosed_count") {
            acceptance_gender.push(res1.accepted_undisclosed_count)
          }
          else {
            rejection_gender.push(res1.declined_undisclosed_count)
          }
        });

        dataHorizontalGender.datasets[0].data = acceptance_gender;
        dataHorizontalGender.datasets[0].backgroundColor = new Array(acceptance_gender.length).fill(acceptBgColor);
        dataHorizontalGender.datasets[0].borderColor = new Array(acceptance_gender.length).fill(acceptBorderColor);

        dataHorizontalGender.datasets[1].data = rejection_gender;
        dataHorizontalGender.datasets[1].backgroundColor = new Array(rejection_gender.length).fill(rejectBgColor);
        dataHorizontalGender.datasets[1].borderColor = new Array(rejection_gender.length).fill(rejectBorderColor);


        Object.keys(res2).forEach(function (key) {
          if (key === "accepted_american_indian_count") {
            acceptance_ethnicity.push(res2.accepted_american_indian_count)
          }
          else {
            rejection_ethnicity.push(res2.declined_american_indian_count)
          }
          if (key === "accepted_asian_count") {
            acceptance_ethnicity.push(res2.accepted_asian_count)
          }
          else {
            rejection_ethnicity.push(res2.declined_asian_count)
          }
          if (key === "accepted_black_american_count") {
            acceptance_ethnicity.push(res2.accepted_black_american_count)
          }
          else {
            rejection_ethnicity.push(res2.declined_black_american_count)
          }

          if (key === "accepted_hispanic_latino_count") {
            acceptance_ethnicity.push(res2.accepted_hispanic_latino_count)
          }
          else {
            rejection_ethnicity.push(res2.declined_hispanic_latino_count)
          }

          if (key === "accepted_pacific_islander_count") {
            acceptance_ethnicity.push(res2.accepted_pacific_islander_count)
          }
          else {
            rejection_ethnicity.push(res2.declined_pacific_islander_count)
          }

          if (key === "accepted_white_count") {
            acceptance_ethnicity.push(res2.accepted_white_count)
          }
          else {
            rejection_ethnicity.push(res2.declined_white_count)
          }

          if (key === "accepted_other_count") {
            acceptance_ethnicity.push(res2.accepted_other_count)
          }
          else {
            rejection_ethnicity.push(res2.declined_other_count)
          }

          if (key === "accepted_undisclosed_count") {
            acceptance_ethnicity.push(res2.accepted_undisclosed_count)
          }
          else {
            rejection_ethnicity.push(res2.declined_undisclosed_count)
          }

        });

        dataHorizontalEthnicity.datasets[0].data = acceptance_ethnicity;
        dataHorizontalEthnicity.datasets[0].backgroundColor = new Array(acceptance_ethnicity.length).fill(acceptBgColor);
        dataHorizontalEthnicity.datasets[0].borderColor = new Array(acceptance_ethnicity.length).fill(acceptBorderColor);

        dataHorizontalEthnicity.datasets[1].data = rejection_ethnicity;
        dataHorizontalEthnicity.datasets[1].backgroundColor = new Array(rejection_ethnicity.length).fill(rejectBgColor);
        dataHorizontalEthnicity.datasets[1].borderColor = new Array(rejection_ethnicity.length).fill(rejectBorderColor);

        this.setState({ dataHorizontalGender, dataHorizontalEthnicity })
        this.setState({ btnTitle: val });

      })
  }



  render() {
    let name = ls.get("name");
    return (
      <>
        <style type="text/css">
          {`

    .nav-style-title {
      font-size: xx-large;
    }
    .nav-style {
      font-size: x-large;
    }
        `}
        </style>
        <div>
          <HeaderHR />

          <br />
          <Container className="containbody justify-content-center">
            <br />
            <h1 className="text-center">{"Welcome " + name}</h1>
            <h4 className="text-center">HR Professional</h4> <br />
            <h5 className="text-center">
              View real applications and see where your biases lie statistically
            </h5>
            <br />
            <br />

            <DropdownButton id="dropdown-basic-button" title={this.state.btnTitle} onSelect={event => { this.loadData(event) }}>

              {this.state.batch_result.map((batch, i) => (
                <Dropdown.Item eventKey={batch.batch_no} value={batch.batch_no}>{batch.batch_no}</Dropdown.Item>
              ))}

            </DropdownButton>

            <br /><br />
            <Tabs defaultActiveKey="GenderCategoryInsight" transition={false} id="HRAnalysis">

              <Tab eventKey="GenderCategoryInsight" title=" Gender(category) Insight ">
                <div>
                  <br />
                  <h3 className="text-center"> Gender(category) Insight </h3>
                  <HorizontalBarGraph inputData={this.state.dataHorizontalGender} barChartOptions={this.barChartOptions} />
                </div>
              </Tab>
              <Tab eventKey="EthnicityCategoryInsight" title=" Ethnicity(category) Insight ">
                <div>
                  <br />
                  <h3 className="text-center"> Ethnicity(category) Insight </h3>
                  <HorizontalBarGraph inputData={this.state.dataHorizontalEthnicity} barChartOptions={this.barChartOptions} />
                </div>
              </Tab>

            </Tabs>

          </Container>
        </div>
      </>
    );
  }
}

export default HomeHR;
