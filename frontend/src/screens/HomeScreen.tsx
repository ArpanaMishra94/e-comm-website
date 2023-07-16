import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import { useGetProductsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import ProductProp from "../types/products";
import { useEffect } from "react";

const HomeScreen = () => {
	const { data: products, isLoading, error } = useGetProductsQuery({});
	const parsedError = JSON.stringify(error);

	useEffect(() => {
		console.log(error);
		// console.log(isLoading);
		// console.log(products);
	}, [error])

	return (
		<>
			{
				isLoading ? (
					<Loader/>
				) : error ? (
					// <div>{error?.data?.message}</div>    // Check Type
					<div>{parsedError}</div>
				) : (
					<>
						<h1>Latest Products</h1>
						<Row>
							{products?.map((product: ProductProp) => (
								<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
									<Product {...product} />
								</Col>
							))}
						</Row>
					</>
				)
			}
		</>
	);
};

export default HomeScreen;
