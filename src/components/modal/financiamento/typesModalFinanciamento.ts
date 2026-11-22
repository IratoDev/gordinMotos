
export type SelectField = {
  type: "select";
  name: string;
  label: string;
  placeholder?: string;
  options: string[];
  colSpan?: number;
  required?: boolean;
};

export type InputField = {
  type: "input";
  name: string;
  label: string;
  placeholder?: string;
  inputType?: string;
  colSpan?: number;
  required?: boolean;
  maxLength?: number;
};

export type TextareaField = {
  type: "textarea";
  name: string;
  label: string;
  placeholder?: string;
  colSpan?: number;
  required?: boolean;
};

export type CheckboxField = {
  type: "checkbox";
  name: string;
  label: string;
  required?: boolean;
  colSpan?: number
};

export type FormField =
  | InputField
  | SelectField
  | TextareaField
  | CheckboxField;