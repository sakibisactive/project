import React, { useContext } from 'react';
import { AuthContext, AuthProvider } from '../context/AuthContext';
 // Update the path if your context is in a different directory

const AdminDashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  // Optional: Admin email/role-based check, usually you'd set a role for admins
  if (!user || user.role !== 'admin') {
    return <div>Access Denied. You are not an admin.</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Welcome, Admin {user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {/* Add more dashboard widgets/components here */}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
