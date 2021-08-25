import Storage from "./Storage";

class UI {

  displayProducts(productsDOM, products) {
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
    productsDOM.innerHTML = result;
  }

  getBagButtons(
    cart, 
    buttonDOM, 
    cartTotal, 
    cartItems,
    cartList,
    cartDOM, 
    cartOverlay
  ) {

    const buttons = [...document.querySelectorAll('.bag-btn')];

    buttons.forEach(button => {
      // Get button id
      const id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);

      if(inCart) {
        button.disabled = true;
        button.innerText = `In Cart`;
      }
      button.addEventListener("click", (e) => {
        e.target.disabled = true;
        e.target.innerText = `In Cart`;
        // Get product from products
        let cartItem = {...Storage.getProduct(id), amount: 1};
        // Add product to the cart
        cart = [...cart, cartItem];
        // Save cart to local storage
        Storage.saveCart(cart); 
        // set cart values
        this.setCartValues(cart, cartItems, cartTotal);
        // Add cart item
        this.addCartItem(cartItem, cartList);
        // Display cart
        this.showCart(cartDOM, cartOverlay)
      });
    });
  }

  setCartValues(cart, items, total) {
    let itemsTotal = 0;
    let tempTotal = 0;

    cart.forEach(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount; 
    });
    
    total.innerText = parseFloat(tempTotal.toFixed(2));
    items.innerText = itemsTotal;
  } 

  addCartItem(item, list) {
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
    list.appendChild(div);
  }

  showCart(cartDOM, cartOverlay) {
    cartDOM.classList.add('showCart');
    cartOverlay.classList.add('transparentBcg');
  }
}

export default UI;