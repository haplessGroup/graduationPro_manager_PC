<template>
  <vxe-modal v-model="props.showEdit" :title="demo1.selectRow ? '编辑&保存' : '新增&保存'" width="800" min-width="600"
    min-height="300" :loading="demo1.submitLoading" resize destroy-on-close>
    <template #default>
      <vxe-form :data="demo1.formData" :rules="demo1.formRules" title-align="right" title-width="100"
        @submit="submitEvent">

        <vxe-form-item field="name" title="Name" :span="12" :item-render="{}">
          <template #default="{ data }">
            <vxe-input v-model="data.name" placeholder="请输入名称"></vxe-input>
          </template>
        </vxe-form-item>

        <vxe-form-item align="center" title-align="left" :span="24">
          <template #default>
            <vxe-button type="submit">提交</vxe-button>
            <vxe-button type="reset">重置</vxe-button>
          </template>
        </vxe-form-item>
      </vxe-form>
    </template>
  </vxe-modal>
</template>

<script lang="ts" setup >
import { reactive, ref, watch } from 'vue';
import { VxeFormItemPropTypes, VxeFormPropTypes, VXETable, VxeTableInstance } from 'vxe-table';
import type { userInfo } from '../treatadvice/treateadvice.vue';
const xTable = ref<VxeTableInstance>()
const props = defineProps<{ showEdit: boolean, userinfo: userInfo }>()
console.log(props.showEdit);
watch(
  () => props.showEdit,
  (newValue: any) => {
    console.log(newValue);

  })
const demo1 = reactive<any>({
  submitLoading: false,
  tableData: [] as any[],
  selectRow: null,
  showEdit: false,
  formData: {
    name: '',
    nickname: '',
    role: '',
    sex: '',
    age: '',
    num: '',
    checkedList: [],
    flag1: '',
    date3: '',
    address: ''
  },
  sexList: [
    { label: '女', value: '0' },
    { label: '男', value: '1' }
  ],
  formRules: {
    name: [
      { required: true, message: '请输入名称' },
      { min: 3, max: 5, message: '长度在 3 到 5 个字符' }
    ],
    nickname: [
      { required: true, message: '请输入昵称' }
    ],
    sex: [
      { required: true, message: '请选择性别' }
    ]
  } as VxeFormPropTypes.Rules
})
const visibleMethod: VxeFormItemPropTypes.VisibleMethod = ({ data }) => {
  return data.flag1 === 'Y'
}
const submitEvent = () => {
  demo1.submitLoading = true
  setTimeout(() => {
    const $table = xTable.value
    demo1.submitLoading = false
    demo1.showEdit = false
    if (demo1.selectRow) {
      VXETable.modal.message({ content: '保存成功', status: 'success' })
      Object.assign(demo1.selectRow, demo1.formData)
    } else {
      VXETable.modal.message({ content: '新增成功', status: 'success' })
      $table?.insert(demo1.formData)
    }
  }, 500)
}



</script>

<style lang="scss" scoped>
</style>
