import React from 'react';
import UnitList from '../../components/units/UnitList';
import UnitForm from '../../components/units/UnitForm';

const UnitsPage: React.FC = () => {
  return (
    <div>
      <h1>Units Management</h1>
      <UnitForm />
      <UnitList />
    </div>
  );
};

export default UnitsPage;