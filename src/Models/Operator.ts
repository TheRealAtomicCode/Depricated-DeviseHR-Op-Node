interface Operator {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password_hash: string;
    profile_picture?: string;
    is_terminated: boolean;
    user_role: string;
    created_at: string;
    updated_at: string;
    refresh_tokens: any[];
  }

  export default Operator;