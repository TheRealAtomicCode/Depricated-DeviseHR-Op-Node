import { Request } from 'express';
import { DecodedToken } from './GeneralTypes';

export interface IAuthenticatedOpRequest extends Request {
	decodedUser?: DecodedToken;
	userId?: number;
}

export interface IAddOperatorRequest {
	firstName: string | null;
	lastName: string | null;
	email: string | null;
}

export interface IUpdateOperatorRequestBody {
	opId: Number;
	firstName: string | null;
	lastName: string | null;
	email: string | null;
}

export interface IUpdateOperatorRoleRequestBody {
	opId: Number;
	user_type: 1 | 2 | 3 | 4 | 5;
}

export interface ICreateOperatorRequest {
	firstName: string;
	lastName: string;
	email: string;
	user_type: 1 | 2 | 3;
}

export interface IAddUserRequest {
	firstName: string;
	lastName: string;
	email: string;
	user_type: 1 | 3;
	companyId: number;
	sendRegistration: boolean;
}
