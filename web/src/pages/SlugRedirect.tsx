import { useParams } from "wouter";

export default function SlugRedirect() {
  const { slug } = useParams();
  return <div>SlugRedirect {slug}</div>
}