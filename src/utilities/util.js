export function formatArabicDate(date) {
    return new Intl.DateTimeFormat('ar', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
}

export function goToSignin() {
    window.location.href = '/signin';
}