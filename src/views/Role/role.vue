<template>
      <vxe-grid ref="xGrid" v-bind="gridOptions" v-on="gridEvents">
        <template #account_item="{ data }">
          <vxe-input v-model="data.identity" type="text" placeholder="请输入角色名"></vxe-input>
        </template>
        <template #status_item="{ data }">
          <vxe-select v-model="data.status" transfer>
            <vxe-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label">
            </vxe-option>
          </vxe-select>
        </template>
        <template #operate_item>
          <vxe-button type="submit" status="primary" content="查询" @click="searchRole()"></vxe-button>
          <vxe-button type="reset" content="重置" @click="findList()"></vxe-button>
        </template>
        <!-- <template #rount_list="{ data }">

    </template> -->
        <template #pager>
          <vxe-pager :layouts="['Sizes', 'PrevJump', 'PrevPage', 'Number', 'NextPage', 'NextJump', 'FullJump', 'Total']"
            v-model:current-page="tablePage.currentPage" v-model:page-size="tablePage.pageSize" :total="tablePage.total"
            @page-change="handlePageChange">
          </vxe-pager>
        </template>
        <template #status_edit="{ row }">
          <span>{{ row.status === 0 ? '禁用' : '启用' }}</span>
        </template>
        <template #operate="{ row }">
          <vxe-button type="text" status="primary" content="编辑" @click="open(row)"></vxe-button>
          <vxe-button type="text" status="primary" content="删除" @click="deleteRoleInfo(row)"></vxe-button>
        </template>
      </vxe-grid>
      <vxe-modal v-model="dialog" :title="title" width="800" min-width="600" min-height="300" :esc-closable="true" resize
        destroy-on-close>
        <template #default>
          <vxe-form :data="userinfo" title-align="right" title-width="100">
            <vxe-form-item title="基础信息" title-align="left" :title-width="200" :span="24"
              :title-prefix="{ icon: 'vxe-icon-comment' }"></vxe-form-item>
            <vxe-form-item field="role_id" title="权限字符" :span="12" :item-render="{}">
              <template #default="{ data }">
                <vxe-input v-model="data.role_id"></vxe-input>
              </template>
            </vxe-form-item>
            <vxe-form-item field="identity" title="角色名称" :span="12" :item-render="{}">
              <template #default="{ data }">
                <vxe-input v-model="data.identity"></vxe-input>
              </template>
            </vxe-form-item>
            <vxe-form-item field="status" title="状态" :span="12" :item-render="{}">
              <template #default="{ data }">
                <vxe-select v-model="data.status" transfer>
                  <vxe-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label">
                  </vxe-option>
                </vxe-select>
              </template>
            </vxe-form-item>
            <vxe-form-item field="rount_list" title="菜单" :span="12" :item-render="{}">
              <template #default="{ data }">
                <el-tree ref="permList" node-key="id" :data="dataList" show-checkbox :default-expanded-keys="[2, 3]"
                  :props="defaultProps" />
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
import { createRole, deleteRole, getRole, updateRole } from '@/services/api/role';
import { ElMessage } from 'element-plus';
import { nextTick, reactive, ref } from 'vue';
import { VXETable, VxeColumnPropTypes, VxeGridInstance, VxeGridListeners, VxeGridProps, VxePagerEvents } from 'vxe-table';
import XEUtils from 'xe-utils';

const title = ref('新增角色')
const xGrid = ref<VxeGridInstance>()
const dialog = ref(false)
let userinfo = reactive<any>({
  role_id: undefined,
  identity: undefined,
  status: '',
  create_time: undefined,
})
const permList = ref<any>(null)
const searchRole = async () => {
  const result = await getRole({ ...gridOptions.formConfig?.data, skip: tablePage.pageSize, page: tablePage.currentPage, })
  gridOptions.data = result.data.pagination
  gridOptions.loading = false; tablePage.total = result.data.jynum

}
const socket = ref(null)
// 调教筛选：建议处理状态

const options = reactive([
  {
    value: 0,
    label: '禁用',
  },
  {
    value: 1,
    label: '启用',
  }
])
const dataList = [

  {
    id: 2, label: '角色管理'
  },
  {
    id: 3, label: '建议处理'
  }, {
    id: 4, label: '账号信息处理', children: [
      {
        id: 5, label: '账号处理'
      }, {
        id: 6, label: '注册处理'
      },
    ]
  }, {
    id: 7, label: '用户留言处理', children: [
      {
        id: 8, label: '电影留言'
      }, {
        id: 9, label: '语言留言'
      }, {
        id: 10, label: '城市留言'
      },
    ]
  },
]

const tablePage = reactive({
  total: 0,
  currentPage: 1,
  pageSize: 10
})

const formatTime: VxeColumnPropTypes.Formatter = ({ cellValue }) => {
  return XEUtils.toDateString(cellValue, 'yyyy-MM-dd HH:ss:mm')
}

const gridOptions = reactive<VxeGridProps>({
  border: true,
  showOverflow: true,
  loading: false,
  height: 800,
  exportConfig: {},
  columnConfig: {
    resizable: true
  },
  editConfig: {
    trigger: 'click',
    mode: 'cell',
    showStatus: true
  },
  id: 'full_edit_1',
  rowConfig: {
    keyField: 'id',
    isHover: true
  },
  keepSource: true,
  formConfig: {
    data: {
      identity: '',
      status: '',
    },
    items: [
      { field: 'identity', title: '角色名', slots: { default: 'account_item' } },
      { field: 'status', title: '状态', titlePrefix: { message: '帮助信息！！！', icon: 'vxe-icon-question-circle-fill' }, slots: { default: 'status_item' } },
      { slots: { default: 'operate_item' } }
    ]
  },
  toolbarConfig: {
    export: true,
    custom: true,
    buttons: [
      { code: 'add', name: '新增' },
    ],
  },
  columns: [

    { field: 'id', title: 'ID', width: 120, },
    { field: 'role_id', title: '权限字符', },
    { field: 'identity', title: '角色名称' },
    { field: 'status', title: '状态', slots: { default: 'status_edit' } },
    { field: 'rount_list', title: '菜单信息' },
    { field: 'create_time', title: '创建时间', formatter: formatTime },
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
const reset = () => {
  userinfo.role_id = '',
    userinfo.identity = '',
    userinfo.status = '',
    userinfo.create_time = ''
}
const findList = () => {
  gridOptions.loading = true
  getRole({ skip: tablePage.pageSize, page: tablePage.currentPage }).then(res => {
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
    searchRole()
  },
  toolbarButtonClick({ code }) {
    const $grid = xGrid.value
    switch (code) {
      case 'add': {
        open('')
        break;

      }
      case 'delete': {

      }
    }
  },
  cellDblclick({ row }) {
    open(row)
  }
  // cellDblclick({ row }) {
  //   open(row)
  // }
}

findList()



const defaultProps = {
  children: 'children',
  label: 'label',
}

const open = (data: any) => {
  dialog.value = true
  if (data.id) {
    title.value = '编辑角色'
    nextTick(() => {
      permList.value!.setCheckedKeys(JSON.parse(data.rount_list))
    })
    userinfo.id = data.id
    userinfo.role_id = data.role_id
    userinfo.identity = data.identity,
      userinfo.status = data.status,
      userinfo.create_time = data.create_time
  } else {
    reset()
    title.value = '新增角色'
  }
}
const getMenuAllCheckedKeys = () => {
  let checkedKeys = permList.value!.getCheckedKeys()
  let halfCheckedKeys = permList.value!.getHalfCheckedKeys();
  checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
  return checkedKeys

}
const onSubmit = async () => {

  const rount = getMenuAllCheckedKeys()

  const query = { ...userinfo, rount_list: rount.toString() }

  if (userinfo.id) {
    const { msg } = await updateRole(query)
    if (msg == 'OK') {
      ElMessage({
        message: "编辑成功!",
        type: 'success',
        showClose: true
      })
    }
  } else {
    const { msg } = await createRole(query)
    if (msg == 'OK') {
      ElMessage({
        message: "新增成功!",
        type: 'success',
        showClose: true
      })
    }
  }
  dialog.value = false
  findList()
}
const deleteRoleInfo = async (row) => {
  const type = await VXETable.modal.confirm('您确定要删除该数据?')
  if (type === 'confirm') {
    const { msg } = await await deleteRole({ role_id: row.role_id })
    if (msg == 'OK') {
      ElMessage({
        message: "删除成功!",
        type: 'success',
        showClose: true
      })
    }
    else if (msg == "failed") {
      ElMessage({
        message: "提交失败~",
        type: 'error',
        showClose: true
      })
    } else {
      ElMessage({
        message: "后台出错了~",
        type: 'error',
        showClose: true
      })
    }
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
