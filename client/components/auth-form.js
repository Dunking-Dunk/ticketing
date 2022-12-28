import { useState } from "react";
import Router from "next/router";
import useRequest from "../hooks/use-request";

export default ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: `/api/users/${type}`,
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    doRequest();
  };
  return (
    <form onSubmit={onSubmit} className="d-flex flex-column gap-3 m-5">
      <h1> {type === "signup" ? "sign up" : "sign in"}</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          className="form-control"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          className="form-control"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      {errors}
      <button className="btn btn-primary">
        {type === "signup" ? "sign up" : "sign in"}
      </button>
    </form>
  );
};
