import { Response, Router } from 'express';
import auth from '../../Middleware/auth';
import { isAdmin } from '../../Middleware/authorization';
import { IAuthenticatedOpRequest } from '../../Types/OperatorRequestType';
import {
	createCompany,
	getUserById,
	updateUserVerificationToken,
} from '../../Services/Company-services/admin_company_service';
import {
	generateVerificationCode,
	sendOperatorRagistration,
	sendUserRagistration,
} from '../../Functions/node_mailer';

const adminCompanyRouter = Router();

// * Create company
adminCompanyRouter.post(
	'/create-company',
	auth,
	isAdmin,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			const myId = req.userId!;
			const company = await createCompany(req.body, myId);
			console.log(company);
			if (req.body.sendRegistration) {
				const verificationCode = generateVerificationCode();
				const updatedOperator = await updateUserVerificationToken(
					company.users[0].id,
					verificationCode
				);

				await sendUserRagistration(
					updatedOperator.id,
					updatedOperator.email,
					updatedOperator.first_name,
					updatedOperator.last_name,
					verificationCode
				);
			}

			res.status(200).send({
				data: company,
				success: true,
				message: null,
			});
		} catch (err: any) {
			res.status(200).send({
				data: null,
				success: false,
				message: err.message,
			});
		}
	}
);

// * resend user registration
adminCompanyRouter.get(
	'/send-user-registration/:userId',
	auth,
	isAdmin,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			const myId = req.userId!;
			const user = await getUserById(Number(req.params.userId));

			const verificationCode = generateVerificationCode();
			const updatedUser = await updateUserVerificationToken(
				myId,
				verificationCode
			);

			await sendUserRagistration(
				updatedUser.id,
				updatedUser.email,
				updatedUser.first_name,
				updatedUser.last_name,
				verificationCode
			);

			res.status(200).send({
				data: user,
				success: false,
				message: null,
			});
		} catch (err: any) {
			res.status(200).send({
				data: null,
				success: true,
				message: err.message,
			});
		}
	}
);

export default adminCompanyRouter;
