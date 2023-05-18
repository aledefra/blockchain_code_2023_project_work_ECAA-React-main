import { Route, Routes} from "react-router-dom";
import { Homepage } from "./pages/homepage/homepage";
<<<<<<< Updated upstream
import { MyWallets } from "./pages/myWallets/MyWallets";
import { NotFound } from "./pages/not-found/notFound";
import { CreateWallet } from "./pages/createWallet/createWallet";
import { defaultInitialize } from "./utils/createWallet";
import { CreateProposal } from "./pages/proposals/createProposal";
=======
import { MyWallets } from "./pages/multisigWallet/MyWallets";
import { NotFound } from "./pages/not-found/notFound";
import { CreateWallet } from "./pages/createWallet/createWallet";
import { defaultInitialize} from "./utils/createWallet";
import { CreateProposal } from "./pages/proposals/proposal-type";
import { Owners } from "./pages/owners/owners";
>>>>>>> Stashed changes
import { defaultValueProposal } from "./utils/createProposal";
import { MultisigWallet } from "./pages/multisigWallet/multisigWallet";


<<<<<<< Updated upstream
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
=======
export const AppRoutes = () => {
    return (
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/wallets">
          <Route index element={<MyWallets />} />
          <Route
            path=":address/proposals"
            element={<CreateProposal {...defaultValueProposal} />}
          />
          <Route path=":address" element={<MultisigWallet />} />
          <Route
            path=":address/owners"
            element={<Owners {...defaultValueProposal} />}
          />

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
}
>>>>>>> Stashed changes
