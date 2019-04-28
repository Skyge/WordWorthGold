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
    
    let titleStyle = {
      fontSize: '20px',
      padding: '40px',
      textAlign:'center',
    }
    let contentStyle = {
      fontSize: '16px',
      padding: '13px',
    }
    let buttonStyle = {
      borderRadius: '3px',
      backgroundColor: '#1E90FF',
    }
    return (
      <div >
        <div style={titleStyle}>
          <p>
            user details
          </p>
        </div>
        <div style={contentStyle}>
          User Name: {this.web3.toAscii(this.state.userName)}
        </div>
        <div style={contentStyle}>
          Total Vouch: {this.state.totalVouch}
        </div>
        <div style={contentStyle}>
          Total Reject: {this.state.totalReject}
        </div>
        <div style={contentStyle}>
          Current Score: {this.state.currentScore}
        </div>
        <div style={contentStyle}>
          <div>
            Voting Count: {this.state.votingCount}
          </div>
        </div>
        <div style={contentStyle}>
          Last Voted Time: {(this.state.lastVotedTime === 0)
                              ? 0
                              : moment(this.state.lastVotedTime).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        <div style={contentStyle}>
            <Link to={pathBack} >
              <Button style={buttonStyle}>
                Go Back
              </Button>
            </Link>
          </div>
      </div>
    )
  }
}

export default UserDetail
