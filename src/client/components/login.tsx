import { type User, type Session } from "better-auth";
import { useState, type KeyboardEventHandler } from "react";
import z from "zod";
// @ts-expect-error No types available
import { useRouteContext } from "@fastify/react/client";
import { Card, Button, TextInput, Label, Spinner } from "flowbite-react";
import cn from "../cn.js";
import { authClient } from "../auth.js";

export default function Login() {
  const [submitted, setSubmitted] = useState(false);
  const [un, setUn] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [unErr, setUnError] = useState(false);
  const error = !loading && submitted;

  const submit = async () => {
    setSubmitted(true);
    setLoading(true);
    const res = await authClient.signIn.email({
      email: un,
      password: pw,
    });

    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        setLoading(false);
      }, 5000);
    });
  };

  const onKeyDown: KeyboardEventHandler = async (e) => {
    if (e.key == "Enter") await submit();
  };

  return (
    <>
      <div className={cn(["flex", "max-w-md", "flex-col", "gap-4"])}>
        <Card className={cn(["h-fit"])}>
          <h5>Sign In</h5>
          <div>
            <Label htmlFor="email" color={error || unErr ? "failure" : ""}>
              Email
            </Label>
            <TextInput
              placeholder={"example@email.com"}
              color={error || unErr ? "failure" : ""}
              disabled={loading}
              required
              id="email"
              onKeyDown={onKeyDown}
              onChange={(e) => {
                try {
                  const email = z.email().parse(e.target.value);
                  setUn(email);
                  setUnError(false);
                } catch {
                  setUnError(true);
                }
              }}
            ></TextInput>
          </div>
          <div>
            <Label htmlFor="email" color={error ? "failure" : ""}>
              Password
            </Label>
            <TextInput
              color={error ? "failure" : ""}
              disabled={loading}
              required
              type="password"
              id="password"
              onKeyDown={onKeyDown}
              onChange={(e) => setPw(e.target.value)}
            ></TextInput>
          </div>
          {loading ? (
            <Button disabled>
              <Spinner size="sm" className="me-3" light></Spinner>
            </Button>
          ) : (
            <Button
              onClick={submit}
              disabled={un.length == 0 || pw.length == 0 || loading || unErr}
            >
              Submit
            </Button>
          )}
        </Card>
      </div>
    </>
  );
}
