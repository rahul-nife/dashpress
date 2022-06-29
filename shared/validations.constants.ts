export const ENTITY_TYPES_SELECTION_BAG: Record<
  | "email"
  | "password"
  | "text"
  | "textarea"
  | "richtext" // not inplemeneted
  | "url"
  | "number"
  | "selection" // not inplemeneted
  | "reference" // not inplemeneted
  | "boolean"
  | "image" // not inplemeneted
  | "datetime-local" // not inplemeneted
  | "color", // not inplemeneted
  {
    typeIsNotChangeAble?: true;
    allowedValidations: Array<SelectableAbleValidations>;
  }
> = {
  email: {
    allowedValidations: [
      "required",
      "unique",
      "maxLength",
      "minLength",
      "regex",
    ],
  },
  password: {
    allowedValidations: [
      "matchOtherField",
      "required",
      "regex",
      "maxLength",
      "minLength",
    ],
  },
  text: {
    allowedValidations: [
      "alphanumeric",
      "maxLength",
      "minLength",
      "required",
      "regex",
      "unique",
      "matchOtherField",
    ],
  },
  textarea: {
    allowedValidations: ["maxLength", "minLength", "required"],
  },
  number: {
    typeIsNotChangeAble: true,
    allowedValidations: ["max", "min", "postiveNumber", "required", "unique"],
  },
  url: {
    allowedValidations: [
      "maxLength",
      "minLength",
      "required",
      "unique",
      "regex",
    ],
  },
  richtext: {
    allowedValidations: ["required", "maxLength", "minLength"],
  },
  "datetime-local": {
    typeIsNotChangeAble: true,
    allowedValidations: ["required"],
  },
  image: {
    allowedValidations: ["maxLength", "minLength", "regex", "required"],
  },
  color: {
    allowedValidations: ["maxLength", "minLength", "required"],
  },

  boolean: {
    // Configure Labels + must use color
    typeIsNotChangeAble: true,
    allowedValidations: ["required"],
  },

  selection: {
    // Configure Selection + maybe use colors
    allowedValidations: ["required"],
  },

  reference: {
    // use color
    typeIsNotChangeAble: true,
    allowedValidations: ["required", "unique"],
  },
};

//   | 'date'
//   | 'file'
//   | 'range'
//   | 'tel'
//   | 'time'

//   | 'month'
//   | 'week'

export type ValidationsBoundToType =
  | "isEmail"
  | "isUrl"
  | "isNumber"
  | "isString"
  | "isDate"
  | "isReference"
  | "isBoolean"
  | "isColor";

type SelectableAbleValidations =
  | "required"
  | "unique"
  | "min"
  | "max"
  | "maxLength"
  | "minLength"
  | "regex"
  | "alphanumeric"
  | "matchOtherField"
  | "postiveNumber";

// less than other field
// not equal to other field
// requiredIf

import {
  isBoolean,
  isString,
  isEmail,
  maxLength,
  minLength,
  isURL,
  isNumber,
  isPositive,
  matches,
  isAlphanumeric,
  isNotEmpty,
  isDate,
  isRgbColor,
  min,
  max,
} from "class-validator";

const handleValidation =
  (
    validation: (value: unknown, parameter?: unknown) => boolean,
    parameterKey?: string
  ) =>
  (
    value: unknown,
    errorMessage: string,
    constraints: Record<string, unknown>,
    allValues: Record<string, unknown>
  ) =>
    validation(value, constraints[parameterKey]) ? undefined : errorMessage;

export const ENTITY_VALIDATION_CONFIG: Record<
  ValidationsBoundToType | SelectableAbleValidations,
  {
    input?: Record<string, unknown>;
    isBoundToType?: Array<keyof typeof ENTITY_TYPES_SELECTION_BAG>;
    message: string;
    implementation: (
      value: unknown,
      errorMessage: string,
      constraints: Record<string, unknown>,
      allValues: Record<string, unknown>
    ) => undefined | string;
  }
> = {
  // Selection, enum like check
  isEmail: {
    isBoundToType: ["email"],
    message: "Invalid email",
    implementation: handleValidation(isEmail),
  },
  isReference: {
    isBoundToType: ["reference"],
    message: "Doesn't exist",
    implementation: () => undefined,
  },
  isString: {
    isBoundToType: ["password", "text", "textarea", "richtext", "image"],
    message: "$name is not a text",
    implementation: handleValidation(isString),
  },
  isColor: {
    isBoundToType: ["color"],
    message: "$name should be a color",
    implementation: handleValidation(isRgbColor),
  },
  isUrl: {
    isBoundToType: ["url"],
    message: "Invalid URL",
    implementation: handleValidation(isURL),
  },
  isDate: {
    isBoundToType: ["datetime-local"],
    message: "Invalid Date",
    implementation: handleValidation(isDate),
  },
  isNumber: {
    isBoundToType: ["number"],
    message: "$name should be a number",
    implementation: handleValidation(isNumber),
  },
  isBoolean: {
    isBoundToType: ["boolean"],
    message: "$name should be a boolean",
    implementation: handleValidation(isBoolean),
  },
  required: {
    message: "$name is required",
    implementation: (value, errorMessage) =>
      isNotEmpty(value) ? undefined : errorMessage,
  },
  unique: {
    message: "$name has already been taken",
    implementation: () => undefined,
  },
  alphanumeric: {
    message: "$name should contain only alpabets, numbers and underscore",
    implementation: handleValidation(isAlphanumeric),
  },
  postiveNumber: {
    message: "$name should be positive number",
    implementation: handleValidation(isPositive),
  },
  matchOtherField: {
    input: {
      otherField: "",
    },
    message: "$name should match {{otherField}}",
    implementation: () => undefined,
  },
  min: {
    input: {
      length: 3,
    },
    message: "$name should be greater than $input",
    implementation: handleValidation(min, "length"),
  },
  max: {
    input: {
      length: 10,
    },
    message: "$name should be less than $input",
    implementation: handleValidation(max, "length"),
  },
  maxLength: {
    input: {
      length: 100,
    },
    message: "$name should be less than $input characters",
    implementation: handleValidation(maxLength, "length"),
  },
  minLength: {
    input: {
      length: 3,
    },
    message: "$name should be greater than $input characters",
    implementation: handleValidation(minLength, "length"),
  },
  regex: {
    input: {
      pattern: "//",
    },
    message: "$name is invalid",
    implementation: handleValidation(matches, "pattern"),
  },
};
