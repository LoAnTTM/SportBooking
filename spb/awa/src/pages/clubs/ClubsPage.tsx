import React from 'react';
import ClubList from '../../components/clubs/ClubList';
import ClubForm from '../../components/clubs/ClubForm';

const ClubsPage: React.FC = () => {
  return (
    <div>
      <h1>Clubs Management</h1>
      <ClubForm />
      <ClubList />
    </div>
  );
};

export default ClubsPage;