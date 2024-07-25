"use client";

import { FormEvent, useState } from "react";
import axios from "axios";

const Newsletter = () => {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<
    "success" | "error" | "loading" | "idle"
  >("idle");
  const [responseMsg, setResponseMsg] = useState<string>("");
  const [statusCode, setStatusCode] = useState<number>();

  async function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const response = await axios.post("/api/subscribe", { email });

      setStatus("success");
      setStatusCode(response.status);
      setEmail("");
      setResponseMsg(response.data.message);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setStatus("error");
        setStatusCode(err.response?.status);
        setResponseMsg(err.response?.data.error);
      }
    }
  }

  return (
    <div className="flex justify-center">
    <form
  className="mb-4 w-full max-w-lg rounded px-8 pb-8 pt-6"
  onSubmit={handleSubscribe}
>
  <div className="flex">
    <input
      className={`mr-1 h-14 w-full items-center rounded border px-4 pr-4 caret-yellow-500 outline-none transition delay-75 ease-out focus-within:border-2 focus-within:border-yellow-500 disabled:border-slate-400 ${
        statusCode == 400 ? "border-red-600" : "border-yellow-500"
      } text-gray-800`}
      type="email"
      placeholder="What is your email address?"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      disabled={status == "loading"}
      style={{ textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}
    />
    <button
      className="focus:shadow-outline rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-yellow-600 focus:outline-none disabled:bg-slate-400" 
      type="submit"
      disabled={status == "loading"}
    >
      Subscribe
    </button>
  </div>
  <div className="server-message pt-4">
    {status === "success" ? (
      <p className="text-green-600">{responseMsg}</p>
    ) : null}
    {status === "error" ? (
      <p className="text-red-600">{responseMsg}</p>
    ) : null}
  </div>
</form>


    </div>
  );
};

export default Newsletter;
