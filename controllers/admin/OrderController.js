const OrderService = require("../../services/OrderService");
const ItemService = require("../../services/ItemService");
const Order = require("../../model/Order");
const HttpError = require("../../errors/GenericErrors").HttpError;
module.exports = class AdminOrderController {
    static async renderPage(req, res, next){
        try {
            if(!req.session.user || !req.session.user.isAdmin) {
                res.redirect('../../');
                return;
            }
            const orders = await OrderService.getAllOrders();
            if(!orders){
                throw Error("Error 404: could not find any orders.")
            }
            const ordersCart = await Promise.all(orders.map(async (order) => await Promise.all(order.products.map(async (x) => await ItemService.getItembyId(x)))));
            res.render("admin/orders", {
                orders: orders,
                items: ordersCart
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
            let phrase = req.params.phrase;
            let filteredItems = await OrderService.getOrdersByDate(phrase);
            res.render("admin/orders", { orders: filteredItems});
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }

    static async changeOrderStatus(req, res, next) {
        try{
            const order = OrderService.getOrderById(req.body.id);
            if (!order) {
                throw Error("404! Item not found");
            }
            const updated_order = {
                orderStatus: req.body.orderStatus
            };
            await OrderService.updateOrder(req.body.id, updated_order)
            res.redirect("../orders");
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
            res.redirect("/admin/orders/search/" + searchPhrase);
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }

    static async renderAddingForm(req, res, next){
        try {
            const orderToEdit = await OrderService.getOrderById(req.params.order_id);
            let cart = orderToEdit.products;
            let cartItems = await Promise.all(cart.map(async (x) => await ItemService.getItembyId(x)));
            res.render("admin/order", {
                        items: cartItems,
                        order: orderToEdit,
                        action: "update"
                    });
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }


    static async updateOrder(req, res, next) {
        try {
            const order = OrderService.getOrderById(req.body.id);
            if (!order) {
                throw Error("404! Item not found");
            }
            const updated_order = {
                id: req.body.id,
                user_email: req.body.user_email,
                date: req.body.date,
                price: req.body.price,
               
            };
            await OrderService.updateOrder(req.body.id, updated_order)
            res.redirect("../orders");
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }

    static async deleteOrder(req, res, next) {
        try {
            await OrderService.deleteOrder(req.body.id);
            res.redirect("../orders");
        } catch (error) {
            if(error instanceof HttpError)
                res.status(error.status_code).json({error: error.message});
            else
                throw error;
        }
    }
}