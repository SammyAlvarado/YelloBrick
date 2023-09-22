import React, { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router";
import ExpenseForm from "./ExpenseForm";
import Nav from "react-bootstrap/Nav";
import toastr from "toastr";
import debug from "sabio-debug";

import expenseService from "services/expenseService";
const _logger = debug.extend("ClientExpenses");

function ClientExpenses() {
  const [expense, setExpenseCategory] = useState({
    show: false,
    expenseData: [],
    expenseCategory: [],
    expenseComponent: [],
  });

  const { id } = useParams();
  _logger("id", id);

  _logger(setExpenseCategory);
  useEffect(() => {
    expenseService
      .getExpenseCategoryWithExpenseType()
      .then(onExpenseCategorySuccess)
      .catch(onExpeneCategoryError);
  }, []);

  const onExpenseCategorySuccess = (response) => {
    setExpenseCategory((prevState) => {
      let data = { ...prevState };
      data.expenseData = response.items;
      data.expenseCategory = response.items.map(mappedResponse);

      return data;
    });
  };

  const onExpeneCategoryError = (err) => {
    _logger(err);
    toastr.error("Form failed to load. Please try again later.");
  };

  const handleFormBuilder = (e) => {
    var targetName = e.target.name;

    setExpenseCategory((prevState) => {
      let filteredForms = prevState.expenseData.filter(filterForms);
      let formData = { ...prevState };
      formData.show = true;
      formData.expenseComponent = filteredForms.map(mappedComponent);
      return formData;
    });

    function filterForms(category) {
      var result = false;

      if (category.name === targetName) {
        result = true;
      }
      return result;
    }
  };

  const mappedResponse = (item) => {
    return (
      <Nav.Item key={item.id}>
        <Nav.Link onClick={handleFormBuilder} data-set={item} name={item.name}>
          {item.name}
        </Nav.Link>
      </Nav.Item>
    );
  };
  const mappedComponent = (item) => {
    _logger("item", item);
    return <ExpenseForm expenseItem={item} key={item.id} />;
  };

  return (
    <Fragment>
      <div className="col-12">
        <Nav variant="tabs">{expense.expenseCategory}</Nav>
        {expense.show && expense.expenseComponent}
      </div>
    </Fragment>
  );
}
export default ClientExpenses;
