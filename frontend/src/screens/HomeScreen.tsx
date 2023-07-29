import { Row, Col } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import ProductProp from "../types/products";
import { useEffect } from "react";

const HomeScreen = () => {
	const { pageNumber } = useParams();
	const { data, isLoading, error } = useGetProductsQuery({ pageNumber });
	const parsedError = JSON.stringify(error);

	useEffect(() => {
		console.log(error);
		// console.log(isLoading);
		// console.log(products);
	}, [error]);

	return (
		<>
			{isLoading ? (
				<Loader />
			) : error ? (
				// <Message variant="danger">{error?.data?.message}</Message>    // Check Type
				<Message variant="danger">{parsedError}</Message>
			) : (
				<>
					<h1>Latest Products</h1>
					<Row>
						{data.products?.map((product: ProductProp) => (
							<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
								<Product {...product} />
							</Col>
						))}
					</Row>
				</>
			)}
		</>
	);
};

export default HomeScreen;
