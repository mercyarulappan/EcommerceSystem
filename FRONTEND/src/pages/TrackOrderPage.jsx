import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/TrackOrderPage.css"; // ✅ import CSS

function TrackOrderPage() {
  const [tracking, setTracking] = useState([]);
  const { groupId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:8080/api/order-tracking/track/${groupId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error fetching tracking");
        return res.json();
      })
      .then((data) => setTracking(data))
      .catch((err) => console.error(err));
  }, [groupId]);


  return (
    <div className="track-container">
      <h2 className="track-title">Order Tracking</h2>

      <div className="timeline">
        {tracking.map((t, index) => (
          <div key={index} className="timeline-item">
            <h4 className="track-status">📦 {t.status}</h4>
            <p className="track-desc">{t.description}</p>
            <p className="track-location">📍 {t.location}</p>
            <small className="track-date">{t.createdAt}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TrackOrderPage;
