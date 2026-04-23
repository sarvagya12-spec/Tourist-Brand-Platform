import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';
import { Bot } from 'lucide-react';

const LandingPage = () => {
    // Brand Logo URLs from your source
    const navigate = useNavigate();
    
    const swiperConfig = (reverse) => ({
        modules: [Autoplay],
        loop: true,
        slidesPerView: "auto",
        spaceBetween: 30,
        speed: 8000,
        allowTouchMove: false,

        autoplay: {
            delay: 0,
            reverseDirection: reverse,
            disableOnInteraction: false,
        },
    });
    
    const logosRTL = [
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-1-0.svg",
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-2-0.svg",
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-3-0.svg",
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-4-0.svg",
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-5-0.svg",
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-6-0.svg",
    ];

    const logosLTR = [
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-7-0.svg",
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-8-0.svg",
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-9-0.svg",
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-10-0.svg",
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-11-0.svg",
        "https://bato-web-agency.github.io/bato-shared/img/ticker-1/image-12-0.svg",
    ];

    return (
        <section className="landing-container">
            <nav className="landing-navbar">
                <div className="nav-left">
                    <div className="nav-logo-box">
                        <div className="logo-sq">
                            <Bot size={22} color="white" strokeWidth={2.5} 
                            />
                        </div>
                        <span className="logo-txt">BRAND AI</span>
                    </div>
                </div>
                <div className="nav-right">
                    <button onClick={() => navigate('/login')} className="login-btn">Log In</button>
                    <button onClick={() => navigate('/register')} className="register-btn">Register</button>
                </div>
            </nav>
            
            {/* HERO SECTION */}
            <div className="hero-video-section">
                <video 
                src="/Brand-vdo.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="background-video"
                ></video>
    
               <div className="video-overlay">
                <h1 className="hero-slogan">
                    Because every small business deserves <br />
                    big guidance
                </h1>
                <button onClick={() => navigate('/onboarding')} className="video-cta-btn">
                    Click to Continue
                </button>
               </div>
            </div>

            {/* TICKER SECTION */}
            <div className="ticker-container">
                <h2 className="ticker-title">A WORLD OF TRUSTED BRANDS</h2>
                
                <div className="ticker-rows">
                    {/* Row 1: Right to Left */}
                    <Swiper {...swiperConfig(false)} className="brand-swiper">
                        {[...logosRTL, ...logosRTL, ...logosRTL].map((url, i) => (
                            <SwiperSlide key={i} className="brand-slide">
                                <img src={url} alt="Brand" />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Row 2: Left to Right */}
                    <Swiper {...swiperConfig(true)} className="brand-swiper">
                        {[...logosLTR, ...logosLTR, ...logosLTR].map((url, i) => (
                            <SwiperSlide key={i} className="brand-slide">
                                <img src={url} alt="Brand" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
            {/* --- FOOTER SECTION --- */}
<footer className="landing-footer">
    <div className="footer-content">
        <div className="footer-brand">
            <div className="nav-logo-box">
                <div className="logo-sq"> <Bot size={22} color="white" strokeWidth={2.5} /></div>
                <span className="logo-txt">BRAND AI</span>
            </div>
            <p className="footer-desc">
                Empowering small businesses with world-class AI guidance 
                 and brand positioning analysis to win the market.
            </p>
        </div>
        
        <div className="footer-links-grid">
            <div className="footer-col">
                <h4>Platform</h4>
                <a href="#">AI Chat</a>
                <a href="#">Analysis</a>
                <a href="#">Positioning</a>
            </div>
            <div className="footer-col">
                <h4>Company</h4>
                <a href="#">About Us</a>
                <a href="#">Careers</a>
                <a href="#">Contact</a>
            </div>
            <div className="footer-col">
                <h4>Legal</h4>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
            </div>
        </div>
    </div>
    
    <div className="footer-bottom">
        <p>&copy; 2026 Brand AI Platform. All rights reserved.</p>
        <div className="footer-legal-links">
            <a href="#">Cookies</a>
            <a href="#">Security</a>
        </div>
    </div>
    
</footer>

        </section>
    );
};

export default LandingPage;
