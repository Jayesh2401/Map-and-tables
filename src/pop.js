import { CCol, CRow, CSpinner, CTooltip } from "@coreui/react";
import PropTypes from "prop-types";
import React, { lazy, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { population } from "../../../redux/action";
import { COLOR_BAR, COLOR_DEFAULT } from "../../../utils/constant";
import {
  createOptionsId,
  getCurrentYear,
  listToStr,
  saveAsImage,
} from "../../../utils/helper";
import { payloadDataContext } from "../../InteractiveDashboard";
// import { appInsights } from "../../../azure/appInsights";
import Download from "../../../assets/images/icons/Download.svg";
import Loader from "../../../component/commonComponents/Loader";

const DownloadPopover = lazy(() =>
  import("../../../component/commonComponents/DownloadPopover")
);
const EmptyPayload = lazy(() =>
  import("../../../component/commonComponents/EmptyPayload")
);
const MultipleRangeSlider = lazy(() =>
  import("../../../component/commonComponents/MultipleRangeSlider")
);
const NoDataFound = lazy(() =>
  import("../../../component/commonComponents/NoDataFound")
);
const SingleRangeSlider = lazy(() =>
  import("../../../component/commonComponents/SingleRangeSlider")
);

const COLORS = COLOR_DEFAULT;

export const Population = ({ filters }) => {
  const dispatch = useDispatch();
  const payloadData = useContext(payloadDataContext);
  const loading = useSelector((state) => state?.PopulationChart?.loading);
  const setting_selection = useSelector((state) => state.GetSettingsData.data);

  let settingsYear;
  if (setting_selection?.years) {
    let dYear = setting_selection?.years?.map((yy) => ({
      value: yy.id_year,
      label: yy.year,
      selected: yy.default_favorite,
    }));

    dYear?.filter((itm) => {
      if (itm?.selected) {
        settingsYear = [itm];
      }
    });
  }

  const [openPopover, setPopover] = useState({
    bool: false,
    name: "population",
  });
  const [yearOptions, setYearOptions] = useState([]);
  const [yearRange, setYearRange] = useState([]);
  const [populationChartData, setPopulationChartData] = useState([]);
  const [populationTime, setPopulationTime] = useState([]);
  const [populationChartNoData, setPopulationChartNoData] = useState(false);
  const [populationTimeNoData, setPopulationTimeNoData] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState([]);
  const [firstLoad, setFirstLoad] = useState(true);
  //eslint-disable-next-line
  const [
    loadPopTime,
    // setLoadPopTime
  ] = useState(true);
  //eslint-disable-next-line
  const [
    loadPopulation,
    // setLoadPopulation
  ] = useState(true);
  const [GraphName, setGraphName] = useState("");
  const [minValue, set_minValue] = useState(
    settingsYear ? settingsYear[0].label : getCurrentYear()
  ); // getCurrentYear()
  const [maxValue, set_maxValue] = useState();
  const [loadDefault, setLoadDefault] = useState(false);
  const [rangeValue, setRangeValue] = useState({
    value: settingsYear ? settingsYear[0].label : getCurrentYear(),
    bool: true,
  }); //
  const [isMounted, setMounted] = useState(true);
  const [emptyPayloadFound, setEmptyPayloadFound] = useState(false);

  useEffect(() => {
    return () => {
      setMounted(false);
    };
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    // setRangeValue({ value: settingsYear ? settingsYear[0].label : getCurrentYear(), bool: true });
    // set_minValue(settingsYear ? settingsYear[0].label : getCurrentYear());
  }, [setting_selection]);

  useEffect(() => {
    if (filters !== null) {
      let a = filters?.year.filter((a) => a); // (a.year >= min_year && a.year <= max_year)
      set_maxValue(a[a.length - 1].year);
      setYearRange([a[0].year, a[a.length - 1].year]);
      setYearOptions(createOptionsId(a, "year"));
      setLoadDefault(true);
    }
    //eslint-disable-next-line
  }, [filters]);

  useEffect(() => {
    if (yearOptions.length > 0 && loadDefault) {
      handleDefaultGraph(0);
    }
    //eslint-disable-next-line
  }, [loadDefault, payloadData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!firstLoad) {
        if (loadPopulation) {
          setPopulationChartNoData(false);
          setPopulationChartData([]);
        }
        if (loadPopTime) {
          setPopulationTime([]);
          setPopulationTimeNoData(false);
        }
        if (loadPopulation && loadPopTime) {
          setPopulationChartNoData(false);
          setPopulationChartData([]);
          setPopulationTime([]);
          setPopulationTimeNoData(false);
        }

        dispatch(
          population({
            form: createPayload(payloadData, 0),
            callback: (data) => {
              if (data?.population_snapshot?.length > 0) {
                if (isMounted) {
                  setPopulationChartData(data?.population_snapshot);
                }
              } else if (data?.population_snapshot?.length === 0) {
                setPopulationChartData([]);
                setPopulationChartNoData(true);
              }
              if (data?.population_over_time?.length > 0) {
                let keys = Object.keys(data?.population_over_time[0]);
                let filteredKeys = keys.filter((a) => a !== "year");
                setSelectedCountry(filteredKeys);
                setPopulationTime(data?.population_over_time);
              } else if (data?.population_over_time?.length === 0) {
                setPopulationTime([]);
                setPopulationTimeNoData(true);
              }
            },
          })
        );
      }
    }, 2000);
    return () => clearTimeout(delayDebounceFn);
    //eslint-disable-next-line
  }, [rangeValue, minValue, maxValue]);

  const createPayload = (payloadData, download) => {
    let tempOutlook = payloadData?.outlook.map((data) =>
      data.value ? data.value : data
    );
    let outlook = listToStr(tempOutlook, "id_economic_outlook");
    let geography = listToStr(
      payloadData?.country && payloadData.country.map((itm) => itm.value),
      "id_geography"
    );
    let aggregate = listToStr(
      payloadData?.aggregate?.map((itm) => itm.value),
      "id_aggregate"
    );
    let state = listToStr(
      payloadData?.state?.map((itm) => itm.value),
      "id_geography"
    );
    let city = listToStr(
      payloadData?.city?.map((itm) => itm.value),
      "id_geography"
    );
    let startYear = firstLoad
      ? rangeValue.value
      : minValue
      ? minValue
      : yearRange[0];
    let endYear = firstLoad ? yearRange[1] : maxValue ? maxValue : yearRange[1];

    let payload = {
      year: yearOptions.filter((itm) => itm.label == rangeValue?.value)[0]
        ?.value,
      start_year: yearOptions.filter((itm) => itm.label == startYear)[0]?.value,
      end_year: yearOptions.filter((itm) => itm.label == endYear)[0]?.value,
      economic_outlook: outlook,
      geography: payloadData.national
        ? geography?.replace("id_aggregate=global", "")
        : state?.concat(city),
      strAggregateGlobal: aggregate?.includes("global")
        ? "aggregate_global=Global&"
        : ``,
      download: `download=${download}&`,
      graph_name: GraphName ? `graph_name=${GraphName}` : "",
    };
    if (payloadData.national) {
      payload.strAggregate = aggregate?.replace("aggregate=global", "");
    }
    return payload;
  };

  const checkedNational = () => {
    if (payloadData?.national) {
      return (
        payloadData?.affluent?.length > 0 &&
        payloadData?.outlook?.length > 0 &&
        (payloadData?.country?.length > 0 || payloadData?.aggregate?.length > 0)
      );
    }
    if (!payloadData?.national) {
      return (
        payloadData?.affluent?.length > 0 &&
        payloadData?.outlook?.length > 0 &&
        (payloadData?.state?.length > 0 || payloadData?.city?.length > 0)
      );
    }
  };

  const handleDefaultGraph = (download) => {
    if (checkedNational()) {
      if (download === 0) {
        setPopulationChartNoData(false);
        setPopulationTimeNoData(false);
        setPopulationChartData([]);
        setPopulationTime([]);
      }

      dispatch(
        population({
          form: createPayload(payloadData, download),
          callback: (data) => {
            if (download === 0) {
              if (data?.population_snapshot?.length > 0) {
                setPopulationChartData(data?.population_snapshot);
              } else if (data?.population_snapshot?.length === 0) {
                setPopulationChartData([]);
                setPopulationChartNoData(true);
              }
              if (data?.population_over_time?.length > 0) {
                let keys = Object.keys(data?.population_over_time[0]);
                let filteredKeys = keys.filter((a) => a !== "year");
                setSelectedCountry(filteredKeys);
                setPopulationTime(data?.population_over_time);
              } else if (data?.population_over_time?.length === 0) {
                setPopulationTime([]);
                setPopulationTimeNoData(true);
              }
              setFirstLoad(false);
            }
          },
        })
      );
      setEmptyPayloadFound(false);
    } else {
      setEmptyPayloadFound(true);
    }
  };

  const onEditClick = (name, graphName) => {
    setGraphName(graphName);
    setPopover({ bool: !openPopover.bool, name: name });
  };

  const onCSV = () => {
    handleDefaultGraph(1);
    setPopover({ bool: false, name: openPopover.name });
  };

  const onPNG = async () => {
    setPopover({ bool: false, name: openPopover.name });
    if (GraphName === "population_snapshot") {
      saveAsImage("#population_snapshot", `Population_in_${rangeValue.value}`);
    } else if (GraphName === "population_over_time") {
      saveAsImage(
        "#population_over_time",
        `Population_between_${minValue}_and_${maxValue}`
      );
    }
  };

  const handleInput = (e) => {
    set_minValue(e.minValue);
    set_maxValue(e.maxValue);
  };

  const handleSlider = (e) => {
    setRangeValue({ value: Number(e.min), bool: false });
  };

  const renderChart = () => {
    return emptyPayloadFound ? (
      <EmptyPayload data={payloadData} />
    ) : (
      <CRow className="mx-0 justify-content-start">
        <CCol
          xs="12"
          sm="12"
          md="5"
          lg="5"
          className="white-background me-4 px-0 position-relative"
        >
          {openPopover.name === "population" && openPopover.bool && (
            <DownloadPopover onCSV={onCSV} onPNG={onPNG} />
          )}

          <div
            className="download-btn-background text-center cursor-pointer"
            onClick={() => {
              onEditClick("population", "population_snapshot");
            }}
          >
            <img
              src={Download}
              alt="download-icon"
              className="mt-1 mt-md-2 download-icon"
            />
          </div>

          <div className="content c-white p-4" id="population_snapshot">
            <div className="d-flex flex-wrap">
              <div className="d-flex flex-wrap w-100 me-40 mt-2 mt-sm-2 mt-md-0 justify-content-between">
                <CTooltip
                  content="Total population of selected country or countries in the given year"
                  placement="top"
                >
                  <p className="f-20 f-c-grey me-2 mb-1">
                    {" "}
                    Population in {rangeValue.value}{" "}
                  </p>
                </CTooltip>
              </div>
            </div>

            <div className="mt-4">
              {yearRange?.length > 0 && (
                <SingleRangeSlider
                  min={yearRange[0]}
                  max={yearRange[1]}
                  onChange={handleSlider}
                  value={rangeValue}
                />
              )}
            </div>

            {populationChartData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  layout="vertical"
                  data={populationChartData}
                  margin={{
                    top: 20,
                    right: 10,
                    left: 0,
                    bottom: 20,
                  }}
                >
                  <XAxis
                    type="number"
                    interval={0}
                    textAnchor="end"
                    verticalAnchor="end"
                    tickFormatter={(tick) => {
                      return `${tick / 1000000}M`;
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="locality"
                    axisLine={false}
                    className="chart-label"
                    tick={{ width: "75px" }}
                  />
                  <Tooltip
                    separator=": "
                    formatter={(tick) => {
                      return `${(tick / 1000000).toFixed(0)}M`;
                    }}
                  />
                  <Legend wrapperStyle={{ left: 30 }} />
                  <Bar
                    maxBarSize={100}
                    dataKey="population"
                    name="Population"
                    fill={`${COLOR_BAR}`}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : populationChartNoData === false ? (
              <div className="d-flex justify-content-center mx-auto">
                <CSpinner color="primary" className="my-5" />
              </div>
            ) : (
              <NoDataFound />
            )}
          </div>
        </CCol>

        <CCol className="white-background position-relative px-0 mt-4 mt-xs-4 mt-sm-4 mt-md-0">
          {openPopover.name === "population_overtime" && openPopover.bool && (
            <DownloadPopover onCSV={onCSV} onPNG={onPNG} />
          )}

          <div
            className="download-btn-background text-center cursor-pointer"
            onClick={() => {
              onEditClick("population_overtime", "population_over_time");
            }}
          >
            <img
              src={Download}
              alt="download-icon"
              className="mt-1 mt-md-2 download-icon"
            />
          </div>

          <div className="p-4" id="population_over_time">
            <div className="d-flex flex-wrap">
              <div className="d-flex flex-wrap w-100 me-40 mt-2 mt-sm-2 mt-md-0 justify-content-between">
                <CTooltip
                  content="Growth in population of selected country or countries between the selected years"
                  placement="top"
                >
                  <p className="f-20 f-c-grey me-2 mb-1">
                    {" "}
                    Population between {minValue} and {maxValue}{" "}
                  </p>
                </CTooltip>
              </div>
            </div>

            <div className="mt-4">
              <MultipleRangeSlider
                maxValue={maxValue}
                minValue={minValue}
                yearRange={yearRange}
                handleInput={handleInput}
              />
            </div>

            {populationTime?.length > 0 ? (
              <ResponsiveContainer width={"100%"} height={400}>
                <LineChart
                  data={populationTime}
                  margin={{
                    top: 20,
                    right: 10,
                    left: 0,
                    bottom: 20,
                  }}
                >
                  <XAxis
                    dataKey="year"
                    interval={4}
                    textAnchor="end"
                    sclaeToFit={true}
                    verticalAnchor="start"
                  />
                  <YAxis
                    className="chart-label"
                    tickFormatter={(tick) => {
                      return `${tick / 1000000}M`;
                    }}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <ReferenceArea
                    x1={2021}
                    x2={yearRange[1]}
                    stroke="grey"
                    strokeOpacity={0.3}
                  />
                  <Tooltip
                    separator=": "
                    formatter={(tick) => {
                      return `${(tick / 1000000).toFixed(0)}M`;
                    }}
                  />
                  <Legend wrapperStyle={{ left: 30 }} />
                  {selectedCountry.map((entry, index) => (
                    <Line
                      dot={false}
                      strokeWidth={2}
                      key={index}
                      dataKey={entry}
                      name={`${entry
                        ?.replace("Base", "(Base)")
                        ?.replace("Upside", "(Upside)")
                        ?.replace("Downside", "(Downside)")}`}
                      stroke={COLORS[index % COLORS?.length]}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : populationTimeNoData === false ? (
              <div className="d-flex justify-content-center mx-auto">
                <CSpinner color="primary" className="my-5" />
              </div>
            ) : (
              <NoDataFound />
            )}
          </div>
        </CCol>
      </CRow>
    );
  };

  return (
    <div>
      {loading && <Loader />}
      {renderChart()}
    </div>
  );
};

Population.propTypes = {
  filters: PropTypes.object,
};

export default Population;
