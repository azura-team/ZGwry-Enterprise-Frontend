import service from './customAxios'
let api = {}

//请求接口集合
const interfaces = [
  //获取企业基本信息详情
  {
    fun: 'getZGEnterpriseByid',
    interface: '/ZGEntExtend/GetZGEnterpriseByid',
    type: 'post',
    serviceName: 'serviceApi'
  },
  //获取企业扩展基本信息详情
  {
    fun: 'getZGEnterpriseExtendByid',
    interface: '/ZGEntExtend/GetZGEnterpriseExtendByid',
    type: 'post',
    serviceName: 'serviceApi'
  },
  //获取企业扩展基本信息详情
  {
    fun: 'getZGEnvironmentalProps',
    interface: '/ZGEntExtend/GetZGEnvironmentalProps',
    type: 'post',
    serviceName: 'serviceApi'
  },
  //根据企业Id和类型获取排放口信息列表
  {
    fun: 'getZGOutputList',
    interface: '/ZGEntExtend/GetZGOutputList',
    type: 'post',
    serviceName: 'serviceApi'
  },
  //根据id获取排放口信息
  {
    fun: 'getZGOutputDetail',
    interface: '/ZGEntExtend/GetZGOutputDetail',
    type: 'post',
    serviceName: 'serviceApi'
  },
  //获取监测数据列表
  {
    fun: 'getZGDataList',
    interface: '/ZGEntExtend/GetZGDataList',
    type: 'post',
    serviceName: 'serviceApi'
  },
  // 根据id获取监测数据详情
  {
    fun: 'getZGDataDetail',
    interface: '/ZGEntExtend/GetZGDataDetail',
    type: 'post',
    serviceName: 'serviceApi'
  },
  // 根据企业id和分类获取企业污染治理设施列表
  {
    fun: 'getZGTreatFacilityList',
    interface: '/ZGEntExtend/GetZGTreatFacilityList',
    type: 'post',
    serviceName: 'serviceApi'
  },
  // 根据id获取企业污染治理设施详情
  {
    fun: 'getZGTreatFacilityDetail',
    interface: '/ZGEntExtend/GetZGTreatFacilityDetail',
    type: 'post',
    serviceName: 'serviceApi'
  },
  // 根据id下载附件
  {
    fun: 'downAttachmentFiles',
    interface: '/ZGEntExtend/DownAttachmentFiles',
    type: 'get',
    serviceName: 'serviceApi'
  },
  // 获取许可证 相关文件
  {
    fun: 'getPollpermitsByid',
    interface: '/api/Enterprise/GetPollpermitsByid',
    type: 'get',
    serviceName: 'serviceEnt'
  },
  // 上传文件
  {
    fun: 'uploadEntExtendAttachment',
    interface: '/api/ZGEntExtend/UploadEntExtendAttachment',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 环境属性
  {
    fun: 'updateZGEnviromentalProps',
    interface: '/api/ZGEntExtend/UpdateZGEnviromentalProps',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 环境属性
  {
    fun: 'getZGEnvironmentalProps',
    interface: '/api/ZGEntExtend/GetZGEnvironmentalProps',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 环境属性
  {
    fun: 'getZGTaskList',
    interface: '/api/GBM/GetZGTaskList',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 上传文件  许可证
  {
    fun: 'uploadPollFiles',
    interface: '/api/enterprise/UploadPollFiles',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 上传文件  应急计划
  {
    fun: 'uploadEmergplanFiles',
    interface: '/api/enterprise/UploadEmergplanFiles',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 上传文件  其它有关附件
  {
    fun: 'uploadAttachmentFiles',
    interface: '/api/enterprise/UploadAttachmentFiles',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 上传文件  平面及工艺
  {
    fun: 'uploadEntdrawingFiles',
    interface: '/api/enterprise/UploadEntdrawingFiles',
    type: 'post',
    serviceName: 'serviceEnt'
  },
  // 更新 许可证
  {
    fun: 'updatePollpermits',
    interface: '/api/Enterprise/UpdatePollpermits',
    type: 'post',
    serviceName: 'serviceEnt'
  }
]

interfaces.forEach(method => {
  api[method.fun] = payload => {
    return service[method.serviceName][method.type](method.interface, payload)
  }
})

export default api
