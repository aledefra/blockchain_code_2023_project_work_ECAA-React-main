import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div className="header">
      <Link className="link" to="/">
        {" "}
        Homepage
      </Link>
      <Link className="link" to="/wallets">
        {" "}
        Multisig Wallet
      </Link>
      <Link className="link" to="/wallets/new">
        {" "}
        create Wallet
      </Link>
      {/* <Link className="link" to="/wallets/proposals">
        {" "}
        create Proposal
      </Link> */}
    </div>
  );
};
