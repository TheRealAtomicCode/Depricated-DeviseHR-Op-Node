export type DecodedToken = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	user_type: 1 | 2 | 3 | 4 | 5;
	iat: number;
};

export type DecodedVerificationToken = {
	id: string;
	iat: number;
	verificationCode: string;
};
