import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Card, Row, Col } from "react-bootstrap";
import ApexCharts from "./ApexCharts";
import GoogleAnalyticsService from "services/googleAnalyticsService";
import debug from "sabio-debug";
const _logger = debug.extend("ShowChart");

import {
  UserChartOptions,
  VisitorChartOptions,
  BounceChartOptions,
  AverageVisitTimeChartOptions,
} from "components/dashboard/analytics/ChartData";

function ShowChart(chartName) {
  const [data, setData] = useState({
    totalUserData: [],
    newUserData: [],
    eventCountData: [],
    engagementRateData: [],
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
  const CurrentUsersData = [
    {
      name: "User",
      data: data.totalUserData,
    },
  ];
  const NewUserData = [
    {
      name: "User",
      data: data.newUserData,
    },
  ];
  const EventCountData = [
    {
      name: "User",
      data: data.eventCountData,
    },
  ];
  const EngagementRateData = [
    {
      name: "User",
      data: data.engagementRateData,
    },
  ];

  useEffect(() => {
    GoogleAnalyticsService.analyticsRequest(value)
      .then(analyticsRequestSuccess)
      .catch(analyticsRequestError);
  }, []);

  function resultMapper(items, index) {
    return items.metricValues[index].value;
  }

  const analyticsRequestSuccess = (result) => {
    let totalUserResults = result.item.rows.map((n) => resultMapper(n, 0));
    let newUserResults = result.item.rows.map((n) => resultMapper(n, 1));
    let newEventCountResults = result.item.rows.map((n) => resultMapper(n, 2));
    let engagementRateDataResults = result.item.rows.map((n) =>
      resultMapper(n, 3)
    );

    setData((prevState) => {
      let data = { ...prevState };
      data.totalUserData = totalUserResults.reverse();
      data.newUserData = newUserResults.reverse();
      data.eventCountData = newEventCountResults.reverse();
      data.engagementRateData = engagementRateDataResults.reverse();
      return data;
    });
  };

  const analyticsRequestError = (error) => {
    _logger("Error result", error);
  };

  switch (chartName) {
    case "UserChart":
      return (
        <ApexCharts
          options={UserChartOptions}
          series={CurrentUsersData}
          height={60}
          type="area"
        />
      );
    case "VisitorChart":
      return (
        <ApexCharts
          options={VisitorChartOptions}
          series={NewUserData}
          height={60}
          type="area"
        />
      );
    case "BounceChart":
      return (
        <ApexCharts
          options={BounceChartOptions}
          series={EventCountData}
          height={60}
          type="line"
        />
      );
    case "AverageVisitTimeChart":
      return (
        <ApexCharts
          options={AverageVisitTimeChartOptions}
          series={EngagementRateData}
          height={60}
          type="area"
        />
      );
    default:
      return chartName + " chart is undefiend";
  }
}

const StatRightChart = (props) => {
  const {
    title,
    value,
    summaryValue,
    summaryIcon,
    isSummaryIconShown,
    classValue,
    chartName,
  } = props;

  return (
    <Card border="light" className={`${classValue}`}>
      <Card.Body className="bg-white">
        <Row>
          <Col md={12} lg={12} xl={12} sm={12}>
            <span className="fw-semi-bold text-uppercase fs-6">{title}</span>
          </Col>
          <Col md={6} lg={6} xl={6} sm={6}>
            <h1 className="fw-bold mt-2 mb-0 h2">{value}</h1>
            <p
              className={`text-${
                summaryIcon === "up" ? "success" : "danger"
              } fw-semi-bold mb-0`}
            >
              {isSummaryIconShown ? (
                <i className={`fe fe-trending-${summaryIcon} me-1`}></i>
              ) : (
                ""
              )}{" "}
              {summaryValue}
            </p>
          </Col>
          <Col
            md={6}
            lg={6}
            xl={6}
            sm={6}
            className="d-flex align-items-center"
          >
            {ShowChart(chartName)}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

StatRightChart.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  summaryValue: PropTypes.string,
  summaryIcon: PropTypes.string,
  isSummaryIconShown: PropTypes.bool,
  classValue: PropTypes.string,
  chartName: PropTypes.string,
};

export default StatRightChart;
