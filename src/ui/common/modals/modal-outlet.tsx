import { useInjection } from "inversify-react-native";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { ModalService } from "./modal.service";

export function ModalOutlet() {

    const service = useInjection(ModalService);

    const [modal, setModal] = useState(null);

    useEffect(() => service.setOutletRef({
        setModal: (component, props) => setModal({ component, props }),
        clearModal: () => setModal(null),
    }), []);

    return (
        <View>
            {modal && React.createElement(modal.component, modal.props)}
        </View>
    );
};