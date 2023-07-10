import { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import Product from "../components/Product";
import ProductProp from "../types/products";

const HomeScreen = () => {
	const [products, setProducts] = useState<ProductProp[]>([]);

	useEffect(() => {
		const fetchProducts = async () => {
			const { data } = await axios.get<ProductProp[]>("/api/products");
			setProducts(data);
		};
		fetchProducts();
	}, []);

	return (
		<>
			<h1>Latest Products</h1>
			<Row>
				{products.map((product) => (
					<Col key={product._id} sm={12} md={6} lg={4} xl={3}>
						<Product {...product} />
					</Col>
				))}
			</Row>
		</>
	);
};

export default HomeScreen;
