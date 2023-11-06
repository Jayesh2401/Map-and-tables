import React, { Fragment, useMemo, useState } from "react";
import allData from "./Check.json";

function OptimisedSegment() {
  const Check = useMemo(() => allData, []);
  const [toggle, SetToggle] = useState(false);
  const Head = ["Premium", "Core", "Core_plus", "Value"];
  const unique = [...new Map(Check.map((m) => [m.year, m])).values()];
  const year = unique.map((e) => e.year);

  // Check.map((e)=>{

  // })

  //   const Group = _.groupby(Check, (e) => e.year);
//   const Group = Check.groupBy((e) => {
//     console.log(e);
//   });
//   console.log(Group);

  // Head.map((test, i) => {
  //   const demo = test;
  //   demo = Check.filter((e) => e.price_segment === demo);
  // });
  const Premium = Check.filter((e) => e.price_segment === "Premium");
  const Core = Check.filter((e) => e.price_segment === "Core");
  const Core_plus = Check.filter((e) => e.price_segment === "Core plus");
  const Value = Check.filter((e) => e.price_segment === "Value");
  console.log(Check);
  const handleChange = (labels, e, year) => {
    const index = labels.findIndex((obj) => obj.year == year);
    labels[index].adjustment = e.target.value;
  };

  return (
    <div className="BoxContainer">
      <h4>Segment-level pricing OPtimizing</h4>
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
            {Premium.map((ele, index) => {
              return (
                <Fragment key={index}>
                  {toggle ? (
                    <td>
                      <input
                        type="number"
                        defaultValue={ele.adjustment}
                        onChange={(e) => handleChange(Premium, e, ele.year)}
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
            {Core_plus.map((ele, index) => {
              return (
                <Fragment key={index}>
                  {toggle ? (
                    <td>
                      <input
                        type="number"
                        defaultValue={ele.adjustment}
                        onChange={(e) => handleChange(Core_plus, e, ele.year)}
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
            {Core.map((ele, index) => {
              return (
                <Fragment key={index}>
                  {toggle ? (
                    <td>
                      <input
                        type="number"
                        defaultValue={ele.adjustment}
                        onChange={(e) => handleChange(Core, e, ele.year)}
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
            {Value.map((ele, index) => {
              return (
                <Fragment key={index}>
                  {toggle ? (
                    <td>
                      <input
                        type="number"
                        defaultValue={ele.adjustment}
                        onChange={(e) => handleChange(Value, e, ele.year)}
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

export default OptimisedSegment;
