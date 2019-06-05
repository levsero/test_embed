import AbstractError from 'errors/AbstractError';

// Any ReportableErrors thrown within the Widget will be logged to the console
// for the end user to see

export default class ReportableError extends AbstractError {}
