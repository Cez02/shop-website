const UserService = require("../../services/UserService");
const ItemService = require("../../services/ItemService");

const path = require("path");
const fs = require('fs');
const HttpError = require("../../errors/GenericErrors").HttpError;

module.exports = class AdminUserController {
    static async renderPage(req, res, next){
        try {
            if(!req.session.user || !req.session.user.isAdmin) {
                res.redirect('../../');
                return;
            }
            const users = await UserService.getAllUsers();
            if(!users){
                throw Error("Error 404: could not find any users.")
            }
            res.render("admin/users", {
                users: users
            });
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }

    static async renderSearchedPage(req, res, next) {
        try{
            let phrase = req.query.phrase;
            let filteredUsers = await UserService.getUsersByPhrase(phrase);
            res.render("admin/users", { users: filteredUsers});
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }

    static async handleSearchPost(req, res, next) {
        try{
            let searchPhrase = req.body.searchbar;
            res.redirect("/admin/users/search/" + searchPhrase);
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }

    static async renderAddingForm(req, res, next){
        try {
            const userToEdit = await UserService.getUserById(req.query.user_id);
            let cart = userToEdit.cart;
            let cartItems = await Promise.all(cart.map(async (x) => await ItemService.getItembyId(x)));
            res.render("admin/user", {
                items: cartItems,
                user: userToEdit,
                action: "update"
            });

        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }

    static async updateUser(req, res, next) {
        try {
            const userToEdit = await UserService.getUserById(req.body.id);
            if (!userToEdit) {
                throw Error("404! User not found");
            }
            const up_user = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                isAdmin: Boolean(req.body.isAdmin)
            };
            await UserService.updateUser(req.body.id, up_user)
            res.redirect("../users");
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }

    static async deleteUser(req, res, next) {
        try {
            await UserService.deleteUser(req.body.id);
            res.redirect("../users");
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }
}