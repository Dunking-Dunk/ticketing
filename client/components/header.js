import Link from "next/link";

export default ({ currentUser }) => {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>{label}</Link>
        </li>
      );
    });

  return (
    <nav className="navbar navbar-light bg-light px-5">
      <Link href="/" className="navbar-brand">
        Rec
      </Link>

      <div className="d-flex justify-content-end w-50">
        <ul className="nav d-flex align-items-center justify-content-evenly w-100">
          {links}
        </ul>
      </div>
    </nav>
  );
};
