import React from 'react'
import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as jest from 'jest'
import axios from 'axios'
import AccountSummaryHome from '../../src/Components/AccountSummary/AccountSummaryHome/AccountSummaryHome'
import AccountSummaryData from '../../src/Components/AccountSummary/AccountSummaryData/AccountSummaryData'

configure({ adapter: new Adapter() })

const props = {
  summary: {
    bondedAmount: 0,
    fees: 0,
    status: 'Bounded',
    lastClaimRound: 0,
    startRound: 0,
    withdrawRound: 0
  },
  userData: {
    address: '0x4d3F9184Fc32A43BAD2641b1536B52a076FBBDcE',
    email: 'test@altoros.com',
    frequency: 'weekly',
    ethBalance: 'ethBalance',
    activated: 1,
    isSubscribed: true
  },
  render: true,
  onSubscriptionChangeHandler: () => {},
  onUnSubscribeBtnHandler: () => {}
}

const response = {
  data: {
    bondedAmount: 0,
    fees: 0,
    lastClaimRound: 0,
    startRound: 0,
    status: 0,
    withdrawRound: 0,
    totalStake: 0
  }
}

jest.mock('axios')
/** TODO -- Enable again when the enzyme bug of conditional rendering is solved **/
describe('Renders userSubscribed data', () => {
  it('Shows Welcome Message', () => {
    const message = 'Welcome 0x4d3F91...76FBBDcE'
    axios.get.mockResolvedValue(response)
    let wrapper = mount(<AccountSummaryHome {...props} />)
    wrapper = wrapper.update()
    expect(wrapper.contains(message)).toEqual(true)
  })
  it('Shows address', () => {
    const message = 'Wallet address'
    let wrapper = mount(<AccountSummaryHome {...props} />)
    expect(wrapper.contains(message)).toEqual(true)
  })
  it('Shows ETH Balance', () => {
    const message = 'Wallet balance in ETH'
    let wrapper = mount(<AccountSummaryHome {...props} />)
    expect(wrapper.contains(message)).toEqual(true)
  })
  it('Shows Livepeer Balance', () => {
    const message = 'Wallet balance in LPT'
    let wrapper = mount(<AccountSummaryHome {...props} />)
    expect(wrapper.contains(message)).toEqual(true)
  })
  it('Renders account summary data child component', () => {
    let wrapper = mount(<AccountSummaryHome {...props} />)
    expect(wrapper.contains(<AccountSummaryData summary={props.summary} />)).toBe(true)
  })
  it('Renders subscription button if user not auth', () => {
    const propsNotAuth = {
      ...props,
      userData: {
        ...props.userData,
        isSubscribed: false
      }
    }
    let wrapper = mount(<AccountSummaryHome {...propsNotAuth} />)
    let textBtnSubscribeTelegram = wrapper
      .find('Button')
      .at(0)
      .text()
    let textBtnSubscribeEmail = wrapper
      .find('Button')
      .at(1)
      .text()
    expect(textBtnSubscribeEmail === 'Subscribe via Email').toEqual(true)
    expect(textBtnSubscribeTelegram === 'Subscribe via Telegram').toEqual(true)
  })
  it('Renders Unsubscription button if user is auth', () => {
    const propsNotAuth = {
      ...props,
      userData: {
        ...props.userData,
        isSubscribed: true
      }
    }
    let wrapper = mount(<AccountSummaryHome {...propsNotAuth} />)
    wrapper = wrapper.update()
    let textBtn = wrapper
      .find('Button')
      .at(1)
      .text()
    expect(textBtn === 'Unsubscribe').toEqual(true)
  })
})
