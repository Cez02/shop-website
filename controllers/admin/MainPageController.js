const UserService = require("../../services/UserService");
const path = require("path");
const fs = require('fs');
const HttpError = require("../../errors/GenericErrors").HttpError;


module.exports = class AdminMainController {
    static async renderPage(req, res, next){
        try {
            if(!req.session.user || !req.session.user.isAdmin) {
                res.redirect('../');
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

    static async redirectPage(req, res, next) {
        try {
            if (req.body.users) {
                res.redirect("/admin/users");
            } else if (req.body.items) {
                res.redirect("/admin/items");
            } else if (req.body.orders) {
                res.redirect("/admin/orders");
            } else {
                res.render("admin/users", {users: UserService.getAllUsers()});
            }
            
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }
}