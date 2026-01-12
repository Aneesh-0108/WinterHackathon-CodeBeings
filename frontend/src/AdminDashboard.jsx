import "./admin.css";

function AdminDashboard() {
  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <button className="admin-logout">Logout</button>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-title">Total Escalations</div>
          <div className="stat-value">0</div>
        </div>
        <div className="stat-card">
          <div className="stat-title">Pending</div>
          <div className="stat-value">0</div>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Query</th>
              <th>User</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="3" className="admin-empty">
                No escalated queries yet
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
