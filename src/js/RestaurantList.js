import React, { Component } from 'react'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import ValueSystem from '../../build/contracts/ValueSystem.json'
import ShowRestaurantList from './ShowRestaurantList'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css'
import Button from '@material-ui/core/Button';


class RestaurantList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      candidates: [],
      hasVoted: false,
      loading: true,
      voting: false,
      votedFor: 0,

      account: '0x0',
      adminAccount: '0x0',
      isAdmin: false,
      WhiteList: [],
      BlackList: [],
      RestaurantList: [], // `葱包桧儿, 猫耳朵`
    }

    if (typeof web3 != 'undefined') {
      console.log("web3 is not undefine")
      this.web3Provider = web3.currentProvider
    } else {
      console.log("web3 is  undefine")
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }

    this.web3 = new Web3(this.web3Provider)

    this.vs = TruffleContract(ValueSystem)
    this.vs.setProvider(this.web3Provider)
  }

  componentDidMount() {
    // TODO: Refactor with promise chain
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      this.vs.deployed().then((vsInstance) => {
        // initialize
        this.vsInstance = vsInstance
        // whiteList
        this.vsInstance.whiteListLength().then(nums => {
          console.log(nums)
          for (let i=0;i<nums.c[0]; i++) {
            this.vsInstance.WhiteList(i).then(value => {
              this.setState(preState => ({
                WhiteList: [...preState.WhiteList, this.web3.toAscii(value)]
              }))
            })  
          }
        })
        // blackList
        this.vsInstance.blackListLength().then(nums => {
          for (let i=0;i<nums.c[0]; i++) {
            this.vsInstance.BlackList(i).then(value => {
              this.setState(preState => ({
                BlackList: [...preState.BlackList, this.web3.toAscii(value)]
              }))
            })  
          }
        })
        // restaurantList
        this.vsInstance.restaurantListLength().then(nums => {
          console.log("u r in restaurant is ===", nums)
          for (let i=0;i<nums.c[0]; i++) {
            this.vsInstance.restaurantList(i).then(value => {
              this.setState(preState => ({
                RestaurantList: [...preState.RestaurantList, this.web3.toAscii(value)]
              }))
            })  
          }
        })

        this.vsInstance.owner().then(address =>
          {
            this.setState({ adminAccount: address })
            if (this.state.account === this.state.adminAccount) {
              this.setState({ isAdmin: true })
            }
          }
        )
      })
    })
  }

  render() {
    console.log("account is ---", this.state.account)
    console.log("owner is ---", this.state.adminAccount)
    var data = {account:this.state.account}
    var pathAdmin = {
      pathname: '/newRestaurant',
      state: data,
    }
    var pathUser = {
      pathname: '/newUser',
    }
    var pathUserDetail = {
      pathname: '/userDetail',
    }

    let titleStyle = {padding:'55px'}
    let WhiteListStyle = {padding:'35px'}
    let BlackListStyle = {padding:'35px'}
    let buttonStyle = {
      borderRadius: '3px',
      backgroundColor: '#1E90FF',
    }
    let pad = {padding:'18px'}

    return (
      <div class='row'>
        <div class='col-lg-12 text-center' style={titleStyle} >
          <h1>Restaurants Display</h1>
          <div>
            { this.state.WhiteList.length !== 0 
              && (
                  <div style={WhiteListStyle}>
                    <p>
                      white list
                    </p>
                    <div>
                      {
                        this.state.WhiteList.map((item,index)=>{
                          return <li name-index={index}><Link to={{
                            pathname: '/restaurantDetail',
                            state: {index},
                          }}>{item}</Link></li>
                        })
                      }
                    </div>
                  </div>
                  )}
          </div>
          <br/>

          <div>
            { this.state.RestaurantList.length !== 0 
              && <ShowRestaurantList 
                  restaurantList={this.state.restaurantList}/>
            }
          </div>
          <br/>

          <div>
            { this.state.BlackList.length !== 0 
              && (
                <div style={BlackListStyle}>
                  <p>
                    white list
                  </p>
                  <div>
                    {
                      this.state.BlackList.map((item,index)=>{
                        return <li name-index={index}><Link to={{
                          pathname: '/restaurantDetail',
                          state: {index},
                        }}>{item}</Link></li>
                      })
                    }
                  </div>
                </div>
                )}
          </div>
          <br/>

          <div style={pad}>
            { !this.state.isAdmin && (<div>
                <Link to={pathUser} >
                  <Button style={buttonStyle}>
                    Register
                  </Button>
                </Link>
              </div>) }
          </div>

          <div style={pad}>
            { !this.state.isAdmin && (<div>
                <Link to={pathUserDetail} >
                  <Button style={buttonStyle}>
                    User Detail
                  </Button>
                </Link>
              </div>) }
          </div>

          <div style={pad}>
            { this.state.isAdmin
              && (<div >
                <Link to={pathAdmin} >
                  <Button style={buttonStyle}>
                    Add new restaurant
                  </Button>
                </Link>
              </div>)}
          </div>
        </div>
      </div>
    )
  }
}

export default RestaurantList
