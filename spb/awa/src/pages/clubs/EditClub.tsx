import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ClubForm } from '../../components/clubs/ClubForm';
import { clubService } from '../../services/clubService';
import { Club } from '../../types/club';

const EditClub = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        const fetchedClub = await clubService.getClubById(id);
        setClub(fetchedClub);
      } catch (error) {
        console.error('Error fetching club:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClub();
  }, [id]);

  const handleUpdate = async (updatedClub: Club) => {
    try {
      await clubService.updateClub(id, updatedClub);
      history.push('/clubs');
    } catch (error) {
      console.error('Error updating club:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!club) {
    return <div>Club not found</div>;
  }

  return (
    <div>
      <h1>Edit Club</h1>
      <ClubForm initialData={club} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditClub;