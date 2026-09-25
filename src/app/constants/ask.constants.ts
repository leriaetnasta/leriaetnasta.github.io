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

/**
 * hold the answer back briefly so the assistant reads as considering the
 * question rather than replying before the visitor's finger leaves the key
 */
export const ASK_THINK_MS = 700;

/**
 * second thinking phase, once it is clearly taking a moment
 */
export const ASK_COMPOSE_MS = 1500;

/**
 * pace each token, since the edge streams far faster than anyone reads
 */
export const ASK_TOKEN_MS = 18;

/**
 * how long the opening illustration holds before the greeting lands
 */
export const ASK_BOOT_MS = 2200;
