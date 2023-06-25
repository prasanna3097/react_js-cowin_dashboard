// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationCoverage from '../VaccinationCoverage'

const apiStatusContants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_Progress',
}

class CowinDashboard extends Component {
  state = {
    fetchedData: {},
    apiStatus: apiStatusContants.initial,
  }

  componentDidMount() {
    this.getVaccinationData()
  }

  getVaccinationData = async () => {
    this.setState({apiStatus: apiStatusContants.inProgress})
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    const data = await response.json()
    if (response.ok === true) {
      const CovertedData = {
        last7DaysVaccination: data.last_7_days_vaccination,
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({
        fetchedData: CovertedData,
        apiStatus: apiStatusContants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusContants.failure})
    }
  }

  renderReCharts = () => {
    const {fetchedData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByAge,
      vaccinationByGender,
    } = fetchedData
    return (
      <>
        <VaccinationCoverage VaccinationCoverageData={last7DaysVaccination} />
        <VaccinationByGender VaccinationByGenderData={vaccinationByGender} />
        <VaccinationByAge VaccinationByAgeData={vaccinationByAge} />
      </>
    )
  }

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailure = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Something Went Wrong</h1>
    </div>
  )

  renderSwitchCheck = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusContants.success:
        return this.renderReCharts()
      case apiStatusContants.failure:
        return this.renderFailure()
      case apiStatusContants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="cowin-container">
        <div className="main-head-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <p className="heading">Co-Win</p>
        </div>
        <p className="title">CoWIN Vaccination in india</p>
        <div>{this.renderSwitchCheck()}</div>
      </div>
    )
  }
}
export default CowinDashboard
