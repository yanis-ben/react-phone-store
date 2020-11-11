import React, { Component } from 'react'
import Title from "../Title";
// allows to create colomns in Cart
import CartColumns from "./CartColumns";

import EmptyCart from "./EmptyCart";
import {ProductConsumer} from "../../context";
import CartList from "./CartList";
import CartTotals from "./CartTotals";


export default class Cart extends Component{
  render() {
    return (
        <section>
          {/*Retrieve items in cart*/}
          <ProductConsumer>
            {c=>{
              const {cart} = c;
              if(cart.length>0){
                return(
                  <React.Fragment>
                    <Title name="your" title="cart"></Title>
                    <CartColumns/>
                    <CartList value ={c}/>
                    <CartTotals value ={c}/>
                  </React.Fragment>                  
                );
              }else{
                return <EmptyCart/>;
              }
              
            }}
          </ProductConsumer>       
          
        </section>
        
    );
  }
}