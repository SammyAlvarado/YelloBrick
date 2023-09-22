import React, { useState } from "react";
import { Card } from "react-bootstrap";
import expensesSchema from "schemas/expensesSchema";
import { Formik, Form, Field, FieldArray } from "formik";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import expenseService from "services/expenseService";
import toastr from "toastr";

const _logger = debug.extend("ExpenseForm");

function ExpenseForm(props) {
  const [clientExpense, setClientExpense] = useState({
    expenseTypes: props.expenseItem.expenseTypes,
    expenseTypeValue: [{ value: "" }],
  });

  const handleModal = () => {
    setClientExpense((prevState) => {
      const newVal = { ...prevState };
      newVal.expenseTypeValue.push("");
      return newVal;
    });
  };

  function propMapper(item, index) {
    return (
      <FieldArray key={index}>
        <div className="row form-group mb-3 align-items-center">
          <label className="col-sm-4 align-items-center">
            <h5>{item.name}</h5>
          </label>

          <div className="col-sm-8 mb-2">
            <Field
              type="text"
              className="col-sm-12 p-2 text-end"
              name={`item.${index}.value`}
              placeholder="$10.00"
            />
          </div>
        </div>
      </FieldArray>
    );
  }
  const submitForm = (values) => {
    _logger("Initial expense form created");
    expenseService
      .addaddExpense(values)
      .then(onAddExpenseSuccess)
      .catch(onAddExpenseError);
  };

  function onAddExpenseSuccess(response) {
    _logger("Response", response);
    toastr.success("Your Report was created");
  }

  function onAddExpenseError(error) {
    _logger("Error", error);
    toastr.error("Failed to create report please try again later");
  }

  _logger(propMapper);
  return (
    <Card className="h-100">
      <Card.Header className="align-items-center card-header-height d-flex justify-content-between align-items-center bg-primary">
        <h4 className="mb-0">{props.expenseItem.name} </h4>
      </Card.Header>
      <Card.Body className="bg-white">
        <Formik
          enableReinitialize={true}
          initialValues={clientExpense.expenseTypes}
          validationSchema={expensesSchema}
          onSubmit={submitForm}
        >
          {({ values }) => (
            <Form>
              {_logger("this is my value", values)}
              {values.map(propMapper)}

              <div className="row">
                <div className="col-sm-4 align-items-center">
                  <h5>
                    <label>Total</label>
                  </h5>
                </div>
                <div className="col-sm-8 mb-2">
                  <label className="col-sm-4 align-items-center text-right">
                    <h5>$0</h5>
                  </label>
                </div>
              </div>
              <button
                onClick={handleModal}
                type="submit"
                className="btn btn-primary btn-sm mt-1"
              >
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </Card>
  );
}

ExpenseForm.propTypes = {
  expenseItem: PropTypes.shape({
    name: PropTypes.string.isRequired,
    expenseTypes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default ExpenseForm;
