// simulate login
export const simulateLogin = (username, password,rtr) => {
    if (typeof window !== 'undefined') {
        // clear session storage
        window.sessionStorage.removeItem('user');
        window.sessionStorage.removeItem('isLoggedIn');
        // generate user id
        const id = Math.floor(Math.random() * 1000000);
        if (username === 'admin' && password.length > 0) {
            window.sessionStorage.setItem('isLoggedIn', true)
            window.sessionStorage.setItem('user', JSON.stringify({id: id, type: 'admin', name: 'Mkuu L. Wabara', email: 'mkadmin@email.net' }))
            rtr.push('/admin', undefined, { unstable_skipClientCache: true })
        } else if (username.length > 0 && password.length > 0) {
            window.sessionStorage.setItem('isLoggedIn', true)
            window.sessionStorage.setItem('user', JSON.stringify({id: id, type: 'participant', name: 'Mwana Maabara', email: 'participant@mail.ke' }))
            rtr.push('/user', undefined, { unstable_skipClientCache: true })
        }
        window.location.reload()
    }
}

// simulate logout
export const simulateLogout = (rtr) => {
    if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('user');
        window.sessionStorage.removeItem('isLoggedIn');
        rtr.push('/auth/login', undefined, { unstable_skipClientCache: true })
        rtr.reload()
    }
}


// get user
export const simulateGetSession = () => {
    if (typeof window !== 'undefined') {
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