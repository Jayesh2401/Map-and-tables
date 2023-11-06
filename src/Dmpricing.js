import React, { Fragment, useMemo, useState } from "react";
import Check from "./Check.json";

function Dmpricing() {
  const [d, sd] = useState(Check);
  const [toggle, SetToggle] = useState(false);
  const unique = [...new Map(Check.map((m) => [m.year, m])).values()];
  const year = unique.map((e) => e.year);

  const getData = (key) => Check.filter((e) => e.price_segment === key);

  // const Premium = d.filter((e) => e.price_segment === "Premium");
  // const Core = d.filter((e) => e.price_segment === "Core");
  // const Core_plus = d.filter((e) => e.price_segment === "Core plus");
  // console.log(d, "called2");
  // const Value = d.filter((e) => e.price_segment === "Value");

  const handleChange = (labels, e, year) => {
    const index = labels.findIndex((obj) => obj.year == year);
    labels[index].adjustment = e.target.value;
  };

  console.log(Check);

  return (
    <div className="BoxContainer">
      <h4>Segment-level pricing actions</h4>
      {!toggle ? (
        <div
          onClick={() => {
            SetToggle(!toggle);
          }}
          className="editButton"
        >
          Edit
        </div>
      ) : (
        <div
          className="editButton"
          onClick={() => {
            SetToggle(!toggle);
          }}
        >
          Save
        </div>
      )}

      {/* <div onClick={() => SetToggle(!toggle)} className="editButton">
        {!toggle ? "Edit" : "Save"}
      </div> */}

      <table>
        <tbody>
          <tr>
            <th>Adjustment</th>
            {year.map((e, index) => {
              return (
                <Fragment key={index}>
                  <th>{e}</th>
                </Fragment>
              );
            })}
          </tr>
          <tr>
            <td>Premium</td>
            {getData("Premium").map((ele, index) => {
              return (
                <Fragment key={index}>
                  {toggle ? (
                    <td>
                      <input
                        type="number"
                        defaultValue={ele.adjustment}
                        onChange={(e) =>
                          handleChange(getData("Premium"), e, ele.year)
                        }
                      />
                    </td>
                  ) : (
                    <td style={{ width: "50px" }}>{ele.adjustment}%</td>
                  )}
                </Fragment>
              );
            })}
          </tr>
          <tr>
            <td>Core plus</td>
            {getData("Core plus").map((ele, index) => {
              return (
                <Fragment key={index}>
                  {toggle ? (
                    <td>
                      <input
                        defaultValue={ele.adjustment}
                        onChange={(e) =>
                          handleChange(getData("Core_plus"), e, ele.year)
                        }
                      />
                    </td>
                  ) : (
                    <td>{ele.adjustment}%</td>
                  )}
                </Fragment>
              );
            })}
          </tr>
          <tr>
            <td>Core</td>
            {getData("Core").map((ele, index) => {
              return (
                <Fragment key={index}>
                  {toggle ? (
                    <td>
                      <input
                        defaultValue={ele.adjustment}
                        onChange={(e) =>
                          handleChange(getData("Core"), e, ele.year)
                        }
                      />
                    </td>
                  ) : (
                    <td>{ele.adjustment}%</td>
                  )}
                </Fragment>
              );
            })}
          </tr>
          <tr>
            <td>Value</td>
            {getData("Value").map((ele, index) => {
              return (
                <Fragment key={index}>
                  {toggle ? (
                    <td>
                      <input
                        defaultValue={ele.adjustment}
                        onChange={(e) =>
                          handleChange(getData("Value"), e, ele.year)
                        }
                      />
                    </td>
                  ) : (
                    <td>{ele.adjustment}%</td>
                  )}
                </Fragment>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Dmpricing;
