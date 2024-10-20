// About.tsx
import React, { useEffect, useState } from 'react';

const About: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <div>Loading About...</div>;
    }

    return (
        <div>
            <h1>About Us</h1>
            <p>This is the About page.</p>
        </div>
    );
};

export default About;
