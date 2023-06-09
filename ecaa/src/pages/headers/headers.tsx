import { Link } from "react-router-dom";
import { useAccount, useConnect } from "wagmi";

export const Header = () => {
	const { isConnected } = useAccount();
	const { connect, connectors } = useConnect();

	return (
		<nav className="navbar bg-body-secondary">
			<div className="container-fluid">
				<Link className="navbar-brand" to="/">
					Homepage
				</Link>
				<Link className="navbar-brand" to="/wallets">
					Your Multisigs
				</Link>
				<Link className="navbar-brand" to="/wallets/new">
					Create New Wallet
				</Link>

				{connectors.map((connector) => (
					<button
						disabled={isConnected}
						className="btn btn-lg btn-primary"
						key={connector.id}
						onClick={() => connect({ connector })}
					>
						{isConnected ? "Already connected" : `Connect to ${connector.name}`}
					</button>
				))}
			</div>
		</nav>
	);
};
