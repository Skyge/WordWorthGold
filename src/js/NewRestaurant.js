import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import ValueSystem from '../../build/contracts/ValueSystem.json'

class NewRestaurant extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      restaurantName: '',
      restaurantAddress: '',
    }

    this.web3Provider = web3.currentProvider

    this.web3 = new Web3(this.web3Provider)

    this.vs = TruffleContract(ValueSystem)
    this.vs.setProvider(this.web3Provider)

    this.addRestaurant = this.addRestaurant.bind(this)

    console.log("u r passing a parameter=====", this.props.location.state.account)
  }

  componentDidMount() {
    this.vs.deployed().then((vsInstance) => {
      // initialize
      this.vsInstance = vsInstance
    })
  }

  addRestaurant(restaurantName, restaurantAddress) {
    console.log("restaurant name hex is ====", this.web3.toHex(restaurantName))
    this.vsInstance.addRestaurant(
      this.web3.fromAscii(restaurantName), // 葱包桧儿  猫耳朵
      restaurantAddress, 
      { 
        from: this.props.location.state.account,
        gasLimit: 6700000, 
      }
    )
  }

  render() {
    let titleStyle = {
      fontSize: '20px',
      padding: '40px',
      textAlign:'center',
    }
    let inputStytle = {
      padding: '20px',
    }
    return (
      <div>
        <div style={titleStyle}>
          <p>
            Fill out restaurant details
          </p>
        </div>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.addRestaurant(this.state.restaurantName, this.state.restaurantAddress)
        }}>
          <div>
            <div style={inputStytle}>
              <p>Restaurant Name:</p>
              <input
                className="form-input"
                value={this.state.restaurantName}
                onChange={e => this.setState({ restaurantName: e.target.value })}
              />
            </div>
            <div style={inputStytle}>
              <p>Restaurant Address:</p>
              <input
                className="form-input"
                value={this.state.restaurantAddress}
                onChange={e => this.setState({ restaurantAddress: e.target.value })}
              />
            </div>
          </div>
          <div style={inputStytle}>
            <button className="form-btn" type="submit" >
              Add
            </button>
          </div>
        </form>
      </div>
    )
  }
}

export default NewRestaurant
