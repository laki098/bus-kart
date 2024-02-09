const apiUrl =
  process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test"
    ? "http://localhost:5000"
    : "https://api.bustravel.rs";

console.log(apiUrl);
export default apiUrl;
