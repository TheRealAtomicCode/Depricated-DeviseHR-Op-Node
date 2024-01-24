  interface User {
    id: number;
    first_name: string;
    last_name: string;
    title?: string;
    email: string;
    password_hash: string;
    date_of_birth?: string;
    profile_picture?: string;
    is_terminated: boolean;
    created_at: string;
    updated_at: string;
    refresh_tokens: any[];
    user_type?: number;
    ni_no?: string;
    drivers_licence_number?: string;
    drivers_licence_expiration_date?: string;
    passport_number?: string;
    passport_expiration_date?: string;
    enable_reminders: boolean;
    enable_birthday_reminder: boolean;
    enable_receive_requests: boolean;
    enable_receive_requests_from_my_department: boolean;
    contracted_leave_start_date?: string;
  }

  export default User;