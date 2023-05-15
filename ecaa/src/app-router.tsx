import { Route, Routes} from "react-router-dom";
import { Homepage } from "./pages/homepage/homepage";
import { MultisigWallet } from "./pages/multisigWallet/multisigWallet";
import { NotFound } from "./pages/not-found/notFound";
import { CreateWallet } from "./pages/createWallet/createWallet";
import { defaultInitialize } from "./utils/createWallet";
import { CreateWalletTest } from "./pages/createWallet/createWallet._test";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/wallets">
                <Route index element={<MultisigWallet />} />
                <Route path=":address" element={<MultisigWallet />} />

                    <Route path="new" element= {<CreateWallet />} />
                </Route>
                <Route path="*" element ={<NotFound />} />
            
        </Routes>
    )
}