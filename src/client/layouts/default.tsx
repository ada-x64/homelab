import { type User, type Session } from "better-auth";
import {
  Suspense,
  useState,
  type KeyboardEventHandler,
  type PropsWithChildren,
} from "react";
import z from "zod";
// @ts-expect-error No types available
import { useRouteContext } from "@fastify/react/client";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import cn from "../cn.js";
import type { State } from "../context";
import { authClient } from "../auth.js";
import { useStore } from "@nanostores/react";

export const streaming = true;

export default function Auth({ children }: PropsWithChildren) {
  const session = useStore(authClient.useSession);
  if (session.data) {
    return children;
  }
  return (
    <div className={cn(["flex", "justify-center", "items-center", "h-dvh"])}>
      <Suspense fallback={<></>}>
        {session.data ? children : <Login />}
      </Suspense>
    </div>
  );
}

function Login() {
  const { state, snapshot }: { state: State; snapshot: State } =
    useRouteContext();
  const [submitted, setSubmitted] = useState(false);
  const [un, setUn] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [unErr, setUnError] = useState(false);
  const error = !loading && submitted && !snapshot.user;

  const submit = async () => {
    setSubmitted(true);
    setLoading(true);
    const res = await authClient.signIn.email({
      email: un,
      password: pw,
    });
    state.user = res.data?.user as User;

    const res2 = await authClient.getSession();
    state.session = res2.data?.session as Session;

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
      <Card className={cn(["h-fit"])}>
        <CardContent>
          <Typography gutterBottom variant="h5">
            Sign In
          </Typography>
          <Box
            component="form"
            sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
            noValidate
            autoComplete="off"
          >
            <div>
              <TextField
                error={error || unErr}
                disabled={loading}
                required
                id="email"
                label="Email"
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
              ></TextField>
            </div>
            <div>
              <TextField
                error={error}
                disabled={loading}
                required
                type="password"
                id="password"
                label="Password"
                onKeyDown={onKeyDown}
                onChange={(e) => setPw(e.target.value)}
              ></TextField>
            </div>
            <CardActions>
              <Button
                loading={loading}
                variant="contained"
                onClick={submit}
                disabled={un.length == 0 || pw.length == 0 || loading || unErr}
              >
                Submit
              </Button>
            </CardActions>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}
