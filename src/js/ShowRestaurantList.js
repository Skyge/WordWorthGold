import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class ShowRestaurantList extends Component {
  render() {
    console.log("u r in restaurant list", this.props.restaurantList)
    var list = ['葱包桧儿', '猫耳朵']
    return (
      <div>
        <b>
          restaurant list
        </b>
        <div>
          {
            list.map((item,index)=>{
              return <li name-index={index}><Link to={{
                pathname: '/restaurantDetail',
                state: {index},
              }}>{item}</Link></li>
            })
          }
        </div>
      </div>
    )
  }
}

export default ShowRestaurantList
