import { useState } from "react";
import "./App.css";
import http, { refreshToken } from "./http/http";

function App() {
  const [userName] = useState("admin");
  const [passWord] = useState("admin");

  const handelSubmit = (event) => {
    event.preventDefault();
    http
      .post("login", {
        userName,
        passWord,
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("access_token", res.data.access_token);
        localStorage.setItem("refresh_token", res.data.refresh_token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <form id="login-form" onSubmit={handelSubmit}>
        <div>
          <label htmlFor="username">User Name</label>
          <input
            type="text"
            name="username"
            id="username"
            value={userName}
            onChange={() => {}}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={passWord}
            onChange={() => {}}
          />
        </div>
        <button id="btn-login" type="submit">
          Login
        </button>
      </form>
      <div>
        <button id="btn-get-refresh-token" onClick={() => refreshToken()}>
          Refresh Token
        </button>
      </div>
    </>
  );
}

export default App;
