import { Suspense, useState, type PropsWithChildren } from "react";
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

export default function Auth({ children }: PropsWithChildren) {
  const { snapshot }: { snapshot: any } = useRouteContext();
  return <Suspense>{!!snapshot.user ? children : <Login />}</Suspense>;
}

function Login() {
  const { state, snapshot }: { state: State; snapshot: State } =
    useRouteContext();
  const [submitted, setSubmitted] = useState(false);
  const [un, setUn] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const error = !loading && submitted && !snapshot.user;

  const submit = async () => {
    setSubmitted(true);
    setLoading(true);
    new Promise((resolve, reject) => {
      setTimeout(async () => {
        const res = await authClient.signIn.email({
          email: un,
          password: pw,
          fetchOptions: {
            onRequest: (ctx) => {
              setLoading(true);
            },
            onResponse: (ctx) => {
              setLoading(false);
            },
          },
        });
        const user = res.data?.user || null;
        state.user = user;
      }, 1000);
    });
  };

  return (
    <>
      <div className={cn(["flex", "justify-center", "items-center", "h-dvh"])}>
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
                  error={error}
                  required
                  id="email"
                  label="Email"
                  onChange={(e) => setUn(e.target.value)}
                ></TextField>
              </div>
              <div>
                <TextField
                  error={error}
                  required
                  type="password"
                  id="password"
                  label="Password"
                  onChange={(e) => setPw(e.target.value)}
                ></TextField>
              </div>
              <CardActions>
                <Button
                  loading={loading}
                  variant="contained"
                  onClick={submit}
                  disabled={loading}
                >
                  Submit
                </Button>
              </CardActions>
            </Box>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
