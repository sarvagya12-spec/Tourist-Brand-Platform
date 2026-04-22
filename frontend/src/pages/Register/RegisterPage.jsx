import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Login/LoginPage.css'; // This reuses the same styling
import axios from 'axios'

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'brand' // Default role
    });
    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const res = await axios.post("http://localhost:8001/auth/register", formData);
            alert(res.data.message);
            navigate('/login')
        }catch(err){
            alert("Registration Failed: " + (err.response?.data?.detail || "Server Error"));

        }
        };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo-sq"></div>
                    <h2>Create Account</h2>
                    <p>Join the Brand AI platform to start analyzing</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            placeholder="John Doe" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@company.com" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required 
                        />
                    </div>
                    <div className="input-group">
                        <label>User Role</label>
                        <select 
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className="auth-select"
                        >
                            <option value="brand">Brand Analyst</option>
                            <option value="tourist">Tourist</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required 
                        />
                    </div>
                    <button type="submit" className="auth-submit">Register</button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
