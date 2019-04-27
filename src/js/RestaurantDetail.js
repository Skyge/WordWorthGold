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
        // console.log("here is ====", name)
        {this.setState({ restaurantName: name }),
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
    return (
      <div>
        <b>
          restaurant details
        </b>
        <div>
          Restaurant Name: {restaurantName}
        </div>
        <div>
          Vouch Number: {this.state.vouchNumber}
        </div>
        <div>
          Reject Number: {this.state.rejectNumber}
        </div>
        <div>
          Restaurant Status: {this.state.status}
        </div>
        <div>
        <div>
          Restaurant Create Time: {moment(this.state.createTime).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        </div>
        <div>
          Vouchers: 
        </div>
        <div>
          Rejecters:
        </div>
        <div>
          <button onClick={this.handleVouch}>
            Vote
          </button>
        </div>
        <div>
          <button type="button" onClick={this.handleReject}>
            Reject
          </button>
        </div>
        <div>
          <button onClick={this.getResult}>
            GetResult
          </button>
        </div>
      </div>
    )
  }
}

export default RestaurantDetail
