// frontend/src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null); 

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
            const decodedUser = jwtDecode(token); // Decodifica o token
            setUser(decodedUser); // Guarda os dados do usuário no estado
        } else {
            localStorage.removeItem('token');
            setUser(null); // Limpa o usuário se não houver token
        }
    }, [token]);

    const loginAction = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/api/auth/login', data);
            setToken(response.data.token);
            return response;
        } catch (error) {
            console.error("Erro no login", error);
            throw error;
        }
    };

    const registerAction = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/api/auth/register', data);
            return response;
        } catch (error) {
            console.error("Erro no registro", error);
            throw error;
        }
    };

    const logOut = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, loginAction, logOut, registerAction }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };