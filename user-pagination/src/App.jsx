import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const sample_user = {
  gender: "male",
  name: {
    title: "Monsieur",
    first: "Giacomo",
    last: "Renard",
  },
  location: {
    street: {
      number: 7372,
      name: "Rue Abel",
    },
    city: "Rifferswil",
    state: "Appenzell Innerrhoden",
    country: "Switzerland",
    postcode: 4549,
    coordinates: {
      latitude: "-63.8094",
      longitude: "-82.4835",
    },
    timezone: {
      offset: "+1:00",
      description: "Brussels, Copenhagen, Madrid, Paris",
    },
  },
  email: "giacomo.renard@example.com",
  dob: {
    date: "1976-12-23T22:41:32.116Z",
    age: 48,
  },
  phone: "075 414 06 14",
  picture: {
    large: "https://randomuser.me/api/portraits/men/85.jpg",
  },
  nat: "CH",
};

function UserCard({ user, onCardClick }) {
  return (
    <div className="user-card" onClick={() => onCardClick(user)}>
      <img src={user.picture.large} alt={user.name.first} className="user-image" />
      <div className="user-details">
        <h3 className="user-name">{user.name.title} {user.name.first} {user.name.last}</h3>
        <p className="user-email">📧 {user.email}</p>
        <p className="user-location">📍 {user.location.city}, {user.location.state}, {user.location.country}</p>
      </div>
    </div>
  );
}

function UserDialog({ user, onClose }) {
  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog" onClick={(e) => e.stopPropagation()}>
        <button className="dialog-close" onClick={onClose}>x</button>
        <img src={user.picture.large} alt={user.name.first} className="dialog-image" />
        <h3 className="dialog-name">{user.name.title} {user.name.first} {user.name.last}</h3>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Gender:</strong> {user.gender}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Cell:</strong> {user.cell}</p>
        <p><strong>Location:</strong> {user.location.street.number} {user.location.street.name}, {user.location.city}, {user.location.state}, {user.location.country} ({user.location.postcode})</p>
        <p><strong>Coordinates:</strong> {user.location.coordinates.latitude}, {user.location.coordinates.longitude}</p>
        <p><strong>Timezone:</strong> {user.location.timezone.description} ({user.location.timezone.offset})</p>
        <p><strong>Age:</strong> {user.dob.age}</p>
        <p><strong>Date of Birth:</strong> {new Date(user.dob.date).toLocaleDateString()}</p>
        <p><strong>Nationality:</strong> {user.nat}</p>
      </div>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://randomuser.me/api/?page=${page}&results=10`);
      setUsers((prev) => [...prev, ...response.data.results]);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleLoadMoreUsers = () => {
    setPage((prev) => prev + 1);
  };

  const handleCardClick = (user) => {
    setSelectedUser(user);
  };

  const handleCloseDialog = () => {
    setSelectedUser(null);
  };

  return (
    <div className="app">
      <h1 className="app-title">Random Users</h1>
      <div className="user-list">
        {users.map((user, index) => (
          <UserCard key={index} user={user} onCardClick={handleCardClick} />
        ))}
      </div>
   
      <button className="load-more" onClick={handleLoadMoreUsers} disabled={loading}>
        {loading ? "Loading..." : "Load More Users"}
      </button>
      
      {selectedUser && <UserDialog user={selectedUser} onClose={handleCloseDialog} />}
    </div>
  );
}

export default App;
