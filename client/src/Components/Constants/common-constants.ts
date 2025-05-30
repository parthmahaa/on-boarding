export const EMAIL_MATCH = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,16}$/;
export const AADHAAR_OR_VIRTUAL_REGEX = /^\d{4}\d{4}\d{4}(\d{4})?$/;
export const VOTER_ID_REGEX = /^[A-Z]{3}\d{7}$/;
export const PAN_REGEX = /[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const PF_REGEX =
	/^([A-Z]{2}\/)([A-Z]{3}\/)([0-9]{7}\/)(([0-9]{3})[\/]?)?([0-9]{7})$/;
export const UAN_NO_REGEX = /^\d{4}\d{4}\d{4}?$/;
export const DRIVING_LICENSE_REGEX = /^([a-zA-Z]){2}([0-9]){13}?$/;
export const PASSWORD_PATTERN =
	/^([A-z0-9!@#$%^&*().,<>{}[\]<>?_=+\-|;:\'\"\/])*[^\s]\1*$/;


export const defaultDisplayDateFormat = "DD-MMM-YYYY";
export const defaultInputDateFormat = "DD-MMM-YYYY";
