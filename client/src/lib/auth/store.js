
export function saveAuth(token, user) {
    localStorage.setItem("token", token)
    localStorage.setItem("user", user)
}

export function getAuth() {
    const token = localStorage.getItem("token");                                                                                                                                                                      
    if (!token) return null;
                                                                                                                                                                                                                      
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));                                                                                                                                                        
        if (payload.exp * 1000 < Date.now()) {
            clearAuth(); 
            return null;                                                                                                                                                                                              
        }
        return token;                                                                                                                                                                                                 
    } catch {                                                                                                                                                                                                         
        clearAuth(); 
        return null;                                                                                                                                                                                                  
    }           
}

export function getCurrentUser() {
    return localStorage.getItem("user")
}

export function clearAuth() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
}