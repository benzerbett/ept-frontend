// simulate login
export const simulateLogin = (username, password) => {
    if (window && window.sessionStorage) {
        // clear session storage
        window.sessionStorage.removeItem('user');
        window.sessionStorage.removeItem('isLoggedIn');
        if (username === 'admin' && password.length > 0) {
            window.sessionStorage.setItem('isLoggedIn', true)
            window.sessionStorage.setItem('user', JSON.stringify({ type: 'admin', name: 'Mkuu L. Wabara', email: 'mkadmin@email.net' }))
            window.location.href = '/admin/'
        } else if (username.length > 0 && password.length > 0) {
            window.sessionStorage.setItem('isLoggedIn', true)
            window.sessionStorage.setItem('user', JSON.stringify({ type: 'participant', name: 'Mwana Maabara', email: 'participant@mail.ke' }))
            window.location.href = '/user'
        }
        window.location.reload()
    }
}

// simulate logout
export const simulateLogout = () => {
    if (window && window.sessionStorage) {
        window.sessionStorage.removeItem('user');
        window.sessionStorage.removeItem('isLoggedIn');
        window.location.href = '/auth/login'
    }
}


// get user
export const simulateGetSession = () => {
    if (window && window.sessionStorage) {
        let user = window.sessionStorage.getItem('user');
        let isLoggedIn = window.sessionStorage.getItem('isLoggedIn');
        let activeProgramCode = window.sessionStorage.getItem('activeProgramCode');
        if (user && isLoggedIn) {
            return {
                isLoggedIn: true,
                user: JSON.parse(user),
                activeProgramCode: activeProgramCode
            }
        }
    }
    return null;
}