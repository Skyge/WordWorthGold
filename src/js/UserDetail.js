import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import ValueSystem from '../../build/contracts/ValueSystem.json'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';
import moment from 'moment'; 

class UserDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName:       '',
      totalVouch:     0,
      totalReject:    0,
      currentScore:   0,
      votingCount:    0,
      lastVotedTime:  0,
      hasRegistered:  false,
      account:        '0x0',
    }

    this.web3Provider = web3.currentProvider

    this.web3 = new Web3(this.web3Provider)

    this.vs = TruffleContract(ValueSystem)
    this.vs.setProvider(this.web3Provider)

  }

  componentDidMount() {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account: account })
      this.vs.deployed().then((vsInstance) => {
      // initialize
      this.vsInstance = vsInstance

      // this.vsInstance.restaurantList(this.props.location.state.index).then(name =>
      //   {this.setState({ restaurantName: name }),
      //   this.vsInstance.restaurants(name).then(properties =>
      //     {console.log("here is ====", properties)
      //       this.setState({
      //         vouchNumber: properties[0].c[0],
      //         rejectNumber: properties[1].c[0],
      //         createTime: properties[2].c[0],
      //         status: properties[3].c[0],
      //       })
      //     })}
      //   )
      this.vsInstance.users(this.state.account).then(properties =>
        {
          this.setState({
          userName: properties[0],
          totalVouch: properties[1].c[0],
          totalReject: properties[2].c[0],
          currentScore: (properties[3].c[0]/1000),
          votingCount: properties[4].c[0],
          lastVotedTime: properties[5].c[0],
        })}
      )
    })
  })}


  render() {
    var pathBack = {
      pathname: '/',
    }
    return (
      <div>
        <b>
          user details
        </b>
        <div>
          User Name: {this.web3.toAscii(this.state.userName)}
        </div>
        <div>
          Total Vouch: {this.state.totalVouch}
        </div>
        <div>
          Total Reject: {this.state.totalReject}
        </div>
        <div>
          Current Score: {this.state.currentScore}
        </div>
        <div>
          <div>
            Voting Count: {this.state.votingCount}
          </div>
        </div>
        <div>
          Last Voted Time: {moment(this.state.lastVotedTime).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        <div>
            <Link to={pathBack} >
              <Button>
                Go Back
              </Button>
            </Link>
          </div>
      </div>
    )
  }
}

export default UserDetail
