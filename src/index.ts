import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// * controllers
import LogOperatorController from './Controllers/Operator-controllers/Log_Operator_Controller';
import OperatorsController from './Controllers/Operator-controllers/Operators_Controller';
import AdminOperatorConroller from './Controllers/Operator-controllers/Admin_Operator_Controllers';
import OperatorRegistrationController from './Controllers/Operator-controllers/Operator_Registration_Controller';
import adminCompanyRouter from './Controllers/Company-controllers/Admin_Company_Controller';
import companyRouter from './Controllers/Company-controllers/Company_Controller';
import manageCompanyRouter from './Controllers/Company-controllers/Manager_Company_controller';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const viewsPath = path.join(__dirname, 'Views');

// * operator routers
app.use('/registration', OperatorRegistrationController);
app.use('/api/operator-logging', LogOperatorController);
app.use('/api/operators', OperatorsController);
app.use('/api/admin-operators', AdminOperatorConroller);
app.use('/api/admin-company', adminCompanyRouter);
app.use('/api/manage-company', manageCompanyRouter);
app.use('/api/company', companyRouter);
app.set('view engine', 'hbs');
app.set('views', viewsPath);

app.listen(PORT, () => {
	console.log(`Server up and running on port: ${PORT}`);
});
