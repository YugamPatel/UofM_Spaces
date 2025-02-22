fetch("http://localhost:5990/api/availability", {
  method: "POST",
})
  .then((res) => res.json()) // or res.text() if you prefer raw text
  .then((data) => console.log(data))
  .catch((err) => console.error("Error:", err));
