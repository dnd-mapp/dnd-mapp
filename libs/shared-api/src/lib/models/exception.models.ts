import { titleCase } from '../functions';

export const RpcCodes = {
    OK: 0,
    CANCELLED: 1,
    UNKNOWN: 2,
    INVALID_ARGUMENT: 3,
    DEADLINE_EXCEEDED: 4,
    NOT_FOUND: 5,
    ALREADY_EXISTS: 6,
    PERMISSION_DENIED: 7,
    RESOURCE_EXHAUSTED: 8,
    FAILED_PRECONDITION: 9,
    ABORTED: 10,
    OUT_OF_RANGE: 11,
    UNIMPLEMENTED: 12,
    INTERNAL: 13,
    UNAVAILABLE: 14,
    DATA_LOSS: 15,
    UNAUTHENTICATED: 16,
} as const;

export type RpcError = keyof typeof RpcCodes;

export type RpcCode = (typeof RpcCodes)[RpcError];

export const HttpStatuses = {
    // Successful codes
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    // Redirection codes
    MULTIPLE_CHOICES: 300,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,

    // Client error codes
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    UNSUPPORTED_MEDIA_TYPE: 415,
    TOO_MANY_REQUESTS: 429,

    // Server Errors codes
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpError = keyof typeof HttpStatuses;

export type HttpStatus = (typeof HttpStatuses)[HttpError];

export function rpcCodeToError(code: RpcCode): RpcError {
    const errors = (Object.entries(RpcCodes) as [RpcError, RpcCode][]).filter(([, rpcCode]) => rpcCode === code)[0];
    return errors ? errors[0] : null;
}

export const rpcErrorToHttpError: Record<RpcError, HttpError> = {
    OK: 'OK',
    CANCELLED: 'OK',
    UNKNOWN: 'INTERNAL_SERVER_ERROR',
    INVALID_ARGUMENT: 'BAD_REQUEST',
    DEADLINE_EXCEEDED: 'REQUEST_TIMEOUT',
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'BAD_REQUEST',
    PERMISSION_DENIED: 'FORBIDDEN',
    RESOURCE_EXHAUSTED: 'INTERNAL_SERVER_ERROR',
    FAILED_PRECONDITION: 'CONFLICT',
    ABORTED: 'INTERNAL_SERVER_ERROR',
    OUT_OF_RANGE: 'BAD_REQUEST',
    UNIMPLEMENTED: 'NOT_IMPLEMENTED',
    INTERNAL: 'INTERNAL_SERVER_ERROR',
    UNAVAILABLE: 'SERVICE_UNAVAILABLE',
    DATA_LOSS: 'INTERNAL_SERVER_ERROR',
    UNAUTHENTICATED: 'UNAUTHORIZED',
} as const;

export function rpcCodeToHttpError(code: number) {
    const rpcError = rpcCodeToError(code as RpcCode);
    return rpcErrorToHttpError[rpcError];
}

export function rpcCodeToHttpStatus(code: number) {
    const httpError = rpcCodeToHttpError(code);
    return HttpStatuses[httpError];
}

export function prettifyError(error: HttpError | RpcError) {
    return titleCase(error.toLowerCase().replaceAll('_', ' '));
}
