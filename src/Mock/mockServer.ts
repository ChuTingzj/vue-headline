import Mock from 'mockjs'
import reports from './data/reports.json'
Mock.mock('/mock/reports', { code: 200, data: reports })
