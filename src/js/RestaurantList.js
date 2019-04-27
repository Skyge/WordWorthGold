import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import ValueSystem from '../../build/contracts/ValueSystem.json'
import Content from './Content'
import ShowWhiteList from './ShowWhiteList'
import ShowRestaurantList from './ShowRestaurantList'
import ShowBlackList from './ShowBlackList'
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
      test: []

    }

    // if (typeof web3 != 'undefined') {
    //   this.web3Provider = web3.currentProvider
    // } else {
      this.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    // }

    this.web3 = new Web3(this.web3Provider)

    this.vs = TruffleContract(ValueSystem)
    this.vs.setProvider(this.web3Provider)

    console.log("---you login in----");
    // this.watchEvents = this.watchEvents.bind(this)
  }

  componentDidMount() {
    // TODO: Refactor with promise chain
    this.web3.eth.getCoinbase((err, account) => {
      this.setState({ account })
      console.log("---you are finding----", this.state.account);
      this.vs.deployed().then((vsInstance) => {
        // initialize
        this.vsInstance = vsInstance
        // whiteList
        // this.vsInstance.whiteListLength().then(nums => {
        //   for (let i=0;i<nums; i++) {
        //     this.vsInstance.WhiteList(i).then(value => {
        //       this.setState(preState => ({
        //         WhiteList: [...preState.WhiteList, value.c[0]]
        //       }))
        //     })  
        //   }
        // })
        // // blackList
        // this.vsInstance.blackListLength().then(nums => {
        //   for (let i=0;i<nums; i++) {
        //     this.vsInstance.BlackList(i).then(value => {
        //       this.setState(preState => ({
        //         BlackList: [...preState.BlackList, value.c[0]]
        //       }))
        //     })  
        //   }
        // })
        // restaurantList
        this.vsInstance.restaurantListLength().then(nums => {
          console.log("u r in restaurant is ===", nums.c[0])
          for (let i=0;i<nums.c[0]; i++) {
            this.vsInstance.restaurantList(i).then(value => {
              console.log(" error is here --->>>>", value)
              this.setState(preState => ({
                RestaurantList: [...preState.RestaurantList, value]
              }))
            })  
          }
        })

        this.vsInstance.owner().then(address =>
          {console.log("owner is ", address)
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
    
    console.log("===white list is -===", this.state.RestaurantList)
    var data = {account:this.state.account}
    var path = {
      pathname: '/newRestaurant',
      state: data,
    }

    return (
      
      <div class='row'>
        <div class='col-lg-12 text-center' >
          <h1>Restaurants Display</h1>
          <div>
            { this.state.WhiteList.length !== 0 && <ShowWhiteList />}
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
            { this.state.BlackList.length !== 0 && <ShowBlackList />}
          </div>
          <br/>

          <div>
            { this.state.isAdmin
              && (<div>
                <Link to={path} >
                  <Button>
                    Add new restaurant
                  </Button>
                </Link>
              </div>)}
          </div>

          {/* account: '0x0',
      adminAccount: '0x0', */}

          {/* { this.state.loading || this.state.voting
            ? <p class='text-center'>Loading...</p>
            : <Content
                account={this.state.account}
                candidates={this.state.candidates}
                hasVoted={this.state.hasVoted}
                votedFor={this.state.votedFor}
                castVote={this.castVote} />
          } */}

        </div>
      </div>
    )
  }
}

export default RestaurantList
