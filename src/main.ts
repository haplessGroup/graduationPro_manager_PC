import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/theme-chalk/el-drawer.css";
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message-box.css";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-notification.css";
import { createPinia } from "pinia";
import PiniaPluginPersist from "pinia-plugin-persistedstate";
import { App as TaPP, createApp } from "vue";
import {
  Column, Export, Icon,
  Keyboard,
  Table,
  VxeButton,
  VxeForm,
  VxeFormItem,
  VxeGrid,
  VxeIcon,
  VxeInput,
  VxeList,
  VxeModal,
  VxeModuleEdit,
  VxeModuleFilter, VxeModuleValidator, VxeOption,
  VxePager,
  VxeRadio,
  VxeRadioGroup,
  VxeSelect,
  VxeTable,
  VXETable,
  VxeTextarea,
  VxeToolbar,
  VxeTooltip
} from "vxe-table";
import zhCN from "vxe-table/es/locale/lang/zh-CN";
import "xe-utils";
import XEUtils from "xe-utils";
import App from "./App.vue";
import "./index.css";
import router from "./router";

const pinia = createPinia();
pinia.use(PiniaPluginPersist);
VXETable.setup({
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args),
});
function useTable(app: TaPP) {
  app
    .use(Icon)
    .use(Column)
    .use(Table)
    .use(VxeTable)
    .use(VxeGrid)
    .use(VxePager)
    .use(VxeInput)
    .use(VxeSelect)
    .use(VxeButton)
    .use(VxeForm)
    .use(VxeFormItem)
    .use(VxeList)
    .use(VxeModuleFilter)
    .use(VxeOption)
    .use(VxeModuleEdit)
    .use(VxeTooltip)
    .use(VxeIcon)
    .use(VxeModal)
    .use(VxeToolbar)
    .use(Keyboard)
    .use(VxeRadio)
    .use(VxeRadioGroup)
    .use(VxeTextarea).use(VxeModuleValidator).use(Export)
}
createApp(App)
  .use(router)
  .use(pinia)
  .use(useTable)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount("#app");
