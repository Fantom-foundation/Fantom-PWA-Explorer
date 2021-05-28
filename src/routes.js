import Home from "./views/Home.vue";
import NotFound from "./views/NotFound.vue";
import DataTablePlayground from "./views/DataTablePlayground.vue";
import Transactions from "./views/Transactions.vue";
import TransactionDetail from "./views/TransactionDetail.vue";
import AddressDetail from "./views/AddressDetail.vue";
import Blocks from "./views/Blocks.vue";
import BlockDetail from "./views/BlockDetail.vue";
import Validators from "./views/Validators.vue";
import ValidatorDetail from "./views/ValidatorDetail.vue";
import Contracts from "./views/Contracts.vue";
import Assets from "@/views/Assets.vue";
import AssetDetail from "@/views/AssetDetail.vue";
import Epochs from "@/views/Epochs.vue";
import EpochDetail from "@/views/EpochDetail.vue";

export const routes = [
    {
        name: "home",
        path: "/",
        component: Home
    },
    {
        name: "transactions",
        path: "/transactions",
        component: Transactions
    },
    {
        name: "transaction-detail",
        path: "/transactions/:id",
        component: TransactionDetail
    },
    {
        name: "tx-detail",
        path: "/tx/:id",
        component: TransactionDetail
    },
    {
        name: "address-detail",
        path: "/address/:id",
        component: AddressDetail
    },
    {
        name: "blocks",
        path: "/blocks",
        component: Blocks
    },
    {
        name: "block-detail",
        path: "/blocks/:id",
        component: BlockDetail
    },
    {
        name: "staking",
        path: "/staking",
        component: Validators
    },
    {
        name: "validator-detail",
        path: "/validator/:address",
        component: ValidatorDetail
    },
    {
        name: "assets",
        path: "/assets",
        component: Assets
    },
    {
        name: "asset-detail",
        path: "/assets/:address",
        component: AssetDetail
    },
    {
        name: "contracts",
        path: "/contracts",
        component: Contracts
    },
    {
        path: "/validators",
        redirect: { name: "staking" }
    },
    {
        name: "epochs",
        path: "/epochs",
        component: Epochs
    },
    {
        name: "epoch-detail",
        path: "/epoch/:id",
        component: EpochDetail
    },
    {
        name: "data-table-playground",
        path: "/data-table-playground",
        component: DataTablePlayground
    },
    {
        name: "not-found",
        path: "*",
        component: NotFound
    }
];
