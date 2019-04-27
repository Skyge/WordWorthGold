import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import RestaurantList from './RestaurantList'
import NewRestaurant from './NewRestaurant'
import RestaurantDetail from './RestaurantDetail'
import NewUser from './NewUser'
import UserDetail from './UserDetail'
import 'bootstrap/dist/css/bootstrap.css'

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
        <Route path="/userDetail" component={UserDetail}/>
      </Switch>
      </div>
    </Router>
    )}

}


ReactDOM.render(
   <App />,
    document.getElementById('root')
)
