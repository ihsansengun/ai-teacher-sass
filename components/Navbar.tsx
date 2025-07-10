import Link from "next/link";
import Image from "next/image";
import NavItems from "@/components/NavItems";

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link href="/">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <Image src="/icons/logo.png" width="46" height="44" alt="logo" />
        </div>
      </Link>
      <div className="flex items-center gap-8">
        <NavItems />
        <p>Login</p>
      </div>
    </nav>
  );
};

export default Navbar;
