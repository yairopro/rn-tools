import { nthArg, tryCatch, __ } from "ramda";

const justTry = tryCatch(__, nthArg(1));
export default justTry;