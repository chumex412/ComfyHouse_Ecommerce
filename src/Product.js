class Products {

  async getProducts() {
    try {
      const response = await fetch('../api/product.json');

      const resData = await response.json();
      let products = resData.items;

      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;

        const { url } = item.fields.image.fields.file;
        return {title, price, url, id};
      });

      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

export default Products;