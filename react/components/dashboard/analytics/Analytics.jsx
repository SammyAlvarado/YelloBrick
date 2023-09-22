import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import StatRightChart from "./StatRightChart";
import MostViewPages from "./MostViewPages";
import SessionsChart from "./SessionsChart";
import UsersByCountry from "./UsersByCountry";
import OSChart from "./OSChart";
import GoogleAnalyticsService from "services/googleAnalyticsService";
import debug from "sabio-debug";

const Analytics = () => {
  const _logger = debug.extend("Analytics");
  function nFormatter(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + "G";
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  }

  var difference = function (num1, num2) {
    return Math.abs(num1 - num2);
  };

  const [data, setData] = useState({
    todayUsers: "",
    yestUsers: "",
    newUsers: "",
    yestNewUsers: "",
    eventCount: "",
    yestEventCount: "",
    engagementRate: "",
    yestEngagementRate: "",
  });

  const value = {
    startDate: "7daysAgo",
    endDate: "today",
    metrics: [
      {
        name: "totalUsers",
      },
      {
        name: "newUsers",
      },
      {
        name: "eventCount",
      },
      {
        name: "engagementRate",
      },
    ],
    dimensions: [
      {
        name: "date",
      },
    ],
  };

  useEffect(() => {
    GoogleAnalyticsService.analyticsRequest(value)
      .then(analyticsRequestSuccess)
      .catch(analyticsRequestError);
  }, []);

  const analyticsRequestSuccess = (result) => {
    setData((prevState) => {
      let data = { ...prevState };
      data.todayUsers = nFormatter(result.item.rows[0].metricValues[0].value);
      data.yestUsers = nFormatter(result.item.rows[1].metricValues[0].value);
      data.newUsers = nFormatter(result.item.rows[0].metricValues[1].value);
      data.yestNewUsers = nFormatter(result.item.rows[1].metricValues[1].value);
      data.eventCount = nFormatter(result.item.rows[0].metricValues[2].value);
      data.yestEventCount = nFormatter(
        result.item.rows[1].metricValues[2].value
      );
      data.engagementRate = Math.round(
        result.item.rows[0].metricValues[3].value
      );
      data.yestEngagementRate = Math.round(
        result.item.rows[1].metricValues[3].value
      );
      return data;
    });
  };

  const analyticsRequestError = (error) => {
    _logger("Error result", error);
  };

  return (
    <Fragment>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex justify-content-between align-items-center">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-0 h2 fw-bold">Analytics last 7 days</h1>
            </div>
            <div className="d-flex">
              <div className="input-group me-3  ">
                <span className="input-group-text text-muted" id="basic-addon2">
                  <i className="fe fe-calendar"></i>
                </span>
              </div>
              <Link to="#" className="btn btn-primary">
                Setting
              </Link>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xl={3} lg={6} md={12} sm={12}>
          <StatRightChart
            title="USERS"
            value={data.todayUsers}
            summary="Number of sales"
            summaryValue={difference(data.todayUsers, data.yestUsers) + "%"}
            summaryIcon={data.todayUsers < data.yestUsers ? "down" : "up"}
            isSummaryIconShown
            classValue="mb-4"
            chartName="UserChart"
          />
        </Col>
        <Col xl={3} lg={6} md={12} sm={12}>
          <StatRightChart
            title="NEW USERS"
            value={data.newUsers}
            summary="Number of pending"
            summaryValue={difference(data.newUsers, data.yestNewUsers) + "%"}
            summaryIcon={data.newUsers < data.yestNewUsers ? "down" : "up"}
            isSummaryIconShown
            classValue="mb-4"
            chartName="VisitorChart"
          />
        </Col>
        <Col xl={3} lg={6} md={12} sm={12}>
          <StatRightChart
            title="EVENT COUNT"
            value={data.eventCount}
            summary="Students"
            summaryValue={
              difference(data.eventCount, data.yestEventCount) + "%"
            }
            summaryIcon={data.eventCount < data.yestEventCount ? "down" : "up"}
            isSummaryIconShown
            classValue="mb-4"
            chartName="BounceChart"
          />
        </Col>
        <Col xl={3} lg={6} md={12} sm={12}>
          <StatRightChart
            title="Engagement Rate"
            value={data.engagementRate + "%"}
            summary="Instructor"
            summaryValue={
              difference(data.engagementRate, data.yestEngagementRate) + "%"
            }
            summaryIcon={
              data.engagementRate < data.yestEngagementRate ? "down" : "up"
            }
            isSummaryIconShown
            classValue="mb-4"
            chartName="AverageVisitTimeChart"
          />
        </Col>
      </Row>
      <Row>
        <Col xl={12} lg={12} md={8} className="mb-4">
          <SessionsChart />
        </Col>
      </Row>
      <Row>
        <Col xl={4} lg={12} md={12} className="mb-4">
          <OSChart />
        </Col>
        <Col xl={4} lg={12} md={12} className="mb-4">
          <UsersByCountry title="User Demographic" />
        </Col>

        <Col xl={4} lg={12} md={12} className="mb-4">
          <MostViewPages title="Most View Pages" />
        </Col>
      </Row>
    </Fragment>
  );
};

export default Analytics;
