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
  //holds the interacvtive details like country,aggregrate,regionoutlook
  const loading = useSelector((state) => state?.PopulationChart?.loading);
  //check if data have came in redux or not
  const setting_selection = useSelector((state) => state.GetSettingsData.data);
  // will use year from setting selection

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
  //converted the format of json and made new by selecting the targetted value.

  const [yearOptions, setYearOptions] = useState([]);
  //yearOptions are getting converted with help of helper file

  const [yearRange, setYearRange] = useState([]);
  //lowesr and highest value from filters year we cut from array
  const [populationChartData, setPopulationChartData] = useState([]);
  //selected countryData are shown in this and by API using redux
  const [populationTime, setPopulationTime] = useState([]);
  //otherchart
  const [populationChartNoData, setPopulationChartNoData] = useState(false);
  //dwork as loader until the data don't get fetch
  const [populationTimeNoData, setPopulationTimeNoData] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState([]);
  //both are for other graph
  const [firstLoad, setFirstLoad] = useState(true);
  //the loading state management and handling
  //eslint-disable-next-line
  const [
    loadPopTime,
    // setLoadPopTime
  ] = useState(true);
  //just true event

  //eslint-disable-next-line
  const [
    loadPopulation,
    // setLoadPopulation
  ] = useState(true);
  //just true event

  const [GraphName, setGraphName] = useState("");
  //no idea
  const [minValue, set_minValue] = useState(
    settingsYear ? settingsYear[0].label : getCurrentYear()
  ); // getCurrentYear()
  //current year
  const [maxValue, set_maxValue] = useState();
  //max year from array
  const [loadDefault, setLoadDefault] = useState(false);
  //till year get filter loading is false and managed.
  const [rangeValue, setRangeValue] = useState({
    value: settingsYear ? settingsYear[0].label : getCurrentYear(),
    bool: true,
  }); //
  //current uyear with value as year and boolean maybe as flag and it is used in slider range
  const [isMounted, setMounted] = useState(true);
  //Ui load state and managed
  const [emptyPayloadFound, setEmptyPayloadFound] = useState(false);
  // ternary to manage data came or not.

  useEffect(() => {
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    // setRangeValue({ value: settingsYear ? settingsYear[0].label : getCurrentYear(), bool: true });
    // set_minValue(settingsYear ? settingsYear[0].label : getCurrentYear());
  }, [setting_selection]);

  //filters used for year fetching from prop
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
    //tempOutlook hold label as base which is 1 usually
    let outlook = listToStr(tempOutlook, "id_economic_outlook");
    // maybe will use this outlook in the api part of string
    let geography = listToStr(
      payloadData?.country && payloadData.country.map((itm) => itm.value),
      "id_geography"
    );
    //geography string and even can be multiple in the api

    let aggregate = listToStr(
      payloadData?.aggregate?.map((itm) => itm.value),
      "id_aggregate"
    );
    //aggregrate state or countries code comes here
    let state = listToStr(
      payloadData?.state?.map((itm) => itm.value),
      "id_geography"
    );
    let city = listToStr(
      payloadData?.city?.map((itm) => itm.value),
      "id_geography"
    );

    //state and city both takes the aggregrate as an id and are used.

    let startYear = firstLoad
      ? rangeValue.value
      : minValue
      ? minValue
      : yearRange[0];
    let endYear = firstLoad ? yearRange[1] : maxValue ? maxValue : yearRange[1];
        //start and end year like from 2016 is start then end is 2030 visa versa
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
    //made payload to send in API
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

    //both statement are true , so for what it is used?
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
            //brings data from api 
            if (download === 0) {
              if (data?.population_snapshot?.length > 0) {
                setPopulationChartData(data?.population_snapshot);
                //the result of population we get year wise here.
              } else if (data?.population_snapshot?.length === 0) {
                setPopulationChartData([]);
                setPopulationChartNoData(true);
              }
              if (data?.population_over_time?.length > 0) {
                let keys = Object.keys(data?.population_over_time[0]);
                let filteredKeys = keys.filter((a) => a !== "year");
                setSelectedCountry(filteredKeys);
                //filtered result of selected country
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
      //if data not come then true

      setEmptyPayloadFound(true);
    }
  };

  const handleSlider = (e) => {
    setRangeValue({ value: Number(e.min), bool: false });
  };

  const renderChart = () => {
    return (
      <CRow className="mx-0 justify-content-start">
        <CCol lg="12" className="white-background me-4 px-0 position-relative">
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
