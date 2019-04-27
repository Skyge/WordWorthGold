import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import ValueSystem from '../../build/contracts/ValueSystem.json'
import { Link } from 'react-router-dom'
import Button from '@material-ui/core/Button';

class NewUser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      userName: '',
      hasRegistered: false,
    }

    this.web3Provider = web3.currentProvider

    this.web3 = new Web3(this.web3Provider)

    this.vs = TruffleContract(ValueSystem)
    this.vs.setProvider(this.web3Provider)

    this.userRegister = this.userRegister.bind(this)
  }

  componentDidMount() {
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account: account })
      this.vs.deployed().then((vsInstance) => {
      // initialize
      this.vsInstance = vsInstance
    })
  })}

  userRegister(name) {
    this.vsInstance.userRegister(this.web3.toHex(name), {
      from: this.state.account,
      gasLimit: 6200000,
    })
    this.setState({ hasRegistered: true })
  }

  render() {
    var pathBack = {
      pathname: '/',
    }
    return (
      <div>
        <b>
          Register a new account
        </b>
        <div>
          <form onSubmit={(event) => {
            event.preventDefault()
            this.userRegister(this.state.userName)
          }}>
          <div>
            <p>User Name:</p>
            <input
              className="form-input"
              value={this.state.userName}
              onChange={e => this.setState({ userName: e.target.value })}
            />
          </div>
          <button className="form-btn" type="submit" disabled={this.state.hasRegistered}>
            Register
          </button>
        </form>
        <div>
            { this.state.hasRegistered && (<div>
                <Link to={pathBack} >
                  <Button>
                    Go Back
                  </Button>
                </Link>
              </div>) }
          </div>
        </div>
      </div>
    )
  }
}

export default NewUser
