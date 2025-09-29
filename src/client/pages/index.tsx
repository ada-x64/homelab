import cn from "../cn";

export function getMeta() {
  return {
    title: "Welcome to @fastify/react!",
  };
}

export function Glances({ title, src }: { title: string; src: URL | string }) {
  // sync from glances... just use an iframe
  return <iframe title={title} src={src.toString()} />;
}

export default function Index() {
  return (
    <>
      <div className={cn(["grid", "grid-cols-2"])}>
        <div id="apps"></div>
        <div id="statues"></div>
      </div>
    </>
  );
}
