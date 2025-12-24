import { ZodError } from "zod";
import { generateErrorMessage } from 'zod-error';

export const ERROR_CODE = {
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  UNKNOWN: 520,
} as const;

export const ERROR_NAME = {
  UNAUTHORIZED: "UNAUTHORIZED",
  BAD_REQUEST: "BAD_REQUEST",
  UNPROCESSABLE_ENTITY: "UNPROCESSABLE_ENTITY",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  UNKNOWN: "UNKNOWN",
} as const;

export type ErrorResponseType = {
  name: string;
  message: string;
  code: number;
  status: false;
  error?: unknown;
}

export class ErrorHandler extends Error {
  status: false;
  error?: unknown;
  code: number;
  constructor(message: string, code: keyof typeof ERROR_CODE, error?: unknown) {
    super(message);
    this.status = false;
    this.error = error;
    this.code = ERROR_CODE[code];
    this.name = ERROR_NAME[code];
  }
}

const mapStatusToCode = (status: number): keyof typeof ERROR_CODE => {
  if (status === 401) return "UNAUTHORIZED";
  if (status === 400) return "BAD_REQUEST";
  if (status === 422) return "UNPROCESSABLE_ENTITY";
  if (status >= 500) return "INTERNAL_SERVER_ERROR";
  return "UNKNOWN";
}

export async function responseToError(res: Response): Promise<ErrorHandler> {
  const statusCode = mapStatusToCode(res.status);
  let message = "Request failed";
  const bodyText = await res.text();
  if (bodyText) {
    try {
      const data = JSON.parse(bodyText);
      message = (data?.message ?? data?.error ?? data?.detail) || message;
      return new ErrorHandler(message, statusCode, data);
    } catch {
      message = bodyText;
    }
  }
  return new ErrorHandler(message, statusCode, bodyText || undefined);
}

export function standardizeApiError(error: unknown): ErrorResponseType {
  if (error instanceof ErrorHandler) {
    return { name: error.name, message: error.message, code: error.code, status: false, error: error.error };
  }
  if (error instanceof ZodError) {
    return {
      name: ERROR_NAME.UNPROCESSABLE_ENTITY,
      message: generateErrorMessage(error.issues, {
        maxErrors: 2,
        delimiter: { component: ": " },
        message: { enabled: true, label: "" },
        path: { enabled: false },
        code: { enabled: false },
      }),
      code: ERROR_CODE.UNPROCESSABLE_ENTITY,
      status: false,
    };
  }
  const message = error instanceof Error ? error.message : "Unexpected error";
  return {
    name: ERROR_NAME.UNKNOWN,
    message,
    code: ERROR_CODE.UNKNOWN,
    status: false,
    error,
  };
}


/*
 ******** USAGE in conversation-api.ts ********
 import { ErrorHandler, responseToError } from "@/lib/error";

  export async function listConversations() {
    const res = await fetch(`${API_BASE}/api/conversations`, { credentials: "include" });
    if (!res.ok) throw await responseToError(res);
    return (await res.json()) as { conversations: Conversation[] };
  }

 ******** USAGE in store ********
  import { standardizeApiError, ERROR_CODE } from "@/lib/error";
  import { toast } from "sonner";

  catch (err) {
    const apiErr = standardizeApiError(err);
    if (apiErr.code === ERROR_CODE.UNAUTHORIZED) {
      const msg = "Please sign in to load your chat history.";
      toast("Sign in required", {
        description: msg,
        action: { label: "Sign in", onClick: () => (window.location.href = "/signin") },
      });
      setError(msg);
    } else {
      toast("Unable to refresh conversations", { description: apiErr.message });
      setError(apiErr.message);
    }
  }
*/