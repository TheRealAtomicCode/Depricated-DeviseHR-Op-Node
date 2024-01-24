import { NextFunction, Response } from 'express';
import { IAuthenticatedOpRequest } from '../Types/OperatorRequestType';

const isAdmin = (
	req: IAuthenticatedOpRequest,
	res: Response,
	next: NextFunction
) => {
	if (
		req.decodedUser?.user_type === 1 ||
		req.decodedUser?.user_type === 2 ||
		req.decodedUser?.user_type === 3
	)
		return next();
	throw new Error('Access Denied, only Admins.');
};

const isManager = (
	req: IAuthenticatedOpRequest,
	res: Response,
	next: NextFunction
) => {
	if (
		req.decodedUser?.user_type === 1 ||
		req.decodedUser?.user_type === 2 ||
		req.decodedUser?.user_type === 3 ||
		req.decodedUser?.user_type === 4
	)
		return next();
	throw new Error('Access Denied, only Managers.');
};

export { isAdmin, isManager };
