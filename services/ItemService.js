const Item = require("../model/Item");
const fs = require('fs');

module.exports = class ItemService{
    static async getAllItems(){
        try {
            const items = await Item.find();
            return items;
        } catch (error) {
            console.log(`Could not fetch items ${error}`)
            throw error
        }
    }

    static async addItem(name, description, image, price){
        try {
            var obj = {
                name: name,
                desc: description,
                img: image,
                price: price
            }
            Item.create(obj, (err, item) => {
                if (err) {
                    throw err;
                }
                else {
                    item.save();
                }
            });
        } catch (error) {
            console.log(`Could not add item ${error}`)
            throw error
        }
    }

    static async getItembyId(itemId){
        try {
            const singleItemResponse =  await Item.findById({_id: itemId});
            return singleItemResponse;
        } catch (error) {
            console.log(`Item not found. ${error}`)
            throw error
        }
    }

    static async getItemsByPhrase(phrase){
        try {
            const items = await Item.find({name : phrase});
            return items;
        } catch (error) {
            console.log(`Could not fetch items ${error}`)
            throw error
        }
    }

    static async updateItem(_id, updated_item) {
        try {
            Item.findByIdAndUpdate(_id, updated_item);
        } catch (error) {
            console.log(`Could not fetch items ${error}`)
            throw error
        }
    }

    static async deleteItem(_id) {
        try {
            Item.findByIdAndDelete(_id);
        } catch (error) {
            console.log(`Could not fetch items ${error}`)
            throw error
        }
    }
}