// src/mock/messageData.ts
export const mockMessages = {
  notifications: [
    {
      id: 1,
      title: '系统维护通知',
      description: '系统将于本周六凌晨2:00-4:00进行维护升级,请提前做好准备。',
      time: '2023-08-10 09:30:15',
      read: false,
    },
    {
      id: 2,
      title: '新功能上线',
      description: '充电站数据分析功能已上线，欢迎使用并提供宝贵意见。',
      time: '2023-08-09 14:20:45',
      read: true,
    },
    {
      id: 3,
      title: '安全更新提醒',
      description: '系统安全补丁已发布，请尽快更新到最新版本。',
      time: '2023-08-08 11:15:33',
      read: false,
    },
  ],
  messages: [
    {
      id: 1,
      sender: '运维团队',
      avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      content: '您提交的工单#20230811001已处理完成,请查看结果。',
      time: '2023-08-11 10:25:18',
      read: false,
    },
    {
      id: 2,
      sender: '财务部',
      avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      content: '7月份财务报表已生成,请及时查阅。',
      time: '2023-08-10 16:40:22',
      read: true,
    },
    {
      id: 3,
      sender: '市场部',
      avatar: 'https://cube.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6dpng.png',
      content: '下周市场推广计划已制定完成，请审阅并反馈意见。',
      time: '2023-08-09 14:15:30',
      read: true,
    },
  ],
  todos: [
    {
      id: 1,
      title: '月度运营报告',
      description: '完成7月份充电站运营分析报告',
      time: '2023-08-15 18:00:00',
      status: 'pending',
    },
    {
      id: 2,
      title: '设备巡检',
      description: '完成城西区充电桩巡检任务',
      time: '2023-08-12 12:00:00',
      status: 'pending',
    },
    {
      id: 3,
      title: '供应商合同审核',
      description: '审核新充电桩供应商合同条款',
      time: '2023-08-10 10:30:00',
      status: 'completed',
    },
  ],
}
