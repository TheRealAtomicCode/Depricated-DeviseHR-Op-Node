import { Request, Response, Router } from 'express';
import {
	findOperatorByCredentials,
	genarateOperatorAuthToken,
	findOperatorAndReplaceRefreshToken,
} from '../../Services/Operator-Services/operator_services';
import auth from '../../Middleware/auth';
import { IAuthenticatedOpRequest } from '../../Types/OperatorRequestType';
import {
	logMeOut,
	logMeOutAllDevices,
} from '../../Services/Operator-Services/register_operator_services';

const LogOperatorController = Router();

// * login operator
LogOperatorController.post('/login', async (req: Request, res: Response) => {
	try {
		const me = await findOperatorByCredentials(
			req.body.email,
			req.body.password
		);

		const { token, refreshToken } = await genarateOperatorAuthToken(me);

		// * what the end user receives, NOT ACTUALLY DELETING THE TOKENS
		me.password_hash = 'Not available';
		me.refresh_tokens = [];

		res.status(200).send({
			data: me,
			token,
			refreshToken,
			success: true,
			message: '',
		});
	} catch (err: any) {
		res.status(400).send({
			data: null,
			token: null,
			refreshToken: null,
			success: false,
			message: err.message,
		});
	}
});

// * refresh
LogOperatorController.post(
	'/refresh',
	auth,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			console.log('sss');
			const { refreshedUser, newRefreshToken, newToken } =
				await findOperatorAndReplaceRefreshToken(
					req.userId!,
					req.decodedUser?.user_type!,
					req.body.refreshToken!
				);

			console.log({ refreshedUser, newRefreshToken, newToken });
			refreshedUser.password_hash = 'No Access';
			refreshedUser.refresh_tokens = [];

			res.status(200).send({
				data: refreshedUser,
				token: newToken,
				refreshToken: newRefreshToken,
				success: true,
				message: '',
			});
		} catch (err: any) {
			res.status(400).send({
				data: null,
				token: null,
				refreshToken: null,
				success: false,
				message: err.message,
			});
		}
	}
);

// * logout operator
LogOperatorController.patch(
	'/logout',
	auth,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			await logMeOut(req.userId!, req.body.refreshToken);

			res.status(200).send({
				data: 'You have logged out successfully',
				success: true,
				message: '',
			});
		} catch (err: any) {
			res.status(400).send({
				data: null,
				token: null,
				refreshToken: null,
				success: false,
				message: err.message,
			});
		}
	}
);

// * logout operator
LogOperatorController.get(
	'/logout-all',
	auth,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			await logMeOutAllDevices(req.userId!);

			res.status(200).send({
				data: 'You have logged out all devices successfully',
				success: true,
				message: '',
			});
		} catch (err: any) {
			res.status(400).send({
				data: null,
				token: null,
				refreshToken: null,
				success: false,
				message: err.message,
			});
		}
	}
);

export default LogOperatorController;
