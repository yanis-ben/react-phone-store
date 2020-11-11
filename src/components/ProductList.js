import React, { Component } from 'react'
import Product from "./Product";
import Title from "./Title"
import {storeProducts} from "../data"
import {ProductConsumer} from "../context"

export default class ProductList extends Component{
  // storeProducts is defined in /data and data.js is imported
  state={
    products: storeProducts
  }
  render() {
    
    return (
      <React.Fragment>
        <div className="py-5">
          <div className="container">
            <Title name="our" title="products"/>
            {/* product list*/}
            <div className="row">
              <ProductConsumer>
                {(value)=>{
                  // prd is just an input
                  return value.products.map(prd => {
                    return <Product key = {prd.id}  prd={prd}/>
                  });
                }}
              </ProductConsumer>
            </div>
          </div>

        </div>
      </React.Fragment>
     // <Product/>
    );
  }
}

//export default ProductList;

