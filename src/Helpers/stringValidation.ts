export const isValidEmail = (email: string) => {
	const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
	const passed = regex.test(email);
	if (!passed) throw new Error('please provide a valid email address.');
};

export const isStrongPassword = (password: string) => {
	const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
	const passed = regex.test(password);
	if (!passed)
		throw new Error(
			'Password must be at least 8 charecters long and contain capital, lowercase and numbers.'
		);
};

export function validateNonEmptyStrings(arr: string[]): void {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].trim() === '') {
			throw new Error(`String at index ${i} is empty`);
		}
	}
}

// export const validateEmailAndPassword = (email: string, password: string) => {
//     const isEmail = isValidEmail(email);
//     const isStrong = isStrongPassword(password);
//     if (!(isEmail && isStrong)) throw new Error('please make sure the email you provided is valid and the password is above 8 charecters long with capinal, lowecase, and numbers included.');
// };
