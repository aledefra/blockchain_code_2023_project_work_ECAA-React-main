import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <nav className="navbar bg-body-secondary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Homepage
        </Link>
        <Link className="navbar-brand" to="/wallets">
          Multisig Wallet
        </Link>
        <Link className="navbar-brand" to="/wallets/new">
          create Wallet
        </Link>
      </div>
    </nav>
  );
};
