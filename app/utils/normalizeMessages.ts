import { Message } from "../types";

const parseJsonValue = (value: unknown): unknown => {
    if (typeof value !== 'string') return undefined;
    try {
        return JSON.parse(value);
    } catch {
        return undefined;
    }
};

const parseJsonRecord = (value: unknown): Record<string, unknown> | undefined => {
    const parsed = parseJsonValue(value);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
    }
    return undefined;
};

const extractFunctionCall = (value: unknown): Record<string, unknown> | undefined => {
    if (!value) return undefined;
    if (typeof value === 'string') {
        return parseJsonRecord(value);
    }
    if (typeof value === 'object') {
        const record = value as Record<string, unknown>;
        const nested = record['functionCall'] ?? record['function_call'];
        if (nested) {
            return extractFunctionCall(nested);
        }
        if (typeof record.name === 'string' || record.arguments) {
            return record;
        }
    }
    return undefined;
};

export const normalizeMessages = (rawMessages: unknown[]): Message[] => {
    return rawMessages.map((rawMessage, index) => {
        const msg = (typeof rawMessage === 'object' && rawMessage !== null)
            ? rawMessage as Record<string, unknown>
            : {};

        const rawTypeValue = typeof msg.type === 'string'
            ? (msg.type as string).toLowerCase()
            : typeof msg.role === 'string'
                ? (msg.role as string).toLowerCase()
                : '';

        const type: Message['type'] = rawTypeValue === 'user'
            ? 'user'
            : rawTypeValue === 'assistant'
                ? 'assistant'
                : rawTypeValue === 'function' || rawTypeValue === 'tool'
                    ? 'function'
                    : 'assistant';

        const rawContent = typeof msg.message === 'string'
            ? msg.message as string
            : typeof msg.content === 'string'
                ? msg.content as string
                : '';

        const functionCall = extractFunctionCall(msg['functionCall'] ?? msg['function_call']);
        const waitingForConfirmation = typeof msg.waitingForConfirmation === 'boolean'
            ? msg.waitingForConfirmation
            : false;
        let transactionId = typeof msg.transactionId === 'string' && msg.transactionId.length > 0
            ? msg.transactionId
            : undefined;

        const completed = typeof msg.completed === 'boolean' ? msg.completed : true;

        const normalized: Message = {
            id: typeof msg.id === 'number' ? msg.id : index,
            message: rawContent,
            type,
            functionCall: undefined,
            waitingForConfirmation,
            transactionId,
            completed,
        };

        if (functionCall) {
            const normalizedCall: Record<string, unknown> = { ...functionCall };
            const argsValue = normalizedCall['arguments'];
            if (typeof argsValue === 'string') {
                const parsedArgs = parseJsonRecord(argsValue);
                if (parsedArgs) {
                    normalizedCall['arguments'] = parsedArgs;
                }
            }
            normalized.functionCall = normalizedCall;
            if (type === 'assistant') {
                normalized.message = '';
            }
            const txIdFromCall = normalizedCall['transactionId'];
            if (!transactionId && typeof txIdFromCall === 'string' && txIdFromCall.length > 0) {
                transactionId = txIdFromCall;
                normalized.transactionId = txIdFromCall;
            }
        }

        if (type === 'function') {
            const parsedOutput = parseJsonValue(rawContent);
            const baseResult: Record<string, unknown> = {};

            if (parsedOutput && typeof parsedOutput === 'object' && !Array.isArray(parsedOutput)) {
                Object.assign(baseResult, parsedOutput as Record<string, unknown>);
            } else if (Array.isArray(parsedOutput)) {
                baseResult.result = parsedOutput;
            } else if (typeof rawContent === 'string' && rawContent.length > 0) {
                baseResult.raw = rawContent;
            }

            if (typeof msg.name === 'string' && msg.name.length > 0) {
                baseResult.name = msg.name;
            }

            normalized.message = '';
            normalized.functionCall = baseResult;

            const txId = baseResult['transactionId'];
            if (!transactionId && typeof txId === 'string' && txId.length > 0) {
                transactionId = txId;
                normalized.transactionId = txId;
            }
        }

        if (!normalized.transactionId && normalized.functionCall) {
            const txId = (normalized.functionCall as Record<string, unknown>)['transactionId'];
            if (typeof txId === 'string' && txId.length > 0) {
                normalized.transactionId = txId;
            }
        }

        return normalized;
    });
};

export default normalizeMessages;
