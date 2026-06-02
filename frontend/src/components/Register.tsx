import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface RegisterProps {
    onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [fullName, setFullName] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const { register } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setIsSubmitting(true);

        try {
            await register(email, password, fullName);
            alert("Account created successfully!");
        } catch (error: any) {
            setErrorMessage(error.message || "Registration failed.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', background: '#1e1e1e', borderRadius: '8px', color: 'white' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Create Account</h2>
            
            {errorMessage && (
                <div style={{ background: '#d32f2f', color: 'white', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', color: '#aaa' }}>Full Name</label>
                    <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required 
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', color: '#aaa' }}>Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <label style={{ fontSize: '14px', color: '#aaa' }}>Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        style={{ padding: '10px', borderRadius: '4px', border: '1px solid #333', background: '#111', color: 'white' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '10px' }}
                >
                    {isSubmitting ? 'Creating Profile...' : 'Sign Up'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', color: '#aaa', fontSize: '14px' }}>
                Already have an account?{' '}
                <span onClick={onSwitchToLogin} style={{ color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
                    Log In
                </span>
            </p>
        </div>
    );
};