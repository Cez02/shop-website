const path = require("path");
const fs = require('fs');
const ItemService = require('../services/ItemService')
const HttpError = require("../errors/GenericErrors").HttpError;


module.exports = class MainPageController{
    static async openMainPage(req, res, next){
        try{
            const items = await ItemService.getAllItems();
            res.render("index", {items: items});
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }

    static async selectMainPageOption(req, res, next){
        try{
            if (req.body.profile) {
                if (req.session.user) {
                    res.redirect("/users/profile");
                } else {
                    res.redirect("/users/login");
                }
            }
            else if (req.body.add) {
                res.redirect("/items/add");
            }
            else if (req.body.searchbar) {
                let searchPhrase = req.body.searchbar;
                res.redirect("/search/" + searchPhrase);
            }
            else if (req.body.cart) {
                res.redirect("/cart");
            } 
            else {
                const items = await ItemService.getAllItems();
                res.render("index", {items: items});
            }
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }

    static async searchForItem(req, res, next){
        try{
            let phrase = req.params.phrase;
            let filteredItems = await ItemService.getItemsByPhrase(phrase);
            res.render("index", { items: filteredItems});
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }
}