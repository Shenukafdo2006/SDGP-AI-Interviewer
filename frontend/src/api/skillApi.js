const request = async (url, options) => {
  const response = await fetch(url, options);
  let data = {};

  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }

  if (!response.ok) {
    const message = data.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
};

export const getUserProgress = (uid) =>
  request(`/api/skills/progress?uid=${uid}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const updateGoalProgress = ({ uid, category, current, total }) =>
  request("/api/skills/goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, category, current, total }),
  });

export const updateRecommendationProgress = ({ uid, recommendationId, progress }) =>
  request("/api/skills/recommendations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, recommendationId, progress }),
  });

export const resetWeeklyGoals = (uid) =>
  request("/api/skills/reset-goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid }),
  });