import ora from "ora";

export default function loading(text: string) {
  const loader = ora(text);
  loader.color = "yellow";
  return loader;
}
