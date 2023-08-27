import { Prepack } from "@cookbook/domain/types/recipe/prepack";
import { TestIds } from "@cookbook/ui/test-ids";
import { useInjection } from "inversify-react-native";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { PrepacksRepository } from "../../../core/repositories/prepack.repository";
import { ExportToClipboard } from "../../common/clipboard-export";
import { EntityList } from "../../common/entity-list/entity-list";
import { RootViews } from "../../root-views.enum";
import { useProductsStore } from "../products/products.store";
import { usePrepacksStore } from "./prepacks.store";
import { useAppModals } from "../../common/modals/use-modals.hook";

export function PrepacksView({ navigation }) {
    const { t } = useTranslation();
    const clipboardExport = new ExportToClipboard(t);

    const repo = useInjection(PrepacksRepository);
    const { toast } = useAppModals();

    const { items: products } = useProductsStore();
    const { filteredItems: filteredPrepacks, set: setPrepacks, filter, deleteItem } = usePrepacksStore();

    useEffect(() => {
        repo.All().then(setPrepacks);
    }, [products]);

    const deletePrepack = async (id: string) => {
        try {
            await repo.Delete(id);

            deleteItem(id);
        } catch (e) {
            switch (e.code) {
                case 0: toast.show({ message: t('errors.prepack.fkViolation') }); break;
                default: toast.show({ message: t('errors.prepack.cantDelete') });
            }
        }
    };

    return (
        <View testID={TestIds.PrepacksView.Container} style={{ flexGrow: 1 }}>
            <TextInput
                testID={TestIds.PrepacksView.SearchInput}
                mode='flat'
                label={t('product.search.byName')}
                defaultValue=''
                onChange={event => filter(event.nativeEvent.text)}
            />

            <EntityList<Prepack>
                items={filteredPrepacks}
                itemTestId={TestIds.PrepacksView.ListItem}
                addNewButtonTestId={TestIds.PrepacksView.AddNewButton}
                addNewButtonText={t('prepack.addNew')}
                select={item => navigation.navigate(RootViews.PrepackDetails, { prepack: item })}
                addNew={() => navigation.navigate(RootViews.PrepackDetails, { prepack: repo.Create() })}
                remove={item => deletePrepack(item.id)}
                exportToClipboard={item => clipboardExport.prepack(item)}
            />
        </View>
    );
}