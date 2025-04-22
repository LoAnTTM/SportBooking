import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UnitForm from '../../components/units/UnitForm';
import { getUnitById, updateUnit } from '../../services/unitService';
import { Unit } from '../../types/unit';

const EditUnit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const fetchedUnit = await getUnitById(id!);
        setUnit(fetchedUnit);
      } catch (error) {
        console.error('Error fetching unit:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [id]);

  const handleUpdate = async (updatedUnit: Unit) => {
    try {
      await updateUnit(id!, updatedUnit);
      navigate('/units');
    } catch (error) {
      console.error('Error updating unit:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!unit) {
    return <div>Unit not found</div>;
  }

  return (
    <div>
      <h1>Edit Unit</h1>
      <UnitForm unit={unit} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditUnit;