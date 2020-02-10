import React, { Component } from 'react';
import { getNcovData } from './services/nCovApi';
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
  };
  componentDidMount() {
    getNcovData().then(res => {
      this.setState({
        data: { ...this.state.data, ...res },
      });
    });
    this.g2Render();
  }
  g2Render = () => {
    const chart = new G2.Chart({
      container: 'c1',
      width: 600,
      forceFit: true,
      height: 300,
    });
    const c1Data = [
      { year: '2月1日', value: 100 },
      { year: '2月2日', value: 115 },
      { year: '2月3日', value: 120 },
      { year: '2月4日', value: 152 },
      { year: '2月5日', value: 177 },
    ];
    chart.source(c1Data);
    chart.scale('value', {
      min: 0,
    });
    chart.scale('year', {
      range: [0.2, 0.8],
    });
    chart.tooltip({
      crosshairs: {
        type: 'line',
      },
    });
    chart.line().position('year*value');
    chart
      .point()
      .position('year*value')
      .size(4)
      .shape('circle')
      .style({
        stroke: '#f40',
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
        sorter: (a, b) => a.confirmedCount - b.confirmedCount,
      },
      {
        title: '累计治愈',
        dataIndex: 'curedCount',
        key: 'curedCount',
        sorter: (a, b) => a.curedCount - b.curedCount,
      },
      {
        title: '累计死亡',
        dataIndex: 'deadCount',
        key: 'deadCount',
        sorter: (a, b) => a.deadCount - b.deadCount,
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
                rowKey='id'
                dataSource={this.state.data.case}
                columns={columns}
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
                    <List.Item.Meta title={<a href={item.sourceUrl}>{`${item.provinceName}#${item.title}#`}</a>} />
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
