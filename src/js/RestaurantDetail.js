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

    }

    this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')

    this.web3 = new Web3(this.web3Provider)

    this.vs = TruffleContract(ValueSystem)
    this.vs.setProvider(this.web3Provider)

    // this.addRestaurant = this.addRestaurant.bind(this)
  }

  componentDidMount() {
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
  }

  render() {
    console.log("u r in restaurant details", this.web3.toAscii(this.state.restaurantName))
    return (
      <div>
        <b>
          restaurant details
        </b>
        <div>
          Restaurant Name: {this.state.restaurantName}
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
      </div>
    )
  }
}

export default RestaurantDetail
