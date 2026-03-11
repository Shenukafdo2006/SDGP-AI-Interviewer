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

export const startInterview = ({ role, level, interviewType }) =>
  request("/api/interview/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role, level, interviewType }),
  });

export const submitAnswer = ({ sessionId, answer, facialData }) =>
  request("/api/interview/answer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, answer, facialData }),
  });

export const getSessionData = (sessionId) =>
  request(`/api/interview/${sessionId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const getSessionFeedback = (sessionId) =>
  request(`/api/interview/${sessionId}/feedback`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

export const analyzeFacialExpression = ({ frameBase64, question }) =>
  request("/api/interview/facial-analysis", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ frame_base64: frameBase64, question }),
  });
