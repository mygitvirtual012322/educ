export function getSessionId(): string {
    if (typeof window === 'undefined') return 'server-side';

    let sessionId = localStorage.getItem('gov_session_id');
    if (!sessionId) {
        sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('gov_session_id', sessionId);
    }
    return sessionId;
}
