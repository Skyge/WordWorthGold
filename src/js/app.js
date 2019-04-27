import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import TruffleContract from 'truffle-contract'
import ValueSystem from '../../build/contracts/ValueSystem.json'
import Content from './Content'
import ShowWhiteList from './ShowWhiteList'
import ShowRestaurantList from './ShowRestaurantList'
import ShowBlackList from './ShowBlackList'
import RestaurantList from './RestaurantList'
import NewRestaurant from './NewRestaurant'
import RestaurantDetail from './RestaurantDetail'
import NewUser from './NewUser'
import 'bootstrap/dist/css/bootstrap.css'
import Button from '@material-ui/core/Button';
// import { Link } from 'react-router-dom'

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';


class App extends Component {
  render(props, context) {
    return (
      <Router >
      <div style={{height:'100%'}}>
      <Switch>
        <Route exact path="/" component={RestaurantList}/>
        <Route path="/newRestaurant" component={NewRestaurant}/>
        <Route path="/restaurantDetail" component={RestaurantDetail}/>
        <Route path="/newUser" component={NewUser}/>
      </Switch>
      </div>
    </Router>
    )}

}








ReactDOM.render(
   <App />,
    document.getElementById('root')
)
