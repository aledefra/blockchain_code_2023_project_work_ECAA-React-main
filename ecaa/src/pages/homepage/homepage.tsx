import { Link } from "react-router-dom";
import { useConnect, useAccount } from "wagmi";

export const Homepage = () => {
	const { address, isConnected } = useAccount();
	const { connect, connectors } = useConnect();

	return (
    <div>
      <h1 className="mb-4">Multisig Wallet</h1>

      {isConnected && <h3>Connected with address {address}</h3>}
      {!isConnected && <h2>Please connect your wallet</h2>}

      <div>
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

      <Link to="/wallets">
        <button className="btn btn-primary mt-5">Wallets</button>
      </Link>
    </div>
  );
};
