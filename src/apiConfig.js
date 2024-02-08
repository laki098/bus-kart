const apiUrl =
  process.env.DEPLOY == 1
    ? "https://api.bustravel.rs"
    : "http://localhost:5000";

export default apiUrl;
