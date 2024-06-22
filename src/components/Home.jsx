
import React, { useState } from "react";
import Papa from "papaparse";
import CSVDataTable from "./Charts/CSVDataTable";
// import
// { BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsFillBellFill}
//  from 'react-icons/bs'


import {
  LineChart,
  ComposedChart,
  PieChart,
  Pie,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  Cell,
  ResponsiveContainer,
} from "recharts";

const TweetCharts = () => {
  const [data, setData] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [fileSelected, setFileSelected] = useState(false);
  const [sentimentCounts, setSentimentCounts] = useState(null);
  const [tweetCounts, setTweetCounts] = useState(null);
  const [columnArray, setColumn] = useState([]);
  const [values, setValues] = useState([]);
  const [frequentWords, setFrequentWords] = useState([]);
  const [posFrequentWords, setPosFrequentWords] = useState([]);
  const [negFrequentWords, setNegFrequentWords] = useState([]);
  const [frequentHash, setFrequentHash] = useState([]);
  const [posFrequentHash, setPosFrequentHash] = useState([]);
  const [negFrequentHash, setNegFrequentHash] = useState([]);

  const handleFileChange = (event) => {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (result) {
        const columnArray = [];
        const valuesArray = [];

        result.data.map((d) => {
          columnArray.push(Object.keys(d));
          valuesArray.push(Object.values(d));
        });

        setData(result.data);
        console.log(result.data);
        console.log(typeof result.data);
        setColumn(columnArray[0]);
        setValues(valuesArray);
        countSentiments(result.data);
        calculateFrequentWords(result.data);
        calculatePosNegFrequentWords(result.data);
        calculatePosNegFrequentHashtags(result.data);
      },
    });
  };

  const countSentiments = (parsedData) => {
    let count0 = 0;
    let count1 = 0;

    parsedData.forEach((item) => {
      const sentiment = item["Sentiments"];
      if (sentiment === "0") {
        count0++;
      } else if (sentiment === "1") {
        count1++;
      }
    });
    const totalCount = count0 + count1;

    const counts = [
      { name: "Positive", count: count0 },
      { name: "Negative", count: count1 },
    ];
    setTweetCounts(totalCount);
    setSentimentCounts(counts);
  };

  const calculateFrequentWords = (parsedData) => {
    const wordMap = {};

    parsedData.forEach((item) => {
      const tweet = item["text"];
      const words = tweet.split(/\s+/);

      words.forEach((cleanedWord) => {
        // const cleanedWord = word.replace(/[^\w\s]/gi, '').toLowerCase();
        if (cleanedWord.length > 0) {
          const count = wordMap[cleanedWord] || 0;
          wordMap[cleanedWord] = count + 1;
        }
      });
    });

    // Convert object to array of key-value pairs and sort
    const sortedWords = Object.entries(wordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    let tempFreqWords = [];
    for (let i = 0; i < sortedWords.length; i++) {
      let temp0 = sortedWords[i][0];
      let temp1 = sortedWords[i][1];
      tempFreqWords.push({ word: temp0, frequency: temp1 });
    }
    console.log(tempFreqWords);
    console.log(typeof tempFreqWords);

    // Set the frequent words state
    setFrequentWords(tempFreqWords);
  };

  const calculatePosNegFrequentWords = (parsedData) => {
    const posWordMap = {};
    const negWordMap = {};

    parsedData.forEach((item) => {
      const tweet = item["text"];
      const words = tweet.split(/\s+/);

      const sentiment = item["Sentiments"];

      if (sentiment === "0") {
        words.forEach((cleanedWord) => {
          if (cleanedWord.length > 0) {
            const count = posWordMap[cleanedWord] || 0;
            posWordMap[cleanedWord] = count + 1;
          }
        });
      } else if (sentiment === "1") {
        words.forEach((cleanedWord) => {
          if (cleanedWord.length > 0) {
            const count = negWordMap[cleanedWord] || 0;
            negWordMap[cleanedWord] = count + 1;
          }
        });
      }
    });

    // For positive tweets
    const posSortedWords = Object.entries(posWordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    let tempPosFreqWords = [];
    for (let i = 0; i < posSortedWords.length; i++) {
      let posTemp0 = posSortedWords[i][0];
      let posTemp1 = posSortedWords[i][1];
      tempPosFreqWords.push({ word: posTemp0, frequency: posTemp1 });
    }
    console.log(tempPosFreqWords);
    console.log(typeof tempPosFreqWords);

    //For Negative Tweets
    const negSortedWords = Object.entries(negWordMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    let tempNegFreqWords = [];
    for (let i = 0; i < negSortedWords.length; i++) {
      let negTemp0 = negSortedWords[i][0];
      let negTemp1 = negSortedWords[i][1];
      tempNegFreqWords.push({ word: negTemp0, frequency: negTemp1 });
    }

    setPosFrequentWords(tempPosFreqWords);
    setNegFrequentWords(tempNegFreqWords);
  };

  // Frequent Hashtags in Positive and Negative tweets

  const calculatePosNegFrequentHashtags = (parsedData) => {
    const posHashMap = {};
    const negHashMap = {};

    parsedData.forEach((item) => {
      const words = [item["hashtags"]];
      // const words = tweet.split(/\s+/);

      const sentiment = item["Sentiments"];

      if (sentiment === "0") {
        words.forEach((cleanedWord) => {
          if (cleanedWord.length > 0) {
            const count = posHashMap[cleanedWord] || 0;
            posHashMap[cleanedWord] = count + 1;
          }
        });
      } else if (sentiment === "1") {
        words.forEach((cleanedWord) => {
          if (cleanedWord.length > 0) {
            const count = negHashMap[cleanedWord] || 0;
            negHashMap[cleanedWord] = count + 1;
          }
        });
      }
    });

    // For positive tweets
    const posSortedHash = Object.entries(posHashMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    let tempPosFreqHash = [];
    for (let i = 0; i < posSortedHash.length; i++) {
      let posTemp0 = posSortedHash[i][0];
      let posTemp1 = posSortedHash[i][1];
      tempPosFreqHash.push({ hash: posTemp0, frequency: posTemp1 });
    }
    console.log(tempPosFreqHash);
    console.log(typeof tempPosFreqHash);

    //For Negative Tweets
    const negSortedHash = Object.entries(negHashMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    let tempNegFreqHash = [];
    for (let i = 0; i < negSortedHash.length; i++) {
      let negTemp0 = negSortedHash[i][0];
      let negTemp1 = negSortedHash[i][1];
      tempNegFreqHash.push({ hash: negTemp0, frequency: negTemp1 });
    }

    setPosFrequentHash(tempPosFreqHash);
    setNegFrequentHash(tempNegFreqHash);
  };

  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "red", "pink"];
  const getPath = (x, y, width, height) => {
    return `M${x},${y + height}C${x + width / 3},${y + height} ${
      x + width / 2
    },${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
      x + width
    }, ${y + height}
  Z`;
  };

  const TriangleBar = (props) => {
    const { fill, x, y, width, height } = props;

    return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
  };

  return (
    <main className="main-container">
      <div className="main-title">
        <h3>DASHBOARD</h3>
      </div>
      <div>
        <input type="file" accept=".csv" onChange={handleFileChange} />

        {!fileSelected && <p>Please select a file.</p>}

        {data.length > 0 && (
          <>
            <div className="main-cards">
              <div className="card">
                <div className="card-inner">
                  {" "}
                  <h1>Total Tweets</h1>
                </div>
                <h1>{tweetCounts}</h1>
              </div>
              <div className="card">
                <div className="card-inner">
                  {" "}
                  <h1>Positive Tweets</h1>
                </div>
                <h1>{sentimentCounts.count}</h1>
              </div>
              <div className="card">
                <div className="card-inner">
                  {" "}
                  <h1>Negative Tweets</h1>
                </div>
                <h1>{sentimentCounts.count}</h1>
              </div>
            </div>

            <div className="charts">
              <div>
                <BarChart
                  width={500}
                  height={300}
                  data={sentimentCounts}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Sentiments" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                  {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
                </BarChart>
              </div>

              <div                >
                <h1>Ratio of Hate and Non-Hate Speech</h1>
                <PieChart width={400} height={400}
                 margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
              }}>
                  <Pie
                    dataKey="count"
                    isAnimationActive={false}
                    data={sentimentCounts}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#82ca9d"
                    label
                  />
                  {/* <Pie dataKey="count" data={sentimentCounts} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" /> */}
                  <Tooltip />
                </PieChart>
              </div>

              <div>
                <h1>Most Frequent Words in entire dataset</h1>
                <BarChart
                  width={500}
                  height={500}
                  data={frequentWords}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" width={250} dataKey="word" />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#F94141"></Bar>
                </BarChart>
              </div>



              <div>
                <h1>Most Frequent Words in Hate Speech Tweets</h1>
                <BarChart
                  width={500}
                  height={500}
                  data={negFrequentWords}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" width={250} dataKey="word" />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#F94141"></Bar>
                </BarChart>
              </div>

              <div >
                <h1>Most Frequent Words in Non-Hate Speech Tweets</h1>
                <BarChart
                  width={500}
                  height={500}
                  data={posFrequentWords}
                  layout="vertical"
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" width={250} dataKey="word" />
                  <Tooltip />
                  <Bar dataKey="frequency" fill="#F94141"></Bar>
                </BarChart>
              </div>



              <div>
                <h1>Frequent HashTags in Non-Hate-Speech </h1>
                <BarChart
                  width={500}
                  height={300}
                  data={posFrequentHash}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hash" />
                  <YAxis />
                  <Bar
                    dataKey="frequency"
                    fill="#8884d8"
                    shape={<TriangleBar />}
                    label={{ position: "top" }}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </div>

              <div >
                <h1>Frequent HashTags in Hate-Speech </h1>
                <BarChart
                  width={500}
                  height={300}
                  data={negFrequentHash}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hash" />
                  <YAxis />
                  <Bar
                    dataKey="frequency"
                    fill="#8884d8"
                    shape={<TriangleBar />}
                    label={{ position: "top" }}
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % 20]} />
                    ))}
                  </Bar>
                </BarChart>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default TweetCharts;
