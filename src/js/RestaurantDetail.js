import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import ValueSystem from '../../build/contracts/ValueSystem.json'
import moment from 'moment';

class RestaurantDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      restaurantName: '',
      vouchNumber: 0,
      rejectNumber: 0,
      status: 0,
      createTime: 0,
      vouchers: [],
      rejecters: [],
      account: '0x0',
      canAccess: false,
    }

    this.web3Provider = web3.currentProvider

    this.web3 = new Web3(this.web3Provider)

    this.vs = TruffleContract(ValueSystem)
    this.vs.setProvider(this.web3Provider)

    this.handleVouch = this.handleVouch.bind(this)
    this.handleReject = this.handleReject.bind(this)
    this.getResult = this.getResult.bind(this)
  }

  componentDidMount() {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account: account })
      this.vs.deployed().then((vsInstance) => {
      // initialize
      this.vsInstance = vsInstance

      this.vsInstance.restaurantList(this.props.location.state.index).then(name =>
        { // console.log("here is ====", name)
        this.setState({ restaurantName: name }),
        this.vsInstance.restaurants(name).then(properties =>
          {
            this.setState({
              vouchNumber: properties[0].c[0],
              rejectNumber: properties[1].c[0],
              createTime: properties[2].c[0],
              status: properties[3].c[0],
            })
          })}
        )

        this.vsInstance.managers(this.state.restaurantName).then(address =>
          {// console.log("supplier addr is ", address)
            if (this.state.account === address) {
              this.setState({ canAccess: true })
            }
          }
        )
    })
  })}

  handleVouch(event) {
    event.preventDefault();
    console.log("u r vouching ====")
    this.vsInstance.vouch(this.state.restaurantName, {
      from: this.state.account,
      gasLimit: 6200000,
    })
  }

  handleReject(event) {
    event.preventDefault();
    this.vsInstance.reject(this.state.restaurantName, {
      from: this.state.account,
      gasLimit: 6200000,
    })
  }

  getResult(event) {
    event.preventDefault();
    this.vsInstance.getResult(this.state.restaurantName, {
      from: this.state.account,
      gasLimit: 6200000,
    })
  }

  render() {
    console.log("u r in restaurant details", this.state.restaurantName)
    let restaurantName
    if (this.state.restaurantName === '0xe891b1e58c85e6a1a7e584bf0000000000000000000000000000000000000000') {
      restaurantName = '葱包桧儿'
    } else {
      restaurantName = '猫耳朵'
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
    let pad = {padding:'13px'}
    return (
      <div>
        <div style={titleStyle}>
          <p>
            restaurant details
          </p>
        </div>
        <div style={contentStyle}>
          Restaurant Name: {restaurantName}
        </div>
        <div style={contentStyle}>
          Vouch Number: {this.state.vouchNumber}
        </div>
        <div style={contentStyle}>
          Reject Number: {this.state.rejectNumber}
        </div>
        <div style={contentStyle}>
          Restaurant Status: {this.state.status}
        </div>
        <div style={contentStyle}>
          Restaurant Create Time: {moment(this.state.createTime).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        <div style={contentStyle}>
          Vouchers: 
        </div>
        <div style={contentStyle}>
          Rejecters:
        </div>
        <div style={pad}>
          <button onClick={this.handleVouch} style={buttonStyle}>
            Vote
          </button>
        </div>
        <div style={pad}>
          <button type="button" onClick={this.handleReject} style={buttonStyle}>
            Reject
          </button>
        </div>
        <div>
          {this.state.canAccess 
            && (
              <div style={pad}>
                <button onClick={this.getResult} style={buttonStyle}>
                  GetResult
                </button>
              </div>
            )}
        </div>
      </div>
    )
  }
}

export default RestaurantDetail
