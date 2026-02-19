import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [resumeId, setResumeId] = useState(null);
    const [resumeData, setResumeData] = useState(null);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);

    const value = {
        resumeId,
        setResumeId,
        resumeData,
        setResumeData,
        dashboardData,
        setDashboardData,
        loading,
        setLoading,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error('useApp must be used within AppProvider');
    return ctx;
}
