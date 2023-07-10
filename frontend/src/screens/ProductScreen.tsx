import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
// import products from "../products";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import Rating from "../components/Rating";
import ProductProp from "../types/products";

const ProductScreen = () => {
	const [product, setProduct] = useState<ProductProp>();

	const { id: productId } = useParams<{ id: string }>();

	useEffect(() => {
		const fetchProducts = async () => {
			const { data } = await axios.get<ProductProp>(
				`/api/products/${productId}`
			);
			setProduct(data);
		};
		fetchProducts();
	}, [productId]);

	return (
		<>
			<Link to="/" className="btn btn-light my-3">
				Go Back
			</Link>
			{product ? (
				<Row>
					<Col md={5}>
						<Image src={product.image} alt={product.name} fluid />
					</Col>
					<Col md={4}>
						<ListGroup variant="flush">
							<ListGroup.Item>
								<h3>{product?.name}</h3>
							</ListGroup.Item>
							<ListGroup.Item>
								<Rating
									value={product.rating}
									text={`${product?.numReviews} reviews`}
								/>
							</ListGroup.Item>
							<ListGroup.Item>Price: ${product?.price}</ListGroup.Item>
							<ListGroup.Item>
								Description: ${product?.description}
							</ListGroup.Item>
						</ListGroup>
					</Col>
					<Col md={3}>
						<Card>
							<ListGroup variant="flush">
								<ListGroup.Item>
									<Row>
										<Col>Price:</Col>
										<Col>
											<strong>${product?.price}</strong>
										</Col>
									</Row>
								</ListGroup.Item>

								<ListGroup.Item>
									<Row>
										<Col>Status:</Col>
										<Col>
											<strong>
												{product!.countInStock > 0
													? "In Stock"
													: "Out Of Stock"}
											</strong>
										</Col>
									</Row>
								</ListGroup.Item>

								<ListGroup.Item>
									<Button
										className="btn-block"
										type="button"
										disabled={product?.countInStock === 0}
									>
										Add To Cart
									</Button>
								</ListGroup.Item>
							</ListGroup>
						</Card>
					</Col>
				</Row>
			) : (
				<div>No product</div>
			)}
			;
		</>
	);
};

export default ProductScreen;
