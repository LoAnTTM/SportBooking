import React, { useState } from 'react';
import UnitForm from '../../components/units/UnitForm';
import { createUnit } from '../../services/unitService';
import { useHistory } from 'react-router-dom';

const CreateUnit = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (unitData) => {
    setLoading(true);
    try {
      await createUnit(unitData);
      history.push('/units'); // Redirect to units page after creation
    } catch (error) {
      console.error('Failed to create unit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Unit</h1>
      <UnitForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CreateUnit;