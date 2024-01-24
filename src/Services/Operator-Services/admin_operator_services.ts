import { prisma } from '../../DB/prismaConfig';
import {
	addOperatorFilter,
	updateOperatorFilter,
} from '../../Functions/filter_functions';
import {
	generateVerificationCode,
	sendOperatorForgetPassword,
	sendOperatorRagistration,
} from '../../Functions/node_mailer';
import { validateNonEmptyStrings } from '../../Helpers/stringValidation';
import {
	ICreateOperatorRequest,
	IUpdateOperatorRequestBody,
	IUpdateOperatorRoleRequestBody,
} from '../../Types/OperatorRequestType';

// * Create operator
const createOperator = async (
	reqBody: ICreateOperatorRequest,
	myId: number
) => {
	try {
		addOperatorFilter(reqBody);

		validateNonEmptyStrings([
			reqBody.email,
			reqBody.firstName,
			reqBody.lastName,
		]);

		const newUser = await prisma.operators.create({
			data: {
				first_name: reqBody.firstName,
				last_name: reqBody.lastName,
				email: reqBody.email,
				user_type: reqBody.user_type,
				added_by: myId,
			},
			select: {
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				user_type: true,
				created_at: true,
				updated_at: true,
				is_terminated: true,
				is_verified: true,
				added_by: true,
			},
		});

		return newUser;
	} catch {
		throw new Error('Email already exists.');
	}
};

// * edit operator
const updateOperatorRole = async (
	reqBody: IUpdateOperatorRoleRequestBody,
	myId: number
) => {
	try {
		const editedUser = await prisma.operators.update({
			where: {
				id: Number(reqBody?.opId),
			},
			data: {
				user_type: reqBody.user_type,
				updated_by_oprtator: myId,
				updated_at: new Date(),
			},
			select: {
				id: true,
				first_name: true,
				last_name: true,
				user_type: true,
				email: true,
				updated_by_oprtator: true,
				updated_at: true,
			},
		});

		return editedUser;
	} catch {
		throw new Error('failed to update the users details');
	}
};

// * edit operator role
const updateOperatorDetails = async (
	reqBody: IUpdateOperatorRequestBody,
	myId: number
) => {
	try {
		updateOperatorFilter(reqBody);

		const user = await prisma.operators.findUnique({
			where: {
				id: Number(reqBody.opId),
			},
			select: {
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				updated_by_oprtator: true,
			},
		});

		const updatedUser = await prisma.operators.update({
			where: {
				id: user?.id,
			},
			data: {
				first_name: reqBody.firstName || user?.first_name,
				last_name: reqBody.lastName || user?.last_name,
				email: reqBody.email || user?.email,
				updated_by_oprtator: myId,
				updated_at: new Date(),
			},
			select: {
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				updated_by_oprtator: true,
				updated_at: true,
			},
		});

		return updatedUser;
	} catch {
		throw new Error('Failed to update the users permission level');
	}
};

const getAllOperators = async () => {
	const operators = await prisma.operators.findMany({
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			user_type: true,
			profile_picture: true,
			is_verified: true,
			updated_at: true,
		},
	});

	return operators;
};

const getOperatorDetails = async (operatorId: number) => {
	const operator = await prisma.operators.findUniqueOrThrow({
		where: { id: operatorId },
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			user_type: true,
			profile_picture: true,
			is_terminated: true,
			is_verified: true,
			updated_at: true,
			login_attempt: true,
			last_login_time: true,
			last_active_time: true,
		},
	});

	return operator;
};

const opForgotPasswordService = async (operatorId: number, myId: number) => {
	const verificationCode = generateVerificationCode();

	const operator = await prisma.operators.findUniqueOrThrow({
		where: { id: operatorId },
		select: {
			is_verified: true,
			id: true,
			email: true,
			first_name: true,
			last_name: true,
		},
	});

	if (!operator.is_verified)
		throw new Error('Can not reset password for users who are not registered');

	await prisma.operators.update({
		where: {
			id: operatorId,
		},
		data: {
			verfication_code: verificationCode,
			updated_at: new Date(),
			updated_by_oprtator: myId,
		},
	});

	await sendOperatorForgetPassword(
		operator.id,
		operator.email,
		operator.first_name,
		operator.last_name,
		verificationCode
	);

	return operator;
};

export {
	createOperator,
	updateOperatorDetails,
	updateOperatorRole,
	getAllOperators,
	getOperatorDetails,
	opForgotPasswordService,
};
