import Hero from "@/components/layout/Hero";
import Header from "@/components/layout/Header"
import HomeMenu from "@/components/layout/HomeMenu"
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Header></Header>
      <Hero></Hero>
      <HomeMenu></HomeMenu>
    </>
  );
}
