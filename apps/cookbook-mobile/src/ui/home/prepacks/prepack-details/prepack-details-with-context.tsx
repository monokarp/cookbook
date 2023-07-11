import { useRef } from "react";
import { PrepackDetails } from "./prepack-details";
import { PrepackDetailsContext, createPrepackDetailsStore } from "./prepack-details.store";

export function PrepackDetailsWithContext(props) {
    return (
        <PrepackDetailsContext.Provider value={useRef(createPrepackDetailsStore(props.route.params.prepack)).current}>
            <PrepackDetails {...props} />
        </PrepackDetailsContext.Provider>
    );
}