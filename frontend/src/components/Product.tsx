import { Card } from "react-bootstrap";

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

const Product = ({ _id, name, image, price }: Props) => {
	return (
		<Card className="my-3 p-3 rounded">
			<a href={`/product/${_id}`}>
				<Card.Img src={image} variant="top" />
			</a>
			<Card.Body>
				<a href={`/product/${_id}`}>
					<Card.Title as="div">
						<strong>{name}</strong>
					</Card.Title>
				</a>

				<Card.Text as="h3">${price}</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default Product;
