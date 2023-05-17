import { Route, Routes } from "react-router-dom";
import { Homepage } from "./pages/homepage/homepage";
import { MyWallets } from "./pages/myWallets/MyWallets";
import { NotFound } from "./pages/not-found/notFound";
import { CreateWallet } from "./pages/createWallet/createWallet";
import { defaultInitialize } from "./utils/createWallet";
import { CreateProposal } from "./pages/proposals/createProposal";
import { defaultValueProposal } from "./utils/createProposal";
import { MultisigWallet } from "./pages/multisigWallet/multisigWallet";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/wallets">
        <Route index element={<MyWallets />} />
        <Route
          path="newproposal/:address"
          element={<CreateProposal {...defaultValueProposal} />}
        />
        <Route path=":address" element={<MultisigWallet />} />

        <Route
          path="new"
          element={<CreateWallet defaultValue={defaultInitialize} />}
        />
        {/* <Route
            path="proposals"
            element={<CreateProposal {...defaultValueProposal} />}
          /> */}
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
