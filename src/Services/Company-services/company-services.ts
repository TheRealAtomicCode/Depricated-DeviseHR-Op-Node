import { prisma } from '../../DB/prismaConfig';

const getCompanyWithUserById = async (id: number) => {
	const company = await prisma.companies.findUniqueOrThrow({
		where: {
			id,
		},
		select: {
			id: true,
			name: true,
			licence_number: true,
			account_number: true,
			logo: true,
			country: true,
			main_contact_id: true,
			created_at: true,
			updated_at: true,
			max_users_allowed: true,
			security_question_one: true,
			security_question_two: true,
			security_answer_two: true,
			expiration_date: true,
			phone_number: true,
			added_by_operator: true,
			users: {
				select: {
					id: true,
					first_name: true,
					last_name: true,
					email: true,
					is_terminated: true,
					is_verified: true,
					role_id: true,
					user_type: true,
				},
			},
		},
	});

	return company;
};

const getUserWithCompanyById = async (id: number) => {
	try {
		const user = await prisma.users.findUniqueOrThrow({
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
				role_id: true,
				user_type: true,
				created_at: true,
				updated_at: true,
				added_by_user: true,
				updated_by_operator: true,
				updated_by_user: true,
				login_attempt: true,
				last_login_time: true,
				last_active_time: true,
				companies: {
					select: {
						id: true,
						name: true,
						expiration_date: true,
					},
				},
			},
		});

		return user;
	} catch (err: any) {
		throw new Error('Failed to locate user.');
	}
};

const findCompany = async (searchTerm: string) => {
	const companies = await prisma.companies.findMany({
		where: {
			OR: [
				{ name: { contains: searchTerm, mode: 'insensitive' } },
				{ account_number: searchTerm },
			],
		},
		select: {
			id: true,
			name: true,
			licence_number: true,
			account_number: true,
			expiration_date: true,
			phone_number: true,
			added_by_operator: true,
		},
	});

	return companies;
};

const findUsers = async (searchTerm: string) => {
	const formattedSearchTerm = searchTerm.trim(); // Remove leading and trailing white spaces

	// Split the search term into first and last names
	const nameParts = formattedSearchTerm.split(' ');
	const firstName = nameParts[0] || '';
	const lastName = nameParts[nameParts.length - 1];

	const users = await prisma.users.findMany({
		where: {
			OR: [
				{ first_name: { contains: firstName, mode: 'insensitive' } },
				{ last_name: { contains: lastName, mode: 'insensitive' } },
				{
					email: {
						contains: formattedSearchTerm,
						mode: 'insensitive',
					},
				},
			],
		},
		select: {
			id: true,
			first_name: true,
			last_name: true,
			email: true,
			is_terminated: true,
			verification_code: true,
		},
	});

	return users;
};

export {
	getCompanyWithUserById,
	getUserWithCompanyById,
	findCompany,
	findUsers,
};
