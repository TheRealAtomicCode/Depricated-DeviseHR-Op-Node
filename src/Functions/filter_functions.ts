import {
  isValidEmail,
  validateNonEmptyStrings,
} from '../Helpers/stringValidation';
import { IAddCompany } from '../Types/CompanyRequestType';
import {
  IAddOperatorRequest,
  IAddUserRequest,
  ICreateOperatorRequest,
  IUpdateOperatorRequestBody,
} from '../Types/OperatorRequestType';

export const createCompanyFilter = (reqBody: IAddCompany) => {
  reqBody.companyName = reqBody.companyName.trim();
  reqBody.firstName = reqBody.firstName.trim();
  reqBody.lastName = reqBody.lastName.trim();
  reqBody.email = reqBody.email.trim();
  reqBody.phoneNumber = reqBody.phoneNumber.trim();
  reqBody.licenceNumber = reqBody.licenceNumber.trim();
  reqBody.accountNumber = reqBody.accountNumber.trim();
  isValidEmail(reqBody.email);
  validateNonEmptyStrings([
    reqBody.companyName,
    reqBody.firstName,
    reqBody.lastName,
    reqBody.phoneNumber,
    reqBody.accountNumber,
  ]);
};

export const addUserFilter = (reqBody: IAddUserRequest) => {
  reqBody.firstName = reqBody.firstName.trim();
  reqBody.lastName = reqBody.lastName.trim();
  reqBody.email = reqBody.email.trim();
  isValidEmail(reqBody.email);
  validateNonEmptyStrings([reqBody.firstName, reqBody.lastName]);
};

export const addOperatorFilter = (
  reqBody: ICreateOperatorRequest
) => {
  reqBody.email = reqBody.email.toLowerCase().trim();
  reqBody.firstName = reqBody.firstName.trim();
  reqBody.lastName = reqBody.lastName.trim();

  isValidEmail(reqBody.email);
};

export const updateOperatorFilter = (
  reqBody: IUpdateOperatorRequestBody
) => {
  if (reqBody.email)
    reqBody.email = reqBody.email.toLowerCase().trim();
  if (reqBody.firstName) reqBody.firstName = reqBody.firstName.trim();
  if (reqBody.lastName) reqBody.lastName = reqBody.lastName.trim();

  if (reqBody.email) isValidEmail(reqBody.email);

  if (reqBody.email) validateNonEmptyStrings([reqBody.email]);
  if (reqBody.firstName) validateNonEmptyStrings([reqBody.firstName]);
  if (reqBody.lastName) validateNonEmptyStrings([reqBody.lastName]);
};
