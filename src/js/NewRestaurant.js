import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import ValueSystem from '../../build/contracts/ValueSystem.json'
// import * as utils from 'web3-utils';


class NewRestaurant extends Component {
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

    this.addRestaurant = this.addRestaurant.bind(this)

    console.log("look at here")
    console.log("u r passing a parameter=====", this.props.location.state.account)
  }

  componentDidMount() {
    // TODO: Refactor with promise chain
    // this.web3.eth.getCoinbase((err, account) => {
    //   this.setState({ account })
    //   console.log("---you are finding----", this.state.account);
      this.vs.deployed().then((vsInstance) => {
        // initialize
        this.vsInstance = vsInstance

      })
    // })
  }

  addRestaurant(restaurantName, restaurantAddress) {
    console.log("restaurant name is ====", restaurantName)
    // todo fix
    // restaurantName = this.web3.utils.toHex(restaurantName)
    // restaurantName = "0x847153056867513f" // 葱包桧儿
    restaurantName = "0x732b80336735" // 猫耳朵
    // console.log("restaurant name is ====", this.web3.utils.toHex(restaurantName))
    console.log("restaurant address is ====", restaurantAddress)
    this.vsInstance.addRestaurant(
      restaurantName, 
      restaurantAddress, 
      { from: this.props.location.state.account,
        gasLimit: 6700000,
       }
    )
  }

  render() {
    
    return (
      <div>
        <b>
          Finish restaurant details
        </b>
        {/* <form onSubmit={this.add}> */}
        <form onSubmit={(event) => {
          event.preventDefault()
          this.addRestaurant(this.state.restaurantName, this.state.restaurantAddress)
        }}>
          <div>
            <p>Restaurant Name:</p>
            <input
              className="form-input"
              value={this.state.restaurantName}
              onChange={e => this.setState({ restaurantName: e.target.value })}
            />
            <p>Restaurant Address:</p>
            <input
              className="form-input"
              value={this.state.restaurantAddress}
              onChange={e => this.setState({ restaurantAddress: e.target.value })
              
            }
            />
          </div>
          <button className="form-btn" type="submit" 
          // disabled={!this.state.inputValue}
          >
            Add
          </button>
        </form>
      </div>
    )
  }
}

export default NewRestaurant
