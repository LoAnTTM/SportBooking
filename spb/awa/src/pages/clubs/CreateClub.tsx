import React, { useState } from 'react';
import ClubForm from '../../components/clubs/ClubForm';
import { createClub } from '../../services/clubService';

const CreateClub = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (clubData) => {
    setLoading(true);
    setError('');
    try {
      await createClub(clubData);
      // Handle successful club creation (e.g., redirect or show a success message)
    } catch (err) {
      setError('Failed to create club. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Club</h1>
      {error && <p className="error">{error}</p>}
      <ClubForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
};

export default CreateClub;