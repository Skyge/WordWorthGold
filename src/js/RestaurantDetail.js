import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import ValueSystem from '../../build/contracts/ValueSystem.json'

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

    this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')

    this.web3 = new Web3(this.web3Provider)

    this.vs = TruffleContract(ValueSystem)
    this.vs.setProvider(this.web3Provider)

    this.handleVouch = this.handleVouch.bind(this)
    this.handleReject = this.handleReject.bind(this)
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
          {console.log("here is ====", properties)
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

  handleVouch() {
    this.vsInstance.vouch(this.state.restaurantName)
  }

  handleReject() {
    this.vsInstance.reject(this.state.restaurantName)
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
          Restaurant Create Time: {this.state.createTime}
        </div>
        </div>
        <div>
          Vouchers: 
        </div>
        <div>
          Rejecters:
        </div>
        <div>
          <button onclick={this.handleVouch}>
            Vote
          </button>
        </div>
        <div>
          <button onclick={this.handleVouch}>
            Reject
          </button>
        </div>
      </div>
    )
  }
}

export default RestaurantDetail
