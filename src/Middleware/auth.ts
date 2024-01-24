import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { IAuthenticatedOpRequest } from '../Types/OperatorRequestType';
import { DecodedToken } from '../Types/GeneralTypes';

const auth = async (
	req: IAuthenticatedOpRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');
		console.log(process.env.JWT_SECRET);
		if (!token) throw new Error('Please Authenticate');
		const decode = (await verify(
			token,
			process.env.JWT_SECRET!
		)) as DecodedToken;

		req.decodedUser = decode;
		req.userId = Number(decode.id);

		next();
	} catch (err: any) {
		res.status(400).send({
			data: null,
			success: false,
			message: err.message,
		});
	}
};

export default auth;
