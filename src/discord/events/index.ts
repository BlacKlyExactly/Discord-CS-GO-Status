import { Event } from "../../utils/models";
import ready from "./ready";

const events: Event[] | [] = [
    { name: "ready", func: ready }
]

export default events;