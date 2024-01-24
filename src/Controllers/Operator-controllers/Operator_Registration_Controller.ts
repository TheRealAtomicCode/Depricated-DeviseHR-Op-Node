import { Request, Response, Router } from 'express';
import { isEmptyObject } from '../../Helpers/isEmptyObject';
import {
	createPassword,
	getAndCheckRegistrationProfile,
} from '../../Services/Operator-Services/register_operator_services';

const OperatorRegistrationController = Router();

// * regester my account step 1
OperatorRegistrationController.get(
	'/register',
	async (req: Request, res: Response) => {
		try {
			if (!req.query.operatorId || !req.query.code)
				throw new Error('Invalid Request.');

			const operator = await getAndCheckRegistrationProfile(
				Number(req.query.operatorId),
				String(req.query.code)
			);

			res.status(200).render('registration', {
				firstName: operator?.first_name,
				lastName: operator?.last_name,
				email: operator?.email,
				id: operator?.id,
				verificationCode: operator.verfication_code,
			});
		} catch (err: any) {
			if (isEmptyObject(err)) res.status(400).send(err.message);
			else res.status(400).send(err);
		}
	}
);

// * regester my account step 2 - confirm registration
OperatorRegistrationController.patch(
	'/registeration-confirmed',
	async (req: Request, res: Response) => {
		try {
			const updatedOperator = await createPassword(
				Number(req.body.operatorId),
				req.body.password,
				req.body.verificationCode,
				true
			);

			res.status(200).send(updatedOperator);
		} catch (err: any) {
			if (isEmptyObject(err)) res.status(400).send(err.message);
			else res.status(400).send(err);
		}
	}
);

// * reset my password step 1
OperatorRegistrationController.get(
	'/forgotten-password',
	async (req: Request, res: Response) => {
		try {
			if (!req.query.operatorId || !req.query.code)
				throw new Error('Invalid Request.');

			const operator = await getAndCheckRegistrationProfile(
				Number(req.query.operatorId),
				String(req.query.code)
			);

			res.status(200).render('forgotten-password', {
				firstName: operator?.first_name,
				lastName: operator?.last_name,
				email: operator?.email,
				id: operator?.id,
				verificationCode: operator.verfication_code,
			});
		} catch (err: any) {
			if (isEmptyObject(err)) res.status(400).send(err.message);
			else res.status(400).send(err);
		}
	}
);

// * forgot password 2 - confirm reset password
OperatorRegistrationController.patch(
	'/reset-password-confermiation',
	async (req: Request, res: Response) => {
		try {
			const updatedOperator = await createPassword(
				Number(req.body.operatorId),
				req.body.password,
				req.body.verificationCode,
				false
			);

			res.status(200).send(updatedOperator);
		} catch (err: any) {
			if (isEmptyObject(err)) res.status(400).send(err.message);
			else res.status(400).send(err);
		}
	}
);

// * Login VIEW!!!!
OperatorRegistrationController.get(
	'/login',
	async (req: Request, res: Response) => {
		try {
			res.status(200).render('loginIn');
		} catch (err: any) {
			if (isEmptyObject(err)) res.status(400).send(err.message);
			else res.status(400).send(err);
		}
	}
);

export default OperatorRegistrationController;
