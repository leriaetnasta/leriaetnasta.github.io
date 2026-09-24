/**
 * the CV assistant endpoint. Not a secret: it is protected by an origin
 * allowlist and a rate limit, not by being hidden.
 */
export const ASK_ENDPOINT = 'https://cv-assistant.leriaetnasta.workers.dev/api/chat';

/**
 * give up on the stream and answer from the local keyword matcher instead
 */
export const ASK_TIMEOUT_MS = 15_000;

/**
 * how many turns of context travel with each question
 */
export const ASK_MAX_TURNS = 6;

/**
 * end the session after this much silence, then offer a restart
 */
export const ASK_IDLE_MS = 15 * 60 * 1000;
