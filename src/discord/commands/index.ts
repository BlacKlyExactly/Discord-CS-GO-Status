import { Command } from "../../utils/models";
import setserver from "./setserver";
import removeserver from "./removeserver";

const commands: Command[] | [] = [
    setserver,
    removeserver
];

export default commands;    