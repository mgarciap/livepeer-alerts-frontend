import AccountSummaryStyle from '../AccountSummaryHome/AccountSummaryStyle'
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import { truncateStringInTheMiddle } from '../../../utils'

const AccountSummaryData = props => {
  const { stake, fees, status, delegateAddress, startRound } = props.summary
  const tableData = [
    {
      title: 'Stake',
      currency: 'LPT',
      data: stake
    },
    {
      title: 'Earning fees',
      currency: 'ETH',
      data: fees
    }
  ]
  const { classes } = props

  const messageForBonded = () => {
    const delegateAddressUrl = `https://explorer.livepeer.org/accounts/${delegateAddress}`

    return (
      <>
        <p className={classes.walletInfo}>
          Bonded to delegate{' '}
          <a href={delegateAddressUrl} target="_blank" rel="noopener noreferrer">
            {truncateStringInTheMiddle(delegateAddress)}
          </a>{' '}
          at round {startRound}{' '}
        </p>
      </>
    )
  }

  return (
    <>
      <div className={classes.topInfo}>
        <h3 className={`${classes.walletTitle} ${classes.lessMarginBottom}`}>{status}</h3>
        {messageForBonded()}
      </div>
      <div className={`${classes.blockData}`}>
        {tableData.map((item, index) => {
          return (
            <div className={`${classes.blockDataItem}`} key={index}>
              <h3 className={`${classes.blockDataItemMainTitle}`}>{item.title}</h3>
              <p className={`${classes.blockDataItemValue}`}>{item.data}</p>
              <h4 className={`${classes.blockDataItemTitle}`}>{item.currency}</h4>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default withStyles(theme => ({
  ...AccountSummaryStyle
}))(AccountSummaryData)
