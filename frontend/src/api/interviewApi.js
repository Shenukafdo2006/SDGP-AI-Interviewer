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

export const startInterview = ({ role, level }) =>
  request("/api/interview/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role, level }),
  });

export const submitAnswer = ({ sessionId, answer }) =>
  request("/api/interview/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, answer }),
  });
