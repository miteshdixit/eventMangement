import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthCreation";
import { getUserProfile, updateUserProfile } from "../services/api";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await getUserProfile(user.token);
      setName(response.name);
      setEmail(response.email);
    };
    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUserProfile(user.token, { name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Update Profile</button>
    </form>
  );
};

export default Profile;
