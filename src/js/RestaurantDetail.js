import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import ValueSystem from '../../build/contracts/ValueSystem.json'

class RestaurantDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      restaurantName: '',
      restaurantAddress: '',
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

      this.vsInstance.restaurantList[this.props.location.state.index]
    })
  }

  render() {
    console.log("u r in restaurant details", this.props.location.state.index)
    return (
      <div>
        <b>
          restaurant details
        </b>
        
      </div>
    )
  }
}

export default RestaurantDetail
