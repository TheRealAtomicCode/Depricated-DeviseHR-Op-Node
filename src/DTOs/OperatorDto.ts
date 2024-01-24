interface Operator {
	id: true;
	first_name: true;
	last_name: true;
	email: true;
	profile_picture?: string;
	user_type: true;
	created_at: true;
	updated_at: true;
	is_terminated: true;
	is_verified: true;
	added_by: true;
}

export default Operator;
