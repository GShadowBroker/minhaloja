'use strict';

module.exports = function Favorites(oldFavorites) {
    this.products = oldFavorites.products || {};
    this.qty = oldFavorites.qty || 0;

    this.add = function(product, id) {
        let storedFavorite = this.products[id];
        this.qty++;

        if (!storedFavorite){
            storedFavorite = this.products[id] = product;
        }
    };

    this.remove = function(id){
        let storedFavorite = this.products[id];
        this.qty--;

        if (storedFavorite) {
            delete this.products[id];
        }
    };

    this.getArray = function(){
        let arr = [];

        for (let id in this.products){
            arr.push(this.products[id]);
        }
        return arr;
    }
};