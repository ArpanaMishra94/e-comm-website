import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import {
	PayPalButtons,
	usePayPalScriptReducer,
	SCRIPT_LOADING_STATE,
} from "@paypal/react-paypal-js";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {
	useGetOrderDetailsQuery,
	usePayOrderMutation,
	useGetPayPalClientIdQuery,
	useDeliverOrderMutation,
} from "../slices/ordersApiSlice";

const OrderScreen = () => {
	const { id: orderId } = useParams();

	const {
		data: order,
		refetch,
		isLoading,
		error,
	} = useGetOrderDetailsQuery(orderId);

	const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

	const [deliverOrder, { isLoading: loadingDeliver }] =
		useDeliverOrderMutation();

	const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

	const {
		data: paypal,
		isLoading: loadingPayPal,
		error: errorPayPal,
	} = useGetPayPalClientIdQuery({});

	// console.log(isPending);

	const { userInfo } = useSelector((state: any) => state.auth);

	useEffect(() => {
		if (!errorPayPal && !loadingPayPal && paypal.clientId) {
			const loadPayPalScript = async () => {
				paypalDispatch({
					type: "resetOptions",
					value: {
						clientId: paypal.clientId,
						currency: "USD",
					},
				});
				paypalDispatch({
					type: "setLoadingStatus",
					value: SCRIPT_LOADING_STATE.PENDING,
				});
			};
			if (order && !order.isPaid) {
				if (!window.paypal) {
					loadPayPalScript();
				}
			}
		}
	}, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

	function onApprove(data: any, actions: any) {
		return actions.order.capture().then(async function (details: any) {
			try {
				await payOrder({ orderId, details });
				refetch();
				toast.success("Payment successful");
			} catch (err) {
				// toast.error(err?.data?.message || err.message);
				toast.error("err");
			}
		});
	}
	// async function onApproveTest() {
	// 	await payOrder({ orderId, details: { payer: {} } });
	// 	refetch();
	// 	toast.success("Payment successful");
	// }
	function onError(error: any) {
		toast.error(error.message);
	}
	function createOrder(data: any, actions: any) {
		return actions.order
			.create({
				purchase_units: [
					{
						amount: {
							value: order.totalPrice,
						},
					},
				],
			})
			.then((orderId: any) => {
				return orderId;
			});
	}

	const deliverOrderHandler = async () => {
		try {
			await deliverOrder(orderId);
			refetch();
			toast.success("Order delivered");
		} catch (err) {
			// toast.error(err?.data?.message || err.message);
			toast.error("error");
		}
	};

	return isLoading ? (
		<Loader />
	) : error ? (
		<Message variant="danger">error</Message>
	) : (
		<>
			<h1>Order {order._id}</h1>
			<Row>
				<Col md={8}>
					<ListGroup variant="flush">
						<ListGroup.Item>
							<h2>Shipping</h2>
							<p>
								<strong>Name: </strong> {order.user.name}
							</p>
							<p>
								<strong>Email: </strong> {order.user.email}
							</p>
							<p>
								<strong>Address: </strong>
								{order.shippingAddress.address}, {order.shippingAddress.city}{" "}
								{order.shippingAddress.postalCode},{" "}
								{order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Message variant="success">
									Delivered on {order.deliveredAt}
								</Message>
							) : (
								<Message variant="danger">Not Delivered</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Payment Method</h2>
							<p>
								<strong>Method: </strong>
								{order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant="success">Paid on {order.paidAt}</Message>
							) : (
								<Message variant="danger">Not Paid</Message>
							)}
						</ListGroup.Item>

						<ListGroup.Item>
							<h2>Order Items</h2>
							{order.orderItems.map((item: any, index: any) => (
								<ListGroup.Item key={index}>
									<Row>
										<Col md={1}>
											<Image src={item.image} alt={item.name} fluid rounded />
										</Col>
										<Col>
											<Link to={`/product/${item.product}`}>{item.name}</Link>
										</Col>
										<Col md={4}>
											{item.qty} x ${item.price} = ${item.qty * item.price}
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h2>Order Summary</h2>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Items</Col>
									<Col>${order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Shipping</Col>
									<Col>${order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Tax</Col>
									<Col>${order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>Total</Col>
									<Col>${order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>

							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}

									{isPending ? (
										<Loader />
									) : (
										<div>
											{/* THIS BUTTON IS FOR TESTING! REMOVE BEFORE PRODUCTION! */}
											{/* <Button
												style={{ marginBottom: "10px" }}
												onClick={onApproveTest}
											>
												Test Pay Order
											</Button> */}
											<div>
												<PayPalButtons
													createOrder={createOrder}
													onApprove={onApprove}
													onError={onError}
												></PayPalButtons>
											</div>
										</div>
									)}
								</ListGroup.Item>
							)}

							{loadingDeliver && <Loader />}

							{userInfo &&
								userInfo.isAdmin &&
								order.isPaid &&
								!order.isDelivered && (
									<ListGroup.Item>
										<Button
											type="button"
											className="btn btn-block"
											onClick={deliverOrderHandler}
										>
											Mark as Delivered
										</Button>
									</ListGroup.Item>
								)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default OrderScreen;
