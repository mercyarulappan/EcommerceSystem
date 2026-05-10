import { useEffect, useState } from "react";
import "../css/Profile.css"; // ✅ import CSS
import { toast,Slide } from "react-toastify";
function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  const [editMode, setEditMode] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:8080/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  }, []);

  const updateProfile = async () => {
    const response = await fetch("http://localhost:8080/api/users/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });

    if (response.ok) {
      toast("Profile updated", {
        style: {
          background: "#222",
          color: "#fff",
        },
        autoClose: 1000,
        transition: Slide,
        position: "top-center",
      });
      setEditMode(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2 className="profile-title">My Profile</h2>

        {/* VIEW MODE */}
        {!editMode && (
          <div>
            <p className="profile-text">
              <b>Name:</b> {user.name}
            </p>

            <p className="profile-text">
              <b>Email:</b> {user.email}
            </p>

            <button
              className="profile-btn profile-btn-primary"
              onClick={() => setEditMode(true)}
            >
              Update Profile
            </button>
          </div>
        )}

        {/* EDIT MODE */}
        {editMode && (
          <div>
            <div>
              <label className="profile-label">Name</label>
              <br />

              <input
                className="profile-input"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />
            </div>

            <br />

            <div>
              <label className="profile-label">Email</label>
              <br />

              <input className="profile-input" value={user.email} disabled />
            </div>

            <div className="profile-actions">
              <button
                className="profile-btn profile-btn-primary"
                onClick={updateProfile}
              >
                Save
              </button>

              <button
                className="profile-btn profile-btn-secondary"
                onClick={() => setEditMode(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
