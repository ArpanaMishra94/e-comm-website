import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "./Rating";

interface Props {
	_id: string;
	name: string;
	image: string;
	description: string;
	brand: string;
	category: string;
	price: number;
	countInStock: number;
	rating: number;
	numReviews: number;
}

const Product = ({ _id, name, image, price, rating, numReviews }: Props) => {
	return (
		<Card className="my-3 p-3 rounded">
			<Link to={`/product/${_id}`}>
				<Card.Img src={image} variant="top" />
			</Link>
			<Card.Body>
				<Link to={`/product/${_id}`}>
					<Card.Title as="div" className="product-title">
						<strong>{name}</strong>
					</Card.Title>
				</Link>

				<Card.Text as="div">
					<Rating value={rating} text={`${numReviews} reviews`} />
				</Card.Text>

				<Card.Text as="h3">${price}</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default Product;
