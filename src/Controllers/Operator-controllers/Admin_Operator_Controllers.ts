import { Response, Router } from 'express';
import { IAuthenticatedOpRequest } from '../../Types/OperatorRequestType';
import auth from '../../Middleware/auth';
import { isAdmin } from '../../Middleware/authorization';
import {
	generateVerificationCode,
	sendOperatorRagistration,
} from '../../Functions/node_mailer';
import {
	createOperator,
	getAllOperators,
	getOperatorDetails,
	opForgotPasswordService,
	updateOperatorDetails,
	updateOperatorRole,
} from '../../Services/Operator-Services/admin_operator_services';
import { updateVerificationToken } from '../../Services/Operator-Services/operator_services';
import noSelfOperation from '../../Middleware/noSelfOperation';

const AdminOperatorConroller = Router();

// * Create Operator
AdminOperatorConroller.post(
	'/create-operator',
	auth,
	isAdmin,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			const newOperator = await createOperator(req.body, Number(req.userId));

			if (req.body.sendRegistration) {
				const verificationCode = generateVerificationCode();
				const updatedOperator = await updateVerificationToken(
					newOperator.id,
					verificationCode
				);

				await sendOperatorRagistration(
					updatedOperator.id,
					updatedOperator.email,
					updatedOperator.first_name,
					updatedOperator.last_name,
					verificationCode
				);
			}

			res.status(200).send({
				data: newOperator,
				success: true,
				message: '',
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

// * Send Regstration Code to Operator
AdminOperatorConroller.get(
	'/send-registration/:opId',
	auth,
	isAdmin,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			const verificationCode = generateVerificationCode();
			const updatedOperator = await updateVerificationToken(
				Number(req.params.opId),
				verificationCode
			);

			await sendOperatorRagistration(
				updatedOperator.id,
				updatedOperator.email,
				updatedOperator.first_name,
				updatedOperator.last_name,
				verificationCode
			);

			res.status(200).send({
				data: 'Registration code has been successfully sent',
				success: true,
				message: '',
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

// * View operators
AdminOperatorConroller.get(
	'/operators',
	auth,
	isAdmin,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			const operators = await getAllOperators();

			res.status(200).send({
				data: operators,
				success: false,
				message: null,
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

// * View operator details
AdminOperatorConroller.get(
	'/operators/:operatorId',
	auth,
	isAdmin,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			const operators = await getOperatorDetails(Number(req.params.operatorId));

			res.status(200).send({
				data: operators,
				success: false,
				message: null,
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

// * Edit User details
AdminOperatorConroller.patch(
	'/edit-operator',
	auth,
	isAdmin,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			const updatedOperator = await updateOperatorDetails(
				req.body,
				req.userId!
			);

			res.status(201).send({
				data: updatedOperator,
				success: false,
				message: null,
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

// * Edit User role
AdminOperatorConroller.patch(
	'/edit-role',
	auth,
	isAdmin,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			const updatedOperator = await updateOperatorRole(req.body, req.userId!);

			res.status(201).send({
				data: updatedOperator,
				success: false,
				message: null,
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

// * Edit User role
AdminOperatorConroller.patch(
	'/reset-operator-pswd',
	auth,
	isAdmin,
	async (req: IAuthenticatedOpRequest, res: Response) => {
		try {
			noSelfOperation(req.userId!, req.body.opId);

			const operator = await opForgotPasswordService(
				req.body.opId,
				req.userId!
			);

			res.status(201).send({
				data: `A Verifivation code has been send to ${operator.email}`,
				success: false,
				message: null,
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

export default AdminOperatorConroller;
