import React from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { ClubList } from '../../components/clubs/ClubList';
import { UnitList } from '../../components/units/UnitList';

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <h1>Admin Dashboard</h1>
      <section>
        <h2>Clubs</h2>
        <ClubList />
      </section>
      <section>
        <h2>Units</h2>
        <UnitList />
      </section>
    </DashboardLayout>
  );
};

export default Dashboard;