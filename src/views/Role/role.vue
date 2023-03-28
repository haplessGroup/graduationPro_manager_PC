<template>
        <vxe-grid ref="xGrid" v-bind="gridOptions" v-on="gridEvents">
          <template #account_item="{ data }">
            <vxe-input v-model="data.account" type="text" placeholder="请输入账号"></vxe-input>
          </template>
          <template #status_item="{ data }">
            <vxe-select v-model="data.status" transfer>
              <vxe-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label">
              </vxe-option>
            </vxe-select>
          </template>
          <template #operate_item>
            <vxe-button type="submit" status="primary" content="查询" @click="searchUser()"></vxe-button>
            <vxe-button type="reset" content="重置" @click="findList()"></vxe-button>
          </template>
          <template #pager>
            <vxe-pager :layouts="['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total']"
              v-model:current-page="tablePage.currentPage" v-model:page-size="tablePage.pageSize" :total="tablePage.total"
              @page-change="handlePageChange">
            </vxe-pager>
          </template>
          <template #operate="{ row }">
            <vxe-button type="text" status="primary" content="去处理" @click="open(row)"></vxe-button>
          </template>
        </vxe-grid>
        <vxe-modal v-model="dialog" title="处理留言" width="800" min-width="600" min-height="300" :esc-closable="true" resize
          destroy-on-close>
          <template #default>
            <vxe-form :data="userinfo" title-align="right" title-width="100">
              <vxe-form-item title="基础信息" title-align="left" :title-width="200" :span="24"
                :title-prefix="{ icon: 'vxe-icon-comment' }"></vxe-form-item>

              <vxe-form-item field="id" title="ID" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.id" :disabled="true"></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="acc" title="用户账号" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.acc" :disabled="true"></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="nic" title="用户昵称" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.nic" :disabled="true"></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="qq" title="用户QQ" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.qq" :disabled="true"></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="adv" title="用户建议" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.adv" :disabled="true"></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="rat" title="用户评分" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-input v-model="data.rat" :disabled="true"></vxe-input>
                </template>
              </vxe-form-item>
              <vxe-form-item field="statu" title="建议状态" :span="12" :item-render="{}">
                <template #default="{ data }">
                  <vxe-radio-group v-model="data.statu">
                    <vxe-radio label="待处理" content="待处理"></vxe-radio>
                    <vxe-radio label="已处理" content="已处理"></vxe-radio>
                  </vxe-radio-group>
                </template>
              </vxe-form-item>
              <vxe-form-item field="re" title="管理回复" :span="24" :item-render="{}"
                :title-suffix="{ message: '填写回复用户信息', icon: 'vxe-icon-question-circle-fill' }">
                <template #default="{ data }">
                  <vxe-textarea v-model="data.re" :autosize="{ minRows: 2, maxRows: 4 }"></vxe-textarea>
                </template>
              </vxe-form-item>
              <vxe-form-item align="center" title-align="left" :span="24">
                <template #default>
                  <vxe-button type="submit" @click="onSubmit">提交</vxe-button>
                </template>
              </vxe-form-item>
            </vxe-form>
          </template>
        </vxe-modal>
        <!-- 抽屉效果 -->
</template>
<script lang="ts" setup>
import { ForAccount, ForAllAdvice, updatedAdvice } from '@/services/api/user';
import axios from 'axios';
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { VxeGridInstance, VxeGridListeners, VxeGridProps, VxePagerEvents } from 'vxe-table';
const search = ref('')
const tableData = ref([])
let loading = ref(false)

const xGrid = ref<VxeGridInstance>()
const dialog = ref(false)
const userinfo = reactive({
  id: "",
  acc: "",
  nic: "",
  qq: "",
  ema: "",
  cate: "",
  adv: "",
  rat: "",
  statu: "",
  re: ""
})
const searchUser = async () => {
  const result = await ForAccount({ key: gridOptions.formConfig?.data.account, skip: tablePage.pageSize, page: tablePage.currentPage, flag: 1 })
  gridOptions.data = result.data.pagination
  gridOptions.loading = false; tablePage.total = result.data.jynum

}
const socket = ref(null)
// 调教筛选：建议处理状态

const options = reactive([
  {
    value: '0',
    label: '待处理',
  },
  {
    value: '1',
    label: '已处理',
  }
])

const tablePage = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10
})
const gridOptions = reactive<VxeGridProps>({
  border: true,
  showOverflow: true,
  loading: false,
  height: 800,
  exportConfig: {},
  columnConfig: {
    resizable: true
  },
  id: 'full_edit_1',
  rowConfig: {
    keyField: 'id',
    isHover: true
  },
  formConfig: {
    data: {
      account: '',
      status: ''
    },
    items: [
      { field: 'account', title: '账号', slots: { default: 'account_item' } },
      { field: 'status', title: '状态', titlePrefix: { message: '帮助信息！！！', icon: 'vxe-icon-question-circle-fill' }, slots: { default: 'status_item' } },
      { slots: { default: 'operate_item' } }
    ]
  },
  toolbarConfig: {
    export: true,
    custom: true,
    buttons: [
      { code: 'add', name: '新增' },
      { code: 'delete', name: '直接删除' },
      { code: 'mark_cancel', name: '删除/取消' },
      { code: 'save', name: 'app.body.button.save', status: 'success' }
    ],
  },
  columns: [

    { type: 'checkbox', title: 'ID', width: 120 },
    { field: 'account', title: '角色名称' },
    { field: 'nickname', title: '权限字符' },
    { field: 'qnumber', title: '显示顺序' },
    { field: 'email', title: '状态' },
    { field: 'category', title: '创建时间' },
    { title: '操作', slots: { default: 'operate' } }
  ],
  data: [],
  checkboxConfig: {
    labelField: 'id',
    reserve: true,
    highlight: true,
    range: true
  },
})

const findList = () => {
  gridOptions.loading = true
  ForAllAdvice({ skip: tablePage.pageSize, page: tablePage.currentPage }).then(res => {
    gridOptions.data = res.data.pagination; gridOptions.loading = false; tablePage.total = res.data.jynum
  })

}
const handlePageChange: VxePagerEvents.PageChange = ({ currentPage, pageSize }) => {
  tablePage.currentPage = currentPage
  tablePage.pageSize = pageSize
  findList()
}
const gridEvents: VxeGridListeners = {
  formSubmit() {
    searchUser()
  },
  toolbarButtonClick({ code }) {
    const $grid = xGrid.value
    switch (code) {
      case 'add': {
        $grid?.insert({ name: 'xxx' })
        console.log(121212);
        break;

      }
      case 'delete': {

      }
    }
  },
  cellDblclick({ row }) {
    open(row)
  }
}

findList()

const sexList1 = ref<any[]>([])

// 异步更新下拉选项
setTimeout(() => {
  sexList1.value = [
    { value: '1', label: '男' },
    { value: '0', label: '女' }
  ]
}, 200)


// 搜索建议
const searchAdvice = () => {
  if (search.value == '') {
    ElMessage({
      message: '搜索的账号不能为空!',
      type: 'error',
      showClose: true
    })
  } else {
    loading.value = true
    axios({
      url: "http://127.0.0.1:5310/serarchadvice",
      method: "POST",
      data: { "account": search }
    }).then(res => {
      loading.value = false
      if (res.data == "no result") {
        ElMessage({
          message: '没有找到账号' + search + "的建议~",
          type: "warning",
          showClose: true
        })
      } else if (res.data == "ERROR") {
        ElMessage({
          message: '后台出现错误~',
          type: "error",
          showClose: true
        })
      } else {
        tableData.value = res.data
      }
    })
  }
}

const open = (data: { id: string; account: string; nickname: string; qnumber: string; email: string; category: string; advice: string; rate: string; status: string; re: string; }) => {
  dialog.value = true

  userinfo.id = data.id
  userinfo.acc = data.account
  userinfo.nic = data.nickname
  userinfo.qq = data.qnumber
  userinfo.ema = data.email
  userinfo.cate = data.category
  userinfo.adv = data.advice
  userinfo.rat = data.rate
  userinfo.statu = data.status
  userinfo.re = data.re

}
const onSubmit = () => {
  var user = userinfo
  if (user.re == '') {
    ElMessage({
      message: '请输入回复消息!',
      type: "error",
      showClose: true
    })
  } else if (user.statu == '待处理') {
    ElMessage({
      message: '请将状态改为已处理~',
      type: "warning",
      showClose: true
    })
  } else {
    updatedAdvice({ statu: user.statu, re: user.re, id: user.id, account: user.acc }).then((res: any
    ) => {
      console.log(res.msg === 'OK');

      // console.log(drawerloading)
      if (res.msg === 'OK') {
        ElMessage({
          message: '提交成功!',
          type: "success",
          showClose: true
        })
        dialog.value = false
      } else if (res.msg == "failed") {
        ElMessage({
          message: '提交失败!',
          type: "error",
          showClose: true
        })
      } else {
        ElMessage({
          message: '系统出现错误!',
          type: "error",
          showClose: true
        })
      }
    })
  }
  findList()
}


</script>

<style>
.box-card {
  width: 100%;
  overflow-y: auto;
  margin-top: 10px;
}

.input-with-select .el-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>
