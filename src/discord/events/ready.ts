import { refreshServers } from "../../utils/functions";

export default async () => {
    setInterval(() => {
        refreshServers();
    }, 60000)

    console.log("Cs:Go Stats > Ready");
}