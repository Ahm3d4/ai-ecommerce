import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
    // 1. Local state memory to track what the user types in real-time
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    
    // 2. State to handle error feedback from the server
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // 3. Grab the login tool from your global useAuth hook box
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the browser from reloading the page on submit
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            // 4. Fire the async hook using the local state strings
            await login(email, password);
            alert("Authenticated successfully!");
        } catch (error: any) {
            // 5. Catch network rejections or bad credential errors
            setErrorMessage(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', background: '#1e1e1e', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', color: 'white' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Account Sign In</h2>
            
            {errorMessage && (
                <div style={{ background: '#d32f2f', color: 'white', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px', textAlign: 'center' }}>
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', color: '#aaa' }}>Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // ◄── Controlled Input
                        required 
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white', fontSize: '16px' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', color: '#aaa' }}>Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // ◄── Controlled Input
                        required 
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white', fontSize: '16px' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '10px', transition: 'background 0.2s' }}
                >
                    {isSubmitting ? 'Verifying...' : 'Sign In'}
                </button>
            </form>
        </div>
    );
};