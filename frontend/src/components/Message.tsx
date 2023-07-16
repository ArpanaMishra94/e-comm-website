import React, { ReactNode } from "react";
import { Alert } from "react-bootstrap";

interface Prop {
	variant: string;
	children: ReactNode;
}

const Message = ({ variant, children }: Prop) => {
	return (
		<div>
			<Alert variant={variant}>{children}</Alert>
		</div>
	);
};

Message.defaultProps = {
	variant: "info",
};

export default Message;
