import Products from "./Product";
import UI from "./UI";
import Storage from "./Storage";


// Render immediately after browser loads
document.addEventListener('DOMContentLoaded', () => {

  const products = new Products;
  const ui = new UI;

  products.getProducts()
    .then(product => {
      // Display products in the UI
      ui.displayProducts(product);
      
      ui.setupAPP();

      // Set products to local storage
      Storage.saveProducts(product);
    })
    .then( () => {
      ui.getBagButtons();
      ui.cartLogic();
    })
});