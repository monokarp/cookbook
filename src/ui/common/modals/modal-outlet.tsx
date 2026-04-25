import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useServices } from '../../services-context';

export function ModalOutlet() {

    const { modalService } = useServices();

    const [modal, setModal] = useState(null);

    useEffect(() => modalService.setOutletRef({
        setModal: (component, props) => setModal({ component, props }),
        clearModal: () => setModal(null),
    }), []);

    return (
        <View>
            {modal && React.createElement(modal.component, modal.props)}
        </View>
    );
};