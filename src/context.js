import React, { Component } from 'react'
import {storeProducts, detailProduct} from "./data"

// créer un context 
const ProductContext = React.createContext();
// Provider
// Consumer
class ProductProvider extends Component{
    state ={
        products:[],
        detailProduct:detailProduct, 
        // manage adding product in cart      
        cart: [],
        // manage product panel
        modalOpen:true,
        modalProduct:detailProduct,
        cartSubTotal: 0,
        cartTax:0,
        cartTotal:0
    };
    
    componentDidMount(){
        //copy the value and not referencing it
        this.setProducts();
    }
    setProducts = () =>{
        let tempProducts = [];
        storeProducts.forEach(item =>{
            const singleItem = {...item};
            tempProducts = [...tempProducts,singleItem];
        })
        this.setState(()=>{
            return {products:tempProducts}
        })
        
    }

    // getItem allows to retrieve the product using find method with id
    getItem = idVar =>{
            const productVar = this.state.products.find(item => item.id === idVar);
            return productVar;
    }
    handleDetail = idVar =>{
        const product = this.getItem(idVar);
        this.setState(()=>{
            return {detailProduct:product}
        })
    };
    addToCart = idVar =>{
        let newTempProducts = [...this.state.products];
        const index = newTempProducts.indexOf(this.getItem(idVar));
        const product = newTempProducts[index];
        product.inCart = true;
        
        const price = product.price;    
        product.count = 1;    
        product.total = price;

        // update cart
        this.setState(
            () => {
                return{products:newTempProducts, cart: [...this.state.cart,product]};
            },
            () => {
                // callback function to call
                this.addTotals();
            }
        );
    };
    // manage product panel
    openModal = idVar => {
        const product = this.getItem(idVar);
        this.setState(() => {
            return{modalProduct:product, modalOpen:true};
        })
    };
    closeModal = () => {
        this.setState(() => {
            return{modalOpen:false};
        });
    };
    increment = (id) =>{
        let tempCart = [...this.state.cart];
        //retrieve the item that we want to increment from cart
        const selectedProduct = tempCart.find(item => item.id === id);

        const index = tempCart.indexOf(selectedProduct);
        const tempProduct = tempCart[index];

        tempProduct.count = tempProduct.count + 1;
        tempProduct.total = tempProduct.count * tempProduct.price;

        this.setState(()=>{
            return{cart:[...tempCart]};
        },
        ()=>{
            this.addTotals();
        }
            //callback, the totals will be changed automatiquely in the same time            
            );
    };
    decrement = (id) =>{
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item=> item.id === id);

        const index= tempCart.indexOf(selectedProduct);
        const tempProduct = tempCart[index];
        tempProduct.count = tempProduct.count - 1;
        
        // manage when the number of product is 0, we have to remove it
        if(tempProduct.count === 0){
            this.removeItem(id);
        }else{
            tempProduct.total = tempProduct.count * tempProduct.price;

            this.setState(()=>{
                return{cart:[...tempCart]};
                },
                ()=>{
                    this.addTotals();
                }
            );
        }
    };
    removeItem =(id) =>{
        // retrieve product, [...this.state.products] as like a pointer
        let tempProducts = [...this.state.products];
        let tempCart = [...this.state.cart];

        tempCart = tempCart.filter(item => item.id !== id);

        const index = tempProducts.indexOf(this.getItem(id));
        let removedProduct = tempProducts[index];
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0
        //mettre à jours les state
        this.setState(
            ()=>{
                return{
                    cart: [...tempCart],
                    products: [...tempProducts]
                };
            },
            ()=>{//callback
                this.addTotals();
            }
        )
    };
    clearCart =(id) =>{
        this.setState(()=>{
            return{cart:[]};
        },()=>{
            // Remove "Incart" word from product after click on cearCart
            // callback: copy the value and not referencing it
            this.setProducts();
            this.addTotals();
        });
    };
    addTotals =() =>{
        let subTotal = 0;
        this.state.cart.map(item => {subTotal += item.total});
        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));
        const total = subTotal + tax;
        // use setState pour mettre à jour les state
        this.setState(()=>{
            return {cartSubTotal:subTotal,
            cartTax:tax,
            cartTotal:total
             }
        })
    }
  render() {
    return (
        <ProductContext.Provider 
        value={{
            ...this.state,
            handleDetail:this.handleDetail,
            addToCart:this.addToCart,         
            openModal: this.openModal,
            closeModal: this.closeModal,
            increment:this.increment,
            decrement:this.decrement,
            removeItem:this.removeItem,
            clearCart:this.clearCart
        }}>
            {this.props.children}
        </ProductContext.Provider>
            
        
        
    );
  }
}

const ProductConsumer = ProductContext.Consumer;

export{ProductProvider,ProductConsumer};