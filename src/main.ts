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
  VXETable,
  VxeButton,
  VxeCheckbox,
  VxeForm,
  VxeFormItem,
  VxeGrid,
  VxeIcon,
  VxeInput,
  VxeList,
  VxeModal,
  VxeModuleEdit,
  VxeModuleExport,
  VxeModuleFilter, VxeModuleValidator, VxeOption,
  VxePager,
  VxeRadio,
  VxeRadioGroup,
  VxeSelect,
  VxeTable,
  VxeTextarea,
  VxeToolbar,
  VxeTooltip
} from "vxe-table";
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx';
import zhCN from "vxe-table/es/locale/lang/zh-CN";
import "xe-utils";
import XEUtils from "xe-utils";
import App from "./App.vue";
import "./index.css";
import router from "./router";
VXETable.use(VXETablePluginExportXLSX)
const pinia = createPinia();
pinia.use(PiniaPluginPersist);
VXETable.setup({
  keepSource: true,
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
    .use(VxeTextarea).use(VxeModuleValidator).use(Export).use(VxeModuleExport).use(VxeCheckbox)
}
createApp(App)
  .use(router)
  .use(pinia)
  .use(useTable)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount("#app");
