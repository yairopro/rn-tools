import { useState as state } from "react"
import callback from "./useCallback"
import effect, { useSyncEffect as syncEffect } from "./useEffect"
import forceRender from "./useForceRender"
import memory from "./useMemory"
import style from "./useStyle"
import subscribre from "./useSubscribe"
import responsiveLevel from "./useResponsiveLevel"
import responsive from "./useResponsive.ts"

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
	responsive,
};

export default use;