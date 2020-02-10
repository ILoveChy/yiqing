import React, { Component } from 'react';
import { getNcovData, getNcovOtherData } from './services/nCovApi';
import './App.css';
import { Typography, Statistic, Card, Row, Col, List, Tabs, Icon, Table } from 'antd';
import G2 from '@antv/g2';

const { Title } = Typography;
const { TabPane } = Tabs;
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
export default class App extends Component {
  state = {
    data: {},
    otherData: {},
    current: 1,
  };
  componentDidMount() {
    getNcovData().then(res => {
      this.setState({
        data: { ...this.state.data, ...res },
      });
    });
    getNcovOtherData().then(res => {
      this.setState({
        otherData: { ...this.state.otherData, ...res },
      });
      this.g2Render();
    });
  }
  expandedRowRender = (record, index) => {
    const columns = [
      { title: '城市', dataIndex: 'cityName', key: 'cityName' },
      { title: '累计确诊', dataIndex: 'confirmedCount', key: 'confirmedCount' },
      { title: '累计治愈', dataIndex: 'curedCount', key: 'curedCount' },
      { title: '累计死亡', dataIndex: 'deadCount', key: 'deadCount' },
    ];
    index = parseInt(this.state.current - 1) * 10 + index;
    const data = this.state.otherData.area[index].cities ? this.state.otherData.area[index].cities : null;
    return <Table key={record.locationId} columns={columns} dataSource={data} pagination={false} />;
  };
  handleChange = pagination => {
    this.setState({
      current: pagination.current,
    });
  };
  g2Render = () => {
    const chart = new G2.Chart({
      container: 'c1',
      width: 600,
      forceFit: true,
      height: 600,
    });

    const c1Data = this.state.otherData.history;

    chart.source(c1Data, {
      confirmedNum: {
        min: 0,
        tickInterval: 50000,
        alias: '累计确诊',
      },
      curesNum: {
        min: 0,
        tickInterval: 5000,
        alias: '累计治愈',
      },
      deathsNum: {
        min: 0,
        tickInterval: 5000,
        alias: '累计死亡',
      },
    });
    chart.axis('confirmedNum', {
      title: {
        textStyle: {
          fontSize: 12, // 文本大小
          textAlign: 'center', // 文本对齐方式
          fill: '#999', // 文本颜色
          // ...
        },
      },
      label: {
        formatter: val => {
          return val; // 格式化坐标轴显示
        },
        textStyle: {
          fill: '#95ceff',
        },
      },
      line: {
        lineWidth: 2, // 设置线的宽度
        stroke: '#95ceff', // 设置线的颜色
      },
      tickLine: null,
    });
    // 右侧第一个 Y 轴，即温度轴
    chart.axis('curesNum', {
      line: {
        lineWidth: 2, // 设置线的宽度
        stroke: '#10aeb5', // 设置线的颜色
      },
      tickLine: null,

      label: {
        formatter: val => {
          return val; // 格式化坐标轴显示
        },
        textStyle: {
          fill: '#10aeb5',
          fontSize: 12,
          textAlign: 'end',
          textBaseline: 'bottom',
        },
      },
    });
    // 右侧第二个 Y 轴，即海平面气压轴
    chart.axis('deathsNum', {
      line: null,
      tickLine: null,
      label: {
        formatter: val => {
          return val; // 格式化坐标轴显示
        },
        offset: -1,
        textStyle: {
          fill: '#333',
        },
      },
    });

    chart.tooltip({
      crosshairs: {
        type: 'line',
      },
    });
    chart.scale('confirmedNum', {
      tickCount: 10,
      alias: '累计确诊',
    });
    chart.scale('date', {
      range: [0.1, 0.9],
    });
    chart
      .line()
      .size(2)
      .position('date*confirmedNum')
      .color('#95ceff'); // 确诊

    chart
      .line()
      .position('date*curesNum')
      .color('#10aeb5')
      .size(2)
      .shape('smooth'); // 治愈
    chart
      .line()
      .position('date*deathsNum')
      .shape('smooth')
      .size(2)
      .color('#4d5054'); //死亡
    chart
      .point()
      .position('date*confirmedNum')
      .size(3)
      .shape('circle')
      // .label('confirmedNum')
      .style({
        stroke: '#95ceff',
        lineWidth: 1,
      });
    chart
      .point()
      .position('date*curesNum')
      .size(3)
      .shape('circle')
      .style({
        stroke: '#10aeb5',
        lineWidth: 1,
      });
    chart
      .point()
      .position('date*deathsNum')
      .size(3)
      .shape('circle')
      .style({
        stroke: '#4d5054',
        lineWidth: 1,
      });

    chart.render();
  };
  render() {
    const columns = [
      {
        title: '地区',
        dataIndex: 'provinceShortName',
        key: 'provinceShortName',
      },
      {
        title: '累计确诊',
        dataIndex: 'confirmedCount',
        key: 'confirmedCount',
      },
      {
        title: '累计治愈',
        dataIndex: 'curedCount',
        key: 'curedCount',
      },
      {
        title: '累计死亡',
        dataIndex: 'deadCount',
        key: 'deadCount',
      },
    ];
    return (
      <>
        <div id='c1'></div>
        <Row className='container'>
          <Title>实时疫情</Title>
          <h5>疫情介绍--新型冠状病毒 2019-nCoV</h5>

          <div className='info'>
            <div className='png'>
              {this.state.data.desc ? <img width='100%' src={`${this.state.data.desc.imgUrl}`} alt='实时疫情图' /> : ''}
            </div>
            <div className='desc'>
              {this.state.data.desc ? (
                <>
                  <Row type='flex' justify='space-around' align='middle' className='statisticCard' gutter={16}>
                    <Col className='statisticItem' span={6}>
                      <Card>
                        <Statistic
                          title='全国累计确诊'
                          value={this.state.data.desc.confirmedCount}
                          valueStyle={{ color: '#e83132' }}
                          suffix='人'
                        />
                      </Card>
                    </Col>
                    <Col className='statisticItem' span={6}>
                      <Card>
                        <Statistic
                          title='全国累计疑似'
                          value={this.state.data.desc.suspectedCount}
                          valueStyle={{ color: '#ec9217' }}
                          suffix='人'
                        />
                      </Card>
                    </Col>
                    <Col className='statisticItem' span={6}>
                      <Card>
                        <Statistic
                          title='全国累计治愈'
                          value={this.state.data.desc.curedCount}
                          valueStyle={{ color: '#10aeb5' }}
                          suffix='人'
                        />
                      </Card>
                    </Col>
                    <Col className='statisticItem' span={6}>
                      <Card>
                        <Statistic
                          title='全国累计死亡'
                          value={this.state.data.desc.deadCount}
                          valueStyle={{ color: '#4d5054' }}
                          suffix='人'
                        />
                      </Card>
                    </Col>
                    <Col className='statisticItem' span={6}>
                      <Card>
                        <Statistic
                          title='昨日新增确诊'
                          prefix={<Icon type='arrow-up' />}
                          value={this.state.data.desc.confirmedIncr}
                          valueStyle={{ color: '#e83132' }}
                          suffix='人'
                        />
                      </Card>
                    </Col>
                    <Col className='statisticItem' span={6}>
                      <Card>
                        <Statistic
                          title='昨日新增疑似'
                          prefix={<Icon type='arrow-up' />}
                          value={this.state.data.desc.suspectedIncr}
                          valueStyle={{ color: '#ec9217' }}
                          suffix='人'
                        />
                      </Card>
                    </Col>
                    <Col className='statisticItem' span={6}>
                      <Card>
                        <Statistic
                          title='昨日新增治愈'
                          prefix={<Icon type='arrow-up' />}
                          value={this.state.data.desc.curedIncr}
                          valueStyle={{ color: '#10aeb5' }}
                          suffix='人'
                        />
                      </Card>
                    </Col>
                    <Col className='statisticItem' span={6}>
                      <Card>
                        <Statistic
                          title='昨日新增死亡'
                          prefix={<Icon type='arrow-up' />}
                          value={this.state.data.desc.deadIncr}
                          valueStyle={{ color: '#4d5054' }}
                          suffix='人'
                        />
                      </Card>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col>
                      <Title level={4}>{this.state.data.desc.remark1}</Title>
                    </Col>
                    <Col>
                      <Title level={4}>{this.state.data.desc.remark2}</Title>
                    </Col>
                    <Col>
                      <Title level={4}>{this.state.data.desc.remark3}</Title>
                    </Col>
                    <Col>
                      <Title level={4}>{this.state.data.desc.note1}</Title>
                    </Col>
                    <Col>
                      <Title level={4}>{this.state.data.desc.note2}</Title>
                    </Col>
                    <Col>
                      <Title level={4}>{this.state.data.desc.note3}</Title>
                    </Col>
                  </Row>
                </>
              ) : (
                ''
              )}
            </div>
          </div>
          <Tabs size='large' defaultActiveKey='1'>
            <TabPane
              tab={
                <span>
                  <Icon type='table' />
                  疫情统计
                </span>
              }
              key='1'
            >
              <Table
                scroll={{ scrollToFirstRowOnChange: true }}
                rowKey='locationId'
                dataSource={this.state.otherData.area}
                expandedRowRender={this.expandedRowRender}
                columns={columns}
                expandRowByClick
                onChange={this.handleChange}
              />
            </TabPane>
            <TabPane
              tab={
                <span>
                  <Icon type='weibo' />
                  实时新闻
                </span>
              }
              key='2'
            >
              <List
                className='news'
                itemLayout='vertical'
                size='large'
                dataSource={this.state.data.news}
                footer={
                  <div style={{ textAlign: 'end' }}>
                    新闻出自：<b>新浪微博</b>
                  </div>
                }
                renderItem={item => (
                  <List.Item
                    key={item.title}
                    actions={[
                      <IconText type='clock-circle' text={`${item.pubDateStr}`} key='list-vertical-clock-circle' />,
                      <IconText type='like-o' text='156' key='list-vertical-like-o' />,
                      <IconText type='message' text='2' key='list-vertical-message' />,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <a href={item.sourceUrl}>{`${item.provinceName ? item.provinceName : ''}#${item.title}#`}</a>
                      }
                    />
                    {item.summary}
                  </List.Item>
                )}
              />
            </TabPane>
          </Tabs>
        </Row>
      </>
    );
  }
}
