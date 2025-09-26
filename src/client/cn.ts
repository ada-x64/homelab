export default function (classes: string[] | string) {
  if (Array.isArray(classes)) {
    return classes.join(" ");
  } else {
    return classes;
  }
}
