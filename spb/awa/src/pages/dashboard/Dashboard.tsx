import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../layouts/DashboardLayout';
import { clubService } from '../../services/api/clubService';
import { unitService } from '../../services/api/unitService';
import { Club, Unit } from '../../services/api/types';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch clubs
        const clubsResponse = await clubService.getClubs();
        if (clubsResponse.success && clubsResponse.data) {
          setClubs(clubsResponse.data);
        }

        // Fetch units
        const unitsResponse = await unitService.getUnits({ i: 5, p: 1 });
        if (unitsResponse.success && unitsResponse.data) {
          setUnits(unitsResponse.data.items);
        }
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard">
        <h1>Admin Dashboard</h1>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading dashboard data...</p>
          </div>
        ) : error ? (
          <div className="error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Retry</button>
          </div>
        ) : (
          <>
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>Total Clubs</h3>
                <p className="stat-value">{clubs.length}</p>
              </div>
              <div className="stat-card">
                <h3>Total Units</h3>
                <p className="stat-value">{units.length}</p>
              </div>
            </div>

            <section className="dashboard-section">
              <div className="section-header">
                <h2>Recent Clubs</h2>
                <a href="/clubs" className="view-all">View All</a>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clubs.slice(0, 5).map((club) => (
                      <tr key={club.id}>
                        <td>{club.name}</td>
                        <td>{club.phone}</td>
                        <td>{new Date(club.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="dashboard-section">
              <div className="section-header">
                <h2>Recent Units</h2>
                <a href="/units" className="view-all">View All</a>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {units.map((unit) => (
                      <tr key={unit.id}>
                        <td>{unit.name}</td>
                        <td>{unit.phone}</td>
                        <td>
                          <span className={`status status-${unit.status === 1 ? 'active' : 'inactive'}`}>
                            {unit.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;