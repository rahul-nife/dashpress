import { StringUtils } from "@gothicgeeks/shared";
import { ConfigAdaptorTypes } from "../config-persistence/types";
import { ConfigKeys } from "./types";

interface IConfigBag {
  defaultValue: () => string;
  validate: (value: string) => void;
}

const tokenValidations = (value: string, label: string) => {
  const TOKEN_LENGTH = 64;
  if (value.length < TOKEN_LENGTH) {
    throw new Error(
      `${label} needs to be more than ${TOKEN_LENGTH} characters`
    );
  }
  if (
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{64,}$/.test(
      value
    )
  ) {
    throw new Error(
      `${label} must contain uppercase letters, lowercase letters, numbers and symbols`
    );
  }
};

const optionsValidation = (value: string, label: string, options: string[]) => {
  if (!options.includes(value as ConfigAdaptorTypes)) {
    throw new Error(
      `Invalid ${label} name provided ${value}. Valid values are ${options}`
    );
  }
};

export const ConfigBag: Record<ConfigKeys, IConfigBag> = {
  CONFIG_ADAPTOR: {
    defaultValue: () => {
      return ConfigAdaptorTypes.JsonFile;
    },
    validate: (value) => {
      optionsValidation(
        value,
        "Config Adaptor",
        Object.values(ConfigAdaptorTypes)
      );
    },
  },
  ENCRYPTION_KEY: {
    defaultValue: () => {
      return StringUtils.generateRandomString(128);
    },
    validate: (value) => {
      tokenValidations(value, "Encryption Key");
    },
  },
  TOKEN_VALIDITY_DURATION_IN_DAYS: {
    defaultValue: () => {
      return "14";
    },
    validate: (value) => {
      if (Number.isNaN(value)) {
        throw new Error(`Token Expiration in days needs to be a number`);
      }
    },
  },
  AUTH_TOKEN_KEY: {
    defaultValue: () => {
      return StringUtils.generateRandomString(128);
    },
    validate: (value) => {
      tokenValidations(value, "Auth token Key");
    },
  },
};