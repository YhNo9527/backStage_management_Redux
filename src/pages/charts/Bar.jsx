import React, { useState } from 'react'
import ReactEcharts from 'echarts-for-react'
import { Card,
         Button } from 'antd'

/* 柱状图 */
export default function Bar() {

  const [sales, setSales] = useState([5, 20, 36, 10, 10, 20])
  const [inventories, setInventories] = useState([7, 22, 38, 12, 16, 25])

  // 返回柱状图的配置对象
  const getOption = (sales, inventories) => {
    const option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data:['销量', '库存']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: sales
        },
        {
          name: '库存',
          type: 'bar',
          data: inventories
        }
    ]
  }
  return option
}

// 更新状态数据
const update = () => {
    setSales(sales.map(sale => sale + 1))
    setInventories(inventories.map(inventory => inventory - 1))
}

  return (
    <div>
      <Card>
        <Button type='primary' onClick={update}>更新</Button>
      </Card>
      <Card title='柱状图'>
        <ReactEcharts option={getOption(sales, inventories)}></ReactEcharts>
      </Card>
    </div>
  )
}
