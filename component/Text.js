import React, {useContext} from "react"
import {Text as RNText} from "react-native"
import useStyle from "../hook/useStyle"

export default function Text({...props}){
	const contextStyle = useContext(TextStyleContext);
	props.style = useStyle(props.style, contextStyle, [contextStyle]);

	return <RNText {...props}/>;
}

export const TextStyleContext = React.createContext(undefined);