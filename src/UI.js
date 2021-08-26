import Storage from "./Storage";
import { 
  cartOverlay, 
  cartDOM, 
  closeBtn, 
  cartTotal, 
  clearCartBtn, 
  productDOM, 
  cartBtn, 
  cartList, 
  cartItems,  
} from "./variables";

let cart = [];
let buttonDOM;

class UI {

  displayProducts(products) {
    let result = '';

    products.forEach(product => {
      result += `
        <article class="product">
          <div class="img-container">
            <img src=${product.url} alt=${product.title} class="product-img">
            <button class="bag-btn" data-id=${product.id}>
              <svg height="24px" width="24px" class="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M15.55 13a2 2 0 001.75-1.03l3.58-6.49A1 1 0 0020.01 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44A2 2 0 007 
                17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18a2 2 0 10.01 4A2 2 0 007 18zm10 0a2 2 0 10.01 
                4 2 2 0 00-.01-4z" />
              </svg>
              Add to bag
            </button>
          </div>
          <div class="product-info">
            <h3 class="h4">${product.title}</h3>
            <h4 class="parag">$${product.price}</h4>
          </div>
        </article>
      `;
    });
    productDOM.innerHTML = result;
  }

  getBagButtons() {

    const buttons = [...document.querySelectorAll('.bag-btn')];
    // Spread button to class variable
    buttonDOM = buttons;

    buttons.forEach(button => {
      // Get button id
      const id = button.dataset.id;
    
      // Check if product is in cart
      let inCart = cart.find(item => item.id === id);
      if(inCart) {
        this.handleProductBtn(true, button)
      }

      button.addEventListener("click", (e) => {
        this.handleProductBtn(true, e.target);
        // Get product from products
        let cartItem = {...Storage.getProduct(id), amount: 1};
        cart = [...cart, cartItem]
        // Add product to the cart
        this.productCart = cartItem;
        // Save cart to local storage
        Storage.saveCart(cart); 
        // set cart values
        this.setCartValues(cart);
        // Add cart item
        this.addCartItem(cartItem);
        // Display cart
        this.showCart("open")
      });
    });
  }

  handleProductBtn(disable, button) {
    if(disable) {
      // Disable button
      button.disabled = disable;
      button.innerText = `In Cart`;
    } else {
      // Enable button
      button.disabled = disable;
      button.innerHTML = `
        <svg height="24px" width="24px" class="cart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M15.55 13a2 2 0 001.75-1.03l3.58-6.49A1 1 0 0020.01 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.44A2 2 0 007 
          17h12v-2H7l1.1-2h7.45zM6.16 6h12.15l-2.76 5H8.53L6.16 6zM7 18a2 2 0 10.01 4A2 2 0 007 18zm10 0a2 2 0 10.01 
          4 2 2 0 00-.01-4z" />
        </svg>
        Add to bag
      `;
    }
  }

  setCartValues(cart) {
    let itemsTotal = 0;
    let tempTotal = 0;

    cart.forEach(item => {
      // Sum of total amount in cart
      tempTotal += item.price * item.amount;
      // Sum of total items in cart
      itemsTotal += item.amount; 
    });
    
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  } 

  addCartItem(item) {
    // Create div element
    const div = document.createElement('div');
    // Give  div a class value
    div.className = 'cart-item';
    // Insert elements into div
    div.innerHTML = `
      <img src=${item.url} alt=${item.title}>
      <div class="item-info">
        <h4 class="parag">${item.title}</h4>
        <h5 class="h5">$${item.price}</h5>
        <span class="remove-item parag" data-id=${item.id}>remove</span>
      </div>
      <div class="item-count">
        <svg class="increment" data-id=${item.id}>
          <use xlink:href="#upIcon"></use>
        </svg>
        <p class="parag item-amount">${item.amount}</p>
        <svg class="decrement" data-id=${item.id}>
          <use xlink:href="#downIcon"></use>
        </svg>
      </div>
    `;

    // Append div to Cart list
    cartList.appendChild(div);
  }

  showCart(action) {
    // Show cart
    if(action === "open") {
      // Show cart
      cartDOM.classList.add('showCart');
      cartOverlay.classList.add('transparentBcg');
    } else {
      // Hide cart
      cartDOM.classList.remove('showCart');
      cartOverlay.classList.remove('transparentBcg');
    }
  }

  setupAPP() {
    // Get cart from local storage
    cart = Storage.getCart();
    // Set cart amount and items value
    this.setCartValues(cart);
    // Add items from gotten from local stoage to cart in DOM
    this.populateCart(cart);
    // Show cart listener
    cartBtn.addEventListener('click', () => this.showCart("open"));
    //Hide cart listener 
    closeBtn.addEventListener('click', () => this.showCart("close"))
  }

  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }

  cartLogic() {
    clearCartBtn.addEventListener('click', this.clearCart);
    cartList.addEventListener('click', e => {
      if(e.target.classList.contains('remove-item')) {
        const removeItem = e.target;
        const id = removeItem.dataset.id;
        cartList.removeChild(e.target.parentElement.parentElement);
        this.removeItem(id);
      } else if(e.target.classList.contains('increment')) {
        let addAmount = e.target;
        let id = addAmount.dataset.id;
        const tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if(e.target.classList.contains('decrement')) {
        let subsAmount = e.target;
        const id = subsAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if(tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          subsAmount.previousElementSibling.innerText = tempItem.amount;
        } else {
          cartList.removeChild(subsAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    })
  }

  clearCart = () => {
    let cartProducts = cart.map(item => item.id);
    cartProducts.forEach(id => this.removeItem(id));
    while(cartList.firstChild) {
      cartList.removeChild(cartList.firstChild);
    }
  }

  removeItem(id) {
    cart = cart.filter(item => item.id !== id)
    Storage.saveCart(cart);
    this.setCartValues(cart);
    let button = this.getSingleButton(id);
    this.handleProductBtn(false, button);
  }

  getSingleButton(id) {
    return buttonDOM.find(button => button.dataset.id === id);
  }
}

export default UI;