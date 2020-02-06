module.exports = function Cart(oldCart) {
    this.products = oldCart.products || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function(product, id) {
        let storedProduct = this.products[id];

        if (!storedProduct) {
            storedProduct = this.products[id] = {product: product, qty: 0, price: 0};
        }
        storedProduct.qty++;
        storedProduct.price = storedProduct.product.price * storedProduct.qty;
        this.totalQty++;
        this.totalPrice += storedProduct.product.price;
    };

    
    this.remove = function(product, id) {
        let storedProduct = this.products[id];

        storedProduct.qty--;
        storedProduct.price = storedProduct.product.price * storedProduct.qty;
        this.totalQty--;
        this.totalPrice -= storedProduct.product.price;
    };

    this.getArray = function() {
        let arr = [];
        for (let id in this.products){
            arr.push(this.products[id]);
        }
        return arr;
    };

};