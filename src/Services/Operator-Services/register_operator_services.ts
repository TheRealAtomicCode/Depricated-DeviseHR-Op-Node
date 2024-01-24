import { verify } from 'jsonwebtoken';
import { prisma } from '../../DB/prismaConfig';
import { isStrongPassword } from '../../Helpers/stringValidation';
import { DecodedVerificationToken } from '../../Types/GeneralTypes';
import { hash } from 'bcrypt';

const getAndCheckRegistrationProfile = async (id: number, code: string) => {
	let user;
	try {
		const query = {
			where: {
				id,
			},
			select: {
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				is_terminated: true,
				is_verified: true,
				verfication_code: true,
			},
		};
		user = await prisma.operators.findUnique(query);
	} catch (err: any) {
		throw new Error('Failed to locate operator.');
	}

	if (!user || !user.verfication_code || user.is_terminated)
		throw new Error('Invalid Request');

	if (user.verfication_code !== code) throw new Error('Invalid request.');

	return user;
};

const createPassword = async (
	id: number,
	password: string,
	code: string,
	checkIsVerifies: boolean
) => {
	let user;
	try {
		user = await prisma.operators.findUniqueOrThrow({
			where: {
				id,
			},
		});
	} catch (err: any) {
		throw new Error('Failed to locate User.');
	}

	if (!user || user?.is_terminated) throw new Error('Invalid request');

	if (checkIsVerifies) {
		if (user.is_verified) throw new Error('Invalid request');
	}

	if (user.verfication_code !== code) throw new Error('Invalid request.');

	password = password.trim();
	isStrongPassword(password);

	const hashedPassword = await hash(password, 10);

	const updateUserQuery = {
		where: {
			id,
		},
		data: {
			password_hash: hashedPassword,
			is_verified: true,
			verfication_code: null,
		},
	};

	await prisma.operators.update(updateUserQuery);

	return { success: 'password updated' };
};

const logMeOut = async (myId: number, refreshToken: string) => {
	let me;
	try {
		me = await prisma.operators.findUnique({
			where: {
				id: myId,
			},
			select: {
				refresh_tokens: true,
			},
		});
	} catch (err: any) {
		throw new Error('Failed to locate operator for logout.');
	}

	const filteredTokens = me?.refresh_tokens.filter(
		(token) => token != refreshToken
	);

	await prisma.operators.update({
		where: {
			id: myId,
		},
		data: {
			refresh_tokens: filteredTokens || [],
		},
	});
};

const logMeOutAllDevices = async (myId: number) => {
	try {
		await prisma.operators.update({
			where: {
				id: myId,
			},
			data: {
				refresh_tokens: [],
			},
		});
	} catch (err: any) {
		throw new Error('Logout failed.');
	}
};

export {
	getAndCheckRegistrationProfile,
	createPassword,
	logMeOut,
	logMeOutAllDevices,
};
