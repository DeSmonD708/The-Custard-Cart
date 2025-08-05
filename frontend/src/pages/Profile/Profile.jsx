import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get('https://custardcart.onrender.com/api/user/profile', {
          headers: { token }
        });

        if (res.data.success) {
          setUser(res.data.user);
        } else {
          setError("Failed to load profile.");
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong.");
      }
    };

    fetchProfile();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!user) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">My Profile</h2>
      <div className="profile-card">
        <p><strong>Name:</strong> {user.name || 'Not set'}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone || 'Not set'}</p>
        <p><strong>Default Address:</strong></p>
        <div className="profile-address">
          {user.address ? (
            <>
              <p>{user.address.address}</p>
              <p>{user.address.city}, {user.address.state}</p>
              <p>{user.address.zipcode}, {user.address.country}</p>
            </>
          ) : (
            <p>Not set</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
