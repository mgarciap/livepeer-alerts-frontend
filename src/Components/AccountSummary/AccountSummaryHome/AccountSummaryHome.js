import * as displayTexts from '../AccountSummaryTexts'
import AccountSummaryData from '../AccountSummaryData/AccountSummaryData'
import AccountSummaryStyle from './AccountSummaryStyle'
import Button from '../../Common/UI/CustomButtons/Button'
import Card from '../../Common/UI/Card/Card.js'
import GridContainer from '../../Common/UI/Grid/GridContainer.js'
import GridItem from '../../Common/UI/Grid/GridItem.js'
import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import tableStyle from '../../../assets/jss/dashboard/components/tableStyle'
import { withStyles } from '@material-ui/core/styles'

const AccountSummaryHome = props => {
  let disabledBtn = props.summary && props.summary.status !== 'Bonded'
  let subscriptionBtn
  let isSubscribed = props.userData && props.userData.isSubscribed ? 'Yes' : 'No'

  const { classes } = props
  const tableData = [
    {
      title: 'Address',
      data: props.userData.address
    },
    {
      title: 'ETH Balance',
      data: props.userData.ethBalance
    },
    {
      title: 'LivePeer Balance',
      data: props.lpBalance
    },
    {
      title: 'Subscribed',
      data: isSubscribed
    }
  ]

  if (props.userData && props.userData.isSubscribed) {
    subscriptionBtn = (
      <Button
        color="warning"
        disabled={disabledBtn}
        onClick={props.onUnSubscribeBtnHandler}
        round
        size="lg"
      >
        Unsubscribe
      </Button>
    )
  } else {
    subscriptionBtn = (
      <Button
        color="primary"
        disabled={disabledBtn}
        onClick={props.onSubscribeBtnHandler}
        round
        size="lg"
      >
        Subscribe
      </Button>
    )
  }

  return (
    <div className={classes.container}>
      <GridContainer className={classes.gridContainer} justify="center">
        <GridItem className={classes.cardContainer}>
          <Card className={classes.cardAccountSummary}>
            <h2 className={classes.cardTitle}>{displayTexts.WELCOME_AGAIN}</h2>
            <GridContainer className={classes.gridContainer}>
              <GridItem lg={6} md={12} xs={12}>
                <Table className={` ${classes.table}`}>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        colSpan="2"
                        className={`${classes.tableHeadCel} ${classes.noWrap} ${classes.pL0} ${
                          classes.pR0
                        } ${classes.tableTitle}`}
                      >
                        Account Summary
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.map((item, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className={`${classes.tableCell} ${classes.noWrap}`}>
                            {item.title}
                          </TableCell>
                          <TableCell
                            className={`${classes.tableCell} ${classes.textRight} ${
                              classes.wordBreak
                            }`}
                          >
                            {item.data}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </GridItem>
              <GridItem lg={6} md={12} xs={12}>
                <AccountSummaryData summary={props.summary} />
              </GridItem>
            </GridContainer>
            <GridContainer
              className={classes.buttonContainer}
              justify="flex-end"
              lg={12}
              md={12}
              xs={12}
            >
              <GridItem
                className={`${classes.buttonContainerItem}`}
                container={true}
                justify="flex-end"
                lg={6}
                md={12}
                xs={12}
              >
                {subscriptionBtn}
              </GridItem>
            </GridContainer>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  )
}
export default withStyles(theme => ({
  ...AccountSummaryStyle,
  ...tableStyle(theme)
}))(AccountSummaryHome)
