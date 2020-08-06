import {useState as state} from "react"
import callback from "./useCallback"
import effect, {useSyncEffect as syncEffect} from "./useEffect"
import forceRender from "./useForceRender"
import memory from "./useMemory"
import style from "./useStyle"
import subscribre from "./useSubscribe"
import responsiveLevel from "./useResponsiveLevel"

const use = {
	state,
	callback,
	effect,
	syncEffect,
	forceRender,
	memory,
	style,
	subscribre,
	responsiveLevel,
};

export default use;