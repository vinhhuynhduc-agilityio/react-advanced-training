// Home.tsx
import React, { useEffect, useState } from "react";

const Home: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <div>Loading Home...</div>;
    }

    return (
        <div>
            <h1>Welcome to Home Page</h1>
        </div>
    );
};

export default Home;
