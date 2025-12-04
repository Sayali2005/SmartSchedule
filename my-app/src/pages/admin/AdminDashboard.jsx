// Admin Dashboard main page with tabs
import { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import OverviewTab from './tabs/OverviewTab';
import InstructorsTab from './tabs/InstructorsTab';
import CoursesTab from './tabs/CoursesTab';
import ScheduleTab from './tabs/ScheduleTab';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const renderTab = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab onTabChange={setActiveTab} />;
            case 'instructors':
                return <InstructorsTab />;
            case 'courses':
                return <CoursesTab />;
            case 'schedule':
                return <ScheduleTab />;
            default:
                return <OverviewTab onTabChange={setActiveTab} />;
        }
    };

    return (
        <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {renderTab()}
        </AdminLayout>
    );
};

export default AdminDashboard;
