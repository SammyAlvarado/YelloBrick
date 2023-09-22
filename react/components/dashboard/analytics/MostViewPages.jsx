import React, { useEffect, useState } from "react";
import googleAnalyticsService from "services/googleAnalyticsService";
import PropTypes from "prop-types";
import { Card, Table } from "react-bootstrap";
import debug from "sabio-debug";
const _logger = debug.extend("MostViewPages");

const MostViewPages = ({ title }) => {
  const [data, setData] = useState({
    pagePathMapped: [],
  });

  const pagePathRequest = {
    startDate: "7daysAgo",
    endDate: "today",
    metrics: [
      {
        name: "totalUsers",
      },
    ],
    dimensions: [
      {
        name: "pagePath",
      },
    ],
  };
  useEffect(() => {
    googleAnalyticsService
      .analyticsRequest(pagePathRequest)
      .then(pagePathRequestSuccess)
      .catch(pagePathRequestError);
  }, []);
  const pagePathRequestSuccess = (result) => {
    let filterTop10Pages = result.item.rows.filter(filterTop10);
    setData((prevState) => {
      let data = { ...prevState };
      data.pagePathMapped = filterTop10Pages.map(resultMapper);
      return data;
    });
  };
  const pagePathRequestError = (error) => {
    _logger("Error page path result", error);
  };
  function resultMapper(item, index) {
    return (
      <tr key={"$" + index}>
        <td className="border-top-0 bg-white">
          <span className="align-middle ">{item.dimensionValues[0].value}</span>
        </td>
        <td className="text-start border-top-0  bg-white">
          {item.metricValues[0].value}
        </td>
      </tr>
    );
  }

  function filterTop10(item, index) {
    if (index <= 5) {
      return item.metricValues;
    }
  }

  return (
    <Card className="h-100">
      <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center bg-primary">
        <h4 className="mb-0">{title}</h4>
      </Card.Header>
      <Card.Body className="p-0 bg-white">
        <div className="table-responsive">
          <Table className="mb-0 text-nowrap">
            <thead className="table-light">
              <tr>
                <th scope="col" className="">
                  Page
                </th>
                <th scope="col" className="text-start ">
                  Count
                </th>
              </tr>
            </thead>
            <tbody>{data.pagePathMapped}</tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};
MostViewPages.propTypes = {
  title: PropTypes.string,
};
export default MostViewPages;
