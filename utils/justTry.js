import { identity, tryCatch, __ } from "ramda";

const justTry = tryCatch(__, identity);
export default justTry;