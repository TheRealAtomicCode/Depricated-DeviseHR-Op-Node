 interface Company {
    id: number;
    name: string;
    licence_number: string;
    logo?: string;
    enable_semi_personal_information: boolean;
    enable_show_employees: boolean;
    enable_toil: boolean;
    enable_overtime: boolean;
    enable_absence_conflicts_outside_departments: boolean;
    enable_carryover: boolean;
    enable_self_cancel_leave_requests: boolean;
    enable_edit_my_information: boolean;
    enable_accept_decline_shifts: boolean;
    enable_takeover_shift: boolean;
    enable_broadcast_shift_swap: boolean;
    lang?: string;
    country: string;
    main_contact_id?: number;
    created_at: string;
    updated_at: string;
    is_special_client: boolean;
  }

  export default Company;
  
