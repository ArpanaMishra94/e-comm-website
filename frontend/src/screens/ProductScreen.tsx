import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Button } from "react-bootstrap";
import { useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Rating from "../components/Rating";
// import ProductProp from "../types/products";

const ProductScreen = () => {
	const { id: productId } = useParams<{ id: string }>();
	const { data: product, isLoading, error } = useGetProductDetailsQuery(productId);

	useEffect(() => {
		console.log(product);
		// console.log(isLoading);
		// console.log(error);
	}, [product])

	return (
		<>
			<Link to="/" className="btn btn-light my-3">
				Go Back
			</Link>
			{isLoading ? (
				<Loader />
			) : error ? (
				<div>error</div>
			) : (
				<>
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
											text={`${product.numReviews} reviews`}
										/>
									</ListGroup.Item>
									<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
									<ListGroup.Item>
										Description: ${product.description}
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
													<strong>${product.price}</strong>
												</Col>
											</Row>
										</ListGroup.Item>

										<ListGroup.Item>
											<Row>
												<Col>Status:</Col>
												<Col>
													<strong>
														{product.countInStock > 0
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
												disabled={product.countInStock === 0}
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
					)};
				</>
			)}
		</>
	);
};

export default ProductScreen;
