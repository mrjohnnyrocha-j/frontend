// Gamification.js

import React, { useState, useEffect } from "react";

const Gamification = () => {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);

  // Example: Award points based on user actions
  const awardPoints = (action) => {
    let earnedPoints = 0;
    switch (action) {
      case "add-app":
        earnedPoints = 10;
        break;
      case "complete-task":
        earnedPoints = 20;
        break;
      case "customize-layout":
        earnedPoints = 15;
        break;
      default:
        earnedPoints = 5;
    }
    setPoints((prev) => prev + earnedPoints);
  };

  // Example: Award badges based on points
  useEffect(() => {
    if (points >= 50 && !badges.includes("Contributor")) {
      setBadges([...badges, "Contributor"]);
    }
    if (points >= 100 && !badges.includes("Elite User")) {
      setBadges([...badges, "Elite User"]);
    }
  }, [points, badges]);

  // Example: Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/leaderboard");
        if (res.ok) {
          const data = await res.json();
          setLeaderboard(data.leaderboard);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div style={{ margin: "20px 0" }}>
      <h3>Gamification</h3>
      <div>
        <strong>Points:</strong> {points}
      </div>
      <div>
        <strong>Badges:</strong> {badges.join(", ") || "None"}
      </div>
      <div>
        <h4>Leaderboard</h4>
        <ol>
          {leaderboard.map((user, index) => (
            <li key={index}>
              {user.name}: {user.points} pts
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Gamification;
