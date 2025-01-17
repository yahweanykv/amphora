import React from 'react';
import './About.css'; // Подключение стилей

const About = () => {
    return (
        <div className="about-container">
            <h1>About & Policy</h1>
            <div className="legal-info">
                <h2>Privacy Policy</h2>
                <p>
                    Your privacy is important to us. We are committed to protecting your personal data and ensuring its security.
                </p>
                <h3>1. Information Collection</h3>
                <p>
                    We collect information you provide when registering on our website, as well as data about your use of the site.
                </p>
                <h3>2. Use of Information</h3>
                <p>
                    Your data is used to improve the quality of our services, personalize content, and ensure security.
                </p>
                <h3>3. Data Protection</h3>
                <p>
                    We use modern technologies to protect your data from unauthorized access.
                </p>
            </div>
        </div>
    );
};

export default About;