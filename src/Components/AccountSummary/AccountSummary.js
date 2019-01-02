import React, { Component } from 'react'
import axios from 'axios'
import Spinner from '../Common/UI/Spinner/Spinner'
import * as displayTexts from './AccountSummaryTexts'
import UserSubscribed from './UserSubscribed/UserSubscribed'
import { toast, ToastContainer } from 'react-toastify'

export class AccountSummaryComponent extends Component {
  state = {
    userData: {
      address: null,
      isSubscribed: false,
      activated: null,
      id: null,
      email: 'test@altoros.com',
      frequency: 'weekly',
      activatedCode: null,
      createdAt: null
    },
    summary: {
      bondedAmount: '',
      fees: '',
      lastClaimRound: '',
      startRound: '',
      status: 'Bonded',
      withdrawRound: '',
      stake: ''
    },
    render: false,
    displayMsg: displayTexts.LOADING_USER_DATA,
    toastId: 1,
    error: false
  }

  initState = async () => {
    this.setState({
      userData: {
        ...this.state.userData,
        address: this.props.userData.address,
        ethBalance: this.props.userData.ethBalance
      }
    })
  }

  componentDidMount = async () => {
    console.log('[AccountSummaryComponent.js] componentDidMount')
    let userDataPromise, summaryPromise
    await this.initState()
    try {
      userDataPromise = axios.get('/address/' + this.state.userData.address)
      summaryPromise = axios.get('/summary/' + this.state.userData.address)
      let resultValues = await Promise.all([userDataPromise, summaryPromise])
      let userData = resultValues[0]
      let summaryData = resultValues[1]
      console.log('Promise all finished')
      this.setState(
        {
          userData: {
            ...this.state.userData,
            isSubscribed: true,
            activated: userData.data.activated,
            id: userData.data._id,
            activatedCode: userData.data.activatedCode,
            createdAt: userData.data.createdAt,
            email: userData.data.email,
            frequency: userData.data.frequency
          },
          summary: {
            bondedAmount: summaryData.data.summary.bondedAmount,
            fees: summaryData.data.summary.fees,
            lastClaimRound: summaryData.data.summary.lastClaimRound,
            startRound: summaryData.data.summary.startRound,
            status: summaryData.data.summary.status,
            withdrawRound: summaryData.data.summary.withdrawRound,
            stake: summaryData.data.summary.totalStake
          },
          render: true,
          displayMsg: displayTexts.WELCOME_AGAIN + this.state.userData.email,
          error: false,
          lpBalance: summaryData.data.balance
        },
        () => console.log('setting state finished ', this.state)
      )
    } catch (error) {
      /** Subscription not found **/
      console.log('subscription not found')
      if (error.response && error.response.status === 404) {
        console.log('Subscription not found')
        this.setState({
          userData: {
            ...this.state.userData,
            isSubscribed: false
          },
          render: true,
          displayMsg: displayTexts.WELCOME_NOT_SUBSCRIBED,
          error: true
        })
        await this.fetchAccountSummaryData()
      } else {
        console.log('[AccountSummary.js] exception on getRequest', error)
        this.setState(
          {
            render: true,
            displayMsg: displayTexts.FAIL_NO_REASON,
            error: true
          },
          () => this.sendToast()
        )
      }
    }
  }

  sendToast = toastTime => {
    console.log('Sending toast')
    let time = 6000
    if (toastTime) {
      time = toastTime
    }
    let displayMsg = this.state.displayMsg

    if (!toast.isActive(this.state.toastId) && this.state.render) {
      if (this.state.error) {
        toast.error(displayMsg, {
          position: toast.POSITION.TOP_RIGHT,
          progressClassName: 'Toast-progress-bar',
          autoClose: time,
          toastId: this.state.toastId
        })
      } else {
        toast.success(displayMsg, {
          position: toast.POSITION.TOP_RIGHT,
          progressClassName: 'Toast-progress-bar',
          autoClose: time,
          toastId: this.state.toastId
        })
      }
    }
  }

  fetchAccountSummaryData = async () => {
    try {
      let summaryData = await axios.get('/summary/' + this.state.userData.address)
      console.log('summary data ', summaryData)
      this.setState({
        summary: {
          bondedAmount: summaryData.data.summary.bondedAmount,
          fees: summaryData.data.summary.fees,
          lastClaimRound: summaryData.data.summary.lastClaimRound,
          startRound: summaryData.data.summary.startRound,
          status: summaryData.data.summary.status,
          withdrawRound: summaryData.data.summary.withdrawRound,
          stake: summaryData.data.summary.totalStake
        },
        lpBalance: summaryData.data.balance
      })
    } catch (exception) {
      console.log('Exception fetching account summary ', exception)
    }
  }

  onSubscribeBtnHandler = async () => {
    console.log('[AccountSummary.js] subscribe btnHandler')
    let response
    this.setState({
      render: false,
      displayMsg: displayTexts.LOADING_SUBSCRIPTION
    })
    const data = {
      email: this.state.userData.email,
      address: this.state.userData.address,
      frequency: this.state.userData.frequency
    }
    try {
      console.log('Creating new subscriber with data: ', data)
      response = await axios.post('', data)
      this.setState({
        userData: {
          ...this.state.userData,
          activated: response.data.activated,
          id: response.data._id,
          activatedCode: response.data.activated,
          createdAt: response.data.createdAt,
          isSubscribed: true
        },
        render: true,
        error: false,
        displayMsg: displayTexts.WELCOME_NEW_SUBSCRIBER + this.state.userData.email
      })
    } catch (exception) {
      console.log('[AccountSummary.js] exception on postSubscription', exception)
      /** TODO -- PARSE WHEN EMAIL ALREADY EXISTS **/
      this.setState(
        {
          render: true,
          displayMsg: displayTexts.FAIL_NO_REASON,
          error: true
        },
        () => this.sendToast()
      )
    }
  }

  onUnSubscribeBtnHandler = async () => {
    console.log('[AccountSummary.js] unsubscribe btnHandler')
    this.setState({
      render: false,
      displayMsg: displayTexts.LOADING_UNSUBSCRIPTION
    })
    const data = {
      username: 'test'
    }
    try {
      await axios.delete('/' + this.state.userData.id, data)
      console.log('User unsubscribed')
      this.setState(
        {
          render: true,
          displayMsg: displayTexts.UNSUBSCRIPTION_SUCCESSFUL,
          userData: {
            ...this.state.userData,
            isSubscribed: false,
            activated: null,
            id: null,
            activatedCode: null,
            createdAt: null,
            error: false
          }
        },
        () => this.sendToast()
      )
    } catch (exception) {
      console.log('[AccountSummary.js] exception on deleteSubscription')
      if (exception.response.status === 404) {
        /** User with that id not found **/
        this.setState(
          {
            render: true,
            displayMsg: displayTexts.WELCOME_NOT_SUBSCRIBED,
            error: true
          },
          () => this.sendToast()
        )
      } else {
        this.setState(
          {
            render: true,
            displayMsg: displayTexts.FAIL_NO_REASON,
            error: true
          },
          () => this.sendToast()
        )
      }
    }
  }

  onSubscriptionChangeHandler = () => {
    console.log('[AccountSummary.js] onSubscriptionChangeHandler')
  }

  render() {
    let content = (
      <>
        <h3>{this.state.displayMsg}</h3>
        <Spinner />
      </>
    )
    if (this.state.render) {
      content = (
        <>
          <UserSubscribed
            onUnSubscribeBtnHandler={this.onUnSubscribeBtnHandler}
            onSubscriptionChangeHandler={this.onSubscriptionChangeHandler}
            web3={this.props.web3}
            userData={this.state.userData}
            summary={this.state.summary}
            lpBalance={this.state.lpBalance}
          />
        </>
      )
    }
    return (
      <div>
        {content}
        <ToastContainer autoClose={3000} />
      </div>
    )
  }
}