import React, { useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Dialog, Portal, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

const ITEM_HEIGHT = 52;
const VISIBLE_ITEMS = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2);

const WHOLE_NUMBERS = Array.from({ length: 100 }, (_, i) => i);
const DECIMALS = Array.from({ length: 10 }, (_, i) => i);

interface WheelProps {
    items: number[];
    initialIndex: number;
    onSelect: (index: number) => void;
    format?: (n: number) => string;
}

function Wheel({ items, initialIndex, onSelect, format = String }: WheelProps) {
    const [selectedIndex, setSelectedIndex] = useState(initialIndex);

    return (
        <View style={{ height: WHEEL_HEIGHT, width: 72, overflow: "hidden" }}>
            <View
                style={{
                    position: "absolute",
                    top: PADDING,
                    height: ITEM_HEIGHT,
                    left: 0,
                    right: 0,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "#999",
                }}
                pointerEvents="none"
            />
            <FlatList
                data={items}
                keyExtractor={item => String(item)}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate="fast"
                initialScrollIndex={initialIndex}
                extraData={selectedIndex}
                getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
                ListHeaderComponent={<View style={{ height: PADDING }} />}
                ListFooterComponent={<View style={{ height: PADDING }} />}
                onMomentumScrollEnd={e => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
                    setSelectedIndex(index);
                    onSelect(index);
                }}
                renderItem={({ item, index }) => (
                    <View style={{ height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" }}>
                        <Text variant="headlineSmall" style={{ opacity: index === selectedIndex ? 1 : 0.3 }}>
                            {format(item)}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

export interface RatioPickerProps {
    initialValue: number;
    onResult: (value: number | null) => void;
}

export function RatioPicker({ initialValue, onResult }: RatioPickerProps) {
    const { t } = useTranslation();

    const initWhole = Math.min(Math.floor(initialValue), 99);
    const initDecimal = Math.round((initialValue % 1) * 10);

    const wholeRef = useRef(initWhole);
    const decimalRef = useRef(initDecimal);

    const confirm = () => onResult(wholeRef.current + decimalRef.current / 10);
    const cancel = () => onResult(null);

    return (
        <Portal>
            <Dialog visible onDismiss={cancel}>
                <Dialog.Content>
                    <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 }}>
                        <Wheel
                            items={WHOLE_NUMBERS}
                            initialIndex={initWhole}
                            onSelect={i => {
                                wholeRef.current = i;
                            }}
                            format={n => String(n).padStart(2, "0")}
                        />
                        <Text variant="headlineMedium">.</Text>
                        <Wheel
                            items={DECIMALS}
                            initialIndex={initDecimal}
                            onSelect={i => {
                                decimalRef.current = i;
                            }}
                        />
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={cancel}>{t("common.cancel")}</Button>
                    <Button onPress={confirm}>{t("common.done")}</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}
