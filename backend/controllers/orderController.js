import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";


// @desc  Create new order
// @route  POST/api/orders
// @access Private
const addOrderItems = asyncHandler(async (req, resp) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body;

    if(orderItems && orderItems.length === 0) {
        resp.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        resp.status(201).json(createdOrder);
    }
});

// @desc  Get logged in user orders
// @route  GET/api/orders/myorders
// @access Private
const getMyOrders = asyncHandler(async (req, resp) => { 
    const orders = await Order.find({user: req.user._id});
    resp.status(200).json(orders);
});

// @desc  Get order by ID
// @route  GET/api/orders/:id
// @access Private
const getOrderById = asyncHandler(async (req, resp) => { 
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(order) {
        resp.status(200).json(order);
    } else {
        resp.status(404);
        throw new Error('Order not found');
    }
});

// @desc Update order to paid
// @route  PUT/api/orders/:id/pay
// @access Private
const updateOrderToPaid = asyncHandler(async (req, resp) => { 
    const order = await Order.findById(req.params.id);

    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();
        resp.status(200).json(updatedOrder);
    } else {
        resp.status(404);
        throw new Error('Order not found');
    }
});

// @desc Update order to delivered
// @route  PUT/api/orders/:id/deliver
// @access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, resp) => { 
    resp.send('update order to delivered');
});

// @desc Get all orders
// @route  GET/api/orders
// @access Private/Admin
const getOrders = asyncHandler(async (req, resp) => { 
    const orders = await Order.find({}).populate('user', 'id name');
    resp.status(200).json(orders);
});

export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders,
};