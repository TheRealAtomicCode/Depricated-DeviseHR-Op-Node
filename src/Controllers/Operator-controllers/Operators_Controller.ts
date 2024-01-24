import { Router, Response } from 'express';
import { IAuthenticatedOpRequest } from '../../Types/OperatorRequestType';
import auth from '../../Middleware/auth';
import { prisma } from '../../DB/prismaConfig';

const OperatorsController = Router();

// * me
OperatorsController.get(
	'/me',
	auth,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			const opId = Number(req.decodedUser?.id);
			const user = await prisma.operators.findUnique({
				select: {
					id: true,
					first_name: true,
					last_name: true,
					email: true,
					profile_picture: true,
					user_type: true,
				},
				where: { id: opId },
			});
			res.status(200).send({
				data: user,
				success: true,
				message: '',
			});
		} catch (err: any) {
			res.status(400).send({
				data: null,
				success: false,
				message: err.message,
			});
		}
	}
);

export default OperatorsController;
