import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    // Brand Logo URLs from your source
    const navigate = useNavigate();
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

    return (
        <section className="landing-container">
            <nav className="landing-navbar">
                <div className="nav-left">
                    <div className="nav-logo-box">
                        <div className="logo-sq">
                            <div className="logo-white-bar"></div>
                        </div>
                        <span className="logo-txt">BRAND AI</span>
                    </div>
                </div>
                <div className="nav-center">
                    <a href="#">Platform</a>
                    <a href="#">Solutions</a>
                    <a href="#">Insights</a>
                    <a href="#">Company</a>
                </div>
                <div className="nav-right">
                    <button onClick={() => navigate('/login')} className="login-btn">Log In</button>
                    <button onClick={() => navigate('/register')} className="register-btn">Register</button>
                </div>
            </nav>
            
            {/* HERO SECTION */}
            <div className="hero-section">
                <div className="status-badge">v2.0 Artificial Intelligence is here</div>
                <p className="login-subtitle">Sign in to securely access the AI Chatbot</p>
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
        </section>
    );
};

export default LandingPage;
