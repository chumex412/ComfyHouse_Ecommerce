import Products from "./Product";
import UI from "./UI";
import Storage from "./Storage";

// UI Elements 
const cartOverlay = document.querySelector('.cart-overlay'),
      cartDOM = document.querySelector('.cart'),
      closeBtn = document.querySelector('.close-cart'),
      cartTotal = document.querySelector('.cart-total'),
      clearCart = document.querySelector('.clear-cart'),
      productDOM = document.querySelector('.product-content'),
      cartBtn = document.querySelector('.cart-btn'),
      cartList = document.querySelector('.cart-list'),
      cartItems = document.querySelector('.cart-items');

let cart = [];
let buttonDOM;


// Render immediately after browser loads
document.addEventListener('DOMContentLoaded', () => {

  const products = new Products;
  const ui = new UI;

  products.getProducts()
    .then(product => {
      // Display products in the UI
      ui.displayProducts(productDOM, product);

      // Set products to local storage
      Storage.saveProducts(product);
    })
    .then( () => {
      ui.getBagButtons(
        cart, 
        buttonDOM, 
        cartTotal, 
        cartItems, 
        cartList,
        cartDOM,
        cartOverlay
      );
    })
});