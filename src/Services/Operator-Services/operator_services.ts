import { compare, hash } from 'bcrypt';
import { prisma, operators } from '../../DB/prismaConfig';
import { sign, verify } from 'jsonwebtoken';
import client from '../../DB/connection';

import verifyAccess from '../../Middleware/verify_access';
import deleteAllRefreshTokens from '../../Functions/delete_add_refresh_tokens';
import { DecodedVerificationToken } from '../../Types/GeneralTypes';
import { isStrongPassword } from '../../Helpers/stringValidation';

// * get operator by id
const getOperatorById = async (id: number) => {
	const user = await prisma.operators.findUnique({
		where: { id },
	});

	return user;
};

// * get operator by email and password
const findOperatorByCredentials = async (email: string, password: string) => {
	email = email.trim().toLocaleLowerCase();

	const user = await prisma.operators.findUnique({
		where: { email },
	});

	if (!user) throw new Error('Incorrect Email or Password.');

	verifyAccess(user.is_verified, user.is_terminated, user.login_attempt!);

	const isMatch = await compare(password, user.password_hash!);

	if (!isMatch) {
		// * if user failed to login multiple times then the login attept will increment
		await prisma.operators.update({
			where: { id: user.id },
			data: {
				login_attempt: { increment: 1 },
			},
		});

		throw new Error('Incorrect Email or Password');
	} else {
		// * if password was correct, then login attept will go down to 0
		await prisma.operators.update({
			where: { id: user.id },
			data: {
				login_attempt: 0,
			},
		});
	}

	return user;
};

// * generate and add refresh token with jwt and add refresh token to db
const genarateOperatorAuthToken = async (user: operators) => {
	const token = await sign(
		{
			id: user.id.toString(),
			user_type: user.user_type,
			firstName: user.first_name,
			lastName: user.last_name,
			email: user.email,
		},
		process.env.JWT_SECRET!,
		{
			expiresIn: process.env.EXPTIME!,
		}
	);

	const refreshToken = sign(
		{ id: user.id.toString(), user_type: user.user_type },
		process.env.JWT_REFRESH_SECRET!,
		{
			expiresIn: process.env.EXPTIME!,
		}
	);

	if (user.refresh_tokens.length > 6) {
		// * id refresh tokens are above 6 then delete all previous refresh tokens
		await deleteAllRefreshTokens(user.id);
	}

	const query = {
		where: {
			id: user.id,
		},
		data: {
			refresh_tokens: { push: refreshToken },
			last_login_time: new Date(),
			last_active_time: new Date(),
		},
	};

	await prisma.operators.update(query);

	return { token, refreshToken };
};

// * get operator by id
const findOperatorAndReplaceRefreshToken = async (
	id: number,
	user_type: number,
	oldRefreshToken: string
) => {
	// create new refresh token
	const newRefreshToken = sign(
		{ id: id.toString(), user_type: user_type },
		process.env.JWT_REFRESH_SECRET!,
		{
			expiresIn: process.env.EXPTIME!,
		}
	);

	const user = await prisma.operators.findFirstOrThrow({
		where: {
			AND: [
				{ id },
				{
					refresh_tokens: {
						has: oldRefreshToken,
					},
				},
			],
		},
	});

	if (!user) throw new Error('Please Authenticate.');

	verifyAccess(user.is_verified, user.is_terminated, user.login_attempt!);

	const refreshedUser = await prisma.operators.update({
		where: {
			id,
		},
		data: {
			refresh_tokens: {
				set: [
					...user.refresh_tokens.filter(
						(token: any) => token !== oldRefreshToken
					),
					newRefreshToken,
				],
			},
			last_active_time: new Date(),
		},
	});

	const newToken = await sign(
		{
			id: user.id.toString(),
			user_type: user.user_type,
			firstName: user.first_name,
			lastName: user.last_name,
			email: user.email,
		},
		process.env.JWT_SECRET!,
		{
			expiresIn: process.env.EXPTIME!,
		}
	);

	return { refreshedUser, newRefreshToken, newToken };
};

const updateVerificationToken = async (
	operatorId: number,
	verificationCode: string
) => {
	const user = await prisma.operators.update({
		where: { id: operatorId },
		data: {
			verfication_code: verificationCode,
		},
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
		},
	});

	return user;
};

export {
	getOperatorById,
	findOperatorByCredentials,
	genarateOperatorAuthToken,
	findOperatorAndReplaceRefreshToken,
	updateVerificationToken,
};
