import React, { Component } from 'react';
import { Panel } from 'react-bootstrap';
import GraphsTable from './graphsTable';

function convertNDSIResults(jobs) {
  let dummy =
  [
    {
      author: "Test Author",
      creationTimeMs: 1547505059899,
      status: "queued",
      spec: "5c3d0d73c5f0c52b109deaae",
      jobId: "5c3d0da3c5f0c52b109deab0",
      type: "ndsi",
      input:
      {
        fileName: 'zoo1.wav',
        siteName: 'Zoo',
        location: [65.01, 40.45],
        setName: 'aci-zoo',
        location: 'UCF Arboretum',
        recordTimeMs: 1547505059899,
        result:
        {
          ndsiL:-0.3034096,
          ndsiR:-0.4155783,
          biophonyL:0.5152629,
          biophonyR:0.4037672,
          anthrophonyL:0.9641227,
          anthrophonyR:0.9779994
        }
      }
    },
    {
      author: "Test Author",
      creationTimeMs: 1547505059899,
      status: "queued",
      spec: "5c3d0d73c5f0c52b109deaae",
      jobId: "5c3d0da3c5f0c52b109deab0",
      type: "ndsi",
      input:
      {
        fileName: 'zoo1.wav',
        siteName: 'Zoo',
        location: [65.01, 40.45],
        setName: 'aci-zoo',
        location: 'UCF Arboretum',
        recordTimeMs: 1547505059899,
        result:
        {
          ndsiL:-0.6624246	,
          ndsiR:-0.8831600	,
          biophonyL:0.7731514,
          biophonyR:0.4181809,
          anthrophonyL:0.6636741,
          anthrophonyR:0.4328864
        }
      }
    },
    {
      author: "Test Author",
      creationTimeMs: 1547505059899,
      status: "queued",
      spec: "5c3d0d73c5f0c52b109deaae",
      jobId: "5c3d0da3c5f0c52b109deab0",
      type: "ndsi",
      input:
      {
        fileName: 'zoo1.wav',
        siteName: 'Zoo',
        location: [65.01, 40.45],
        setName: 'aci-zoo',
        location: 'UCF Arboretum',
        recordTimeMs: 1547505059899,
        result:
        {
          ndsiL:-0.6826328	,
          ndsiR:-0.4155783,
          biophonyL:0.5506875	,
          biophonyR:0.3700277,
          anthrophonyL:0.1992008,
          anthrophonyR:0.9990573
        }
      }
    }

  ]
  let ret;
  let results = jobs[0].input.results;

  let ndsiLTotal = 0;
  let ndsiRTotal = 0;
  let biophonyLTotal = 0;
  let biophonyRTotal = 0;
  let anthrophonyLTotal = 0;
  let anthrophonyRTotal = 0;

  // REMEMBER TO CHANGE DUMMY TO JOBS
  dummy.forEach(function(job){
    ndsiLTotal += job.input.result.ndsiL;
    ndsiRTotal += job.input.result.ndsiR;
    biophonyLTotal += job.input.result.biophonyL;
    biophonyRTotal += job.input.result.biophonyR;
    anthrophonyLTotal += job.input.result.anthrophonyL;
    anthrophonyRTotal += job.input.result.anthrophonyR;
  });

  // let ndsiLAvg = ndsiLTotal / jobs.length;
  // let ndsiRAvg = ndsiRTotal / jobs.length;
  // let biophonyLAvg = biophonyLTotal / jobs.length;
  // let biophonyRAvg = biophonyRTotal / jobs.length;
  // let anthrophonyLAvg = anthrophonyLTotal / jobs.length;
  // let anthrophonyRAvg = anthrophonyRTotal / jobs.length;
  let ndsiLAvg = ndsiLTotal / dummy.length;
  let ndsiRAvg = ndsiRTotal / dummy.length;
  let biophonyLAvg = biophonyLTotal / dummy.length;
  let biophonyRAvg = biophonyRTotal / dummy.length;
  let anthrophonyLAvg = anthrophonyLTotal / dummy.length;
  let anthrophonyRAvg = anthrophonyRTotal / dummy.length;

  ret = {
    graph1: [
      { name: 'Left Channel',
        ndsi: ndsiLAvg,
        biophony: biophonyLAvg,
        anthrophony: anthrophonyLAvg
      },
      { name: 'Right Channel',
        ndsi: ndsiRAvg,
        biophony: biophonyRAvg,
        anthrophony: anthrophonyRAvg
      }
    ],
    graph2: [
      { name: 'NDSI',
        leftChannel: ndsiLAvg,
        rightChannel: ndsiRAvg
      },
      { name: 'Biophony',
        leftChannel: biophonyLAvg,
        rightChannel: biophonyRAvg
      },
      {
        name: 'Anthrophony',
        leftChannel: anthrophonyLAvg,
        rightChannel: anthrophonyRAvg
      }
    ],
    graph3: []
  }

  // for(var i = 0; i < jobs.length; i++)
  // {
  //   let curObject = {
  //     name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
  //     ndsiL: jobs[i].result.ndsiL,
  //     ndsiR: jobs[i].result.ndsiR,
  //     biophonyL: jobs[i].result.biophonyL,
  //     biophonyR: jobs[i].result.biophonyR,
  //     anthrophonyL: jobs[i].result.anthrophonyL,
  //     anthrophonyR: jobs[i].result.anthrophonyR
  //   }
  //
  //   ret.graph3.push(curObject);
  // }

  dummy.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let curObject = {
      name: date.getHours() + ':' + date.getMinutes(),
      ndsiL: job.result.ndsiL,
      ndsiR: job.input.result.ndsiR,
      biophonyL: job.input.result.biophonyL,
      biophonyR: job.input.result.biophonyR,
      anthrophonyL: job.input.result.anthrophonyL,
      anthrophonyR: job.input.result.anthrophonyR
    }

    ret.graph3.push(curObject);
  });

  return ret;

}

function convertACIResults(jobs) {
  let dummy =
  [
    {
      author: "Test Author",
      creationTimeMs: 1547505059899,
      status: "queued",
      spec: "5c3d0d73c5f0c52b109deaae",
      jobId: "5c3d0da3c5f0c52b109deab0",
      type: "ndsi",
      input:
      {
        fileName: 'zoo1.wav',
        siteName: 'Zoo',
        location: [65.01, 40.45],
        setName: 'aci-zoo',
        location: 'UCF Arboretum',
        recordTimeMs: 1547505059899,
        result:
        {
          aciTotAllL: 18565.3,
          aciTotAllR: 18444.49,
          aciTotAllByMinL: 1856.53,
          aciTotAllByMinR: 1844.45,
          aciFlValsL:
          [
            98.77359,64.73988,68.68592,68.27465,66.17471,68.0162,69.27878,66.95601,68.42871,69.14454,69.79858,69.49263,69.48653,69.86335,70.3109,70.52824,70.45777,70.71018,69.84157,70.08711,70.76077,70.68451,70.75986,71.14078,71.16119,71.66312,72.34017,72.8902,73.59756,72.1762,72.22294,72.92418,73.22811,72.81413,71.98427,72.11844,71.92529,72.02397,72.27632,72.9993,72.60088,71.3347,71.46113,71.45923,71.23234,71.19715,71.43885,72.02029,71.93478,71.99004,72.01148,71.75426,72.00162,71.62908,71.82146,71.94604,72.1164,72.05095,72.27143,72.55314,72.51231,72.42022,72.88075,72.8679,72.87586,72.71408,73.20594,73.354,73.62091,73.5639,73.91896,73.87091,74.03535,74.20308,74.04994,74.25483,74.11538,74.46968,74.29404,74.22299,74.15218,74.13787,74.10706,74.32044,73.91116,73.97257,74.10459,73.9041,73.98269,73.82335,73.83058,73.8092,74.06423,73.89307,73.71789,73.71063,73.66627,73.8629,73.6997,74.03483,73.51244,73.64596,73.84482,73.48673,73.64889,73.57315,73.60598,73.63334,73.83274,73.38845,73.24958,73.52117,73.20613,73.35052,73.08123,73.3578,73.19001,73.17596,73.22244,73.194,72.99608,73.22173,72.81818,73.06977,72.54644,72.86005,72.79671,73.01107,72.69983,72.7318,72.7325,72.44487,72.89509,73.00744,72.60463,72.81471,72.81895,72.73659,72.56104,72.34996,72.43486,72.17362,72.50721,72.32074,72.23665,72.25802,72.35198,72.38133,72.13031,72.27138,71.9701,72.10674,72.14485,71.86471,71.87132,72.19516,72.06031,72.27148,71.83506,71.9433,71.89382,71.8831,72.08194,71.74723,71.9972,71.8444,71.72853,71.82179,71.6498,71.5682,71.45176,71.61882,71.51307,71.99928,71.15684,71.35166,71.75711,71.85615,71.51071,71.51811,71.22334,71.32099,71.26792,71.55196,71.34434,71.5653,71.44958,71.09804,71.5107,71.4665,71.55075,71.1722,71.45248,71.44995,71.25207,71.22266,71.56524,71.22241,71.1727,71.10778,70.88085,71.11201,71.35815,71.28996,71.16904,71.29248,71.20326,71.24194,71.45203,71.06384,71.26507,71.33601,71.3371,71.53982,71.34031,71.47499,71.40759,71.41912,71.38654,71.55814,71.59869,71.5835,71.89179,72.28219,71.81218,72.30153,72.00404,72.42783,72.14912,72.48196,72.78102,72.87524,72.79102,73.1914,73.34099,73.45221,73.59739,73.88431,74.13666,74.30638,74.56834,74.92562,75.19388,75.15921,75.72101,75.60289,75.90516,76.01482,76.2208,76.42111,76.60596,76.72281,76.97802,76.8818,77.18695,77.76246
          ],
          aciFlValsR:
          [
            98.35496,64.20776,69.71721,68.61668,66.20598,67.97455,69.70488,68.79179,68.18617,69.04104,70.16652,69.54017,69.7088,70.07134,70.13229,70.13187,70.06472,69.79634,69.39834,70.17161,70.34896,70.03431,70.07345,70.1868,70.41869,70.23403,70.72759,70.24776,70.93282,70.92948,69.3291,70.83646,70.62713,70.67966,70.75835,71.53017,70.76722,70.93032,70.69417,71.02524,70.94379,71.38374,70.98917,71.27042,70.96986,70.25503,70.38862,71.12284,71.3841,71.37201,71.19779,71.04136,71.00955,71.0862,70.91427,71.23108,71.10704,71.33785,71.28267,71.66276,71.71969,72.07854,72.25635,72.30194,72.53172,72.63118,72.69711,72.92881,73.0016,73.32714,73.03751,73.42012,73.13417,73.35145,73.46824,73.71677,73.56222,73.44245,73.60387,73.43782,73.64991,73.54232,73.63724,73.50219,73.42327,73.63373,73.37003,73.58534,73.20721,73.47064,73.47239,73.34977,73.34324,73.29713,73.38207,73.33228,73.51764,73.03552,73.48581,73.32488,73.34586,73.30618,73.09818,73.48461,73.29581,72.82424,73.12848,73.00393,73.1319,72.92471,73.01594,72.92343,72.84402,72.75667,72.88669,72.57178,72.93989,72.59386,72.83257,72.8212,72.68805,72.54689,72.71133,72.35632,72.65646,72.41898,72.57098,72.56307,72.22179,72.46959,72.44948,72.16644,72.22185,72.42235,72.07223,72.07994,71.85962,71.98258,71.99322,72.14898,72.02857,71.9638,72.19661,71.61425,71.93566,71.98454,71.90865,71.89283,71.80655,71.9421,71.69596,71.63157,71.54386,71.45709,71.58891,71.58975,71.57123,71.95112,71.63157,71.44005,71.52815,71.67288,71.61963,71.88771,71.31138,71.73912,71.34287,71.54839,71.42588,71.4301,71.68653,71.19165,71.41394,71.40936,71.0468,71.22443,71.26857,71.2128,71.12982,71.40408,71.039,71.34037,71.22901,71.08792,71.07767,71.23612,71.31018,71.12047,71.15072,70.90197,71.08231,71.06592,70.62886,71.27683,71.10041,71.15112,71.09032,71.12062,70.70945,71.31036,70.90647,70.87023,71.10879,71.05507,70.89386,71.09659,70.79202,70.85182,71.14955,70.83509,71.15493,70.89881,71.00651,70.78461,70.93465,70.81834,71.24026,71.06965,71.23932,71.37423,71.33331,71.34588,71.46884,71.80315,71.38008,71.91114,71.64864,71.85661,71.87716,72.57957,72.32093,72.40666,72.49304,72.81124,72.92754,73.03682,73.4839,73.16071,73.70724,74.03011,74.07185,74.46938,74.71886,74.95177,75.19409,75.2652,75.72626,75.63605,76.24452,76.04785,76.33374,76.69331,76.6625,76.72276,76.75262,77.65325
          ]
        }
      }
    },
    {
      author: "Test Author",
      creationTimeMs: 1547505059899,
      status: "queued",
      spec: "5c3d0d73c5f0c52b109deaae",
      jobId: "5c3d0da3c5f0c52b109deab0",
      type: "ndsi",
      input:
      {
        fileName: 'zoo1.wav',
        siteName: 'Zoo',
        location: [65.01, 40.45],
        setName: 'aci-zoo',
        location: 'UCF Arboretum',
        recordTimeMs: 1547505059899,
        result:
        {
          aciTotAllL: 18791.02,
          aciTotAllR: 18635.43,
          aciTotAllByMinL: 1879.1,
          aciTotAllByMinR: 1863.54,
          aciFlValsL:
          [
            98.57817,64.86109,68.65887,68.20251,65.997,68.09314,69.72945,66.28664,68.50168,69.96066,69.88522,70.17091,70.38608,70.4648,70.31244,70.43326,70.23166,70.39629,70.56677,70.91964,70.57914,71.02324,71.03864,71.41808,71.10347,71.93811,72.09108,73.40413,73.86535,72.28827,71.73346,72.37626,73.83212,73.4148,72.07166,72.37119,73.32293,72.60956,72.62766,73.09877,71.93443,71.82215,71.46676,71.40687,71.24092,70.37486,70.13737,71.4535,71.50594,71.77751,71.66347,71.56877,71.72243,72.46245,71.99275,71.92038,72.2851,72.02899,72.45424,73.11787,73.01279,72.91972,73.68902,73.82605,73.85863,74.03287,74.21336,74.57749,74.79436,74.82702,75.21704,75.21843,75.30395,75.2956,75.86028,75.43639,75.65757,75.46715,75.65584,75.65911,75.42626,75.67773,75.58892,75.73898,75.42065,75.59403,75.45252,75.55126,75.30244,75.27744,75.41584,75.17462,75.29209,75.1726,75.10212,75.10229,74.93797,75.02728,75.13753,74.95995,75.207,75.09638,75.17269,74.89349,75.12246,74.85248,75.08979,74.79359,74.48754,74.59775,74.4553,74.57403,74.7493,74.39636,74.56389,74.57612,74.63443,74.34236,74.2375,74.43638,74.47997,74.25426,74.42408,74.02281,74.21401,73.95703,74.03744,73.78719,73.59689,74.01048,73.65118,73.5897,73.93119,73.45281,73.74803,73.99691,73.52247,73.56589,73.38574,73.51737,73.52918,73.42864,73.59882,73.18267,73.37524,73.39327,73.42885,73.37518,73.1653,73.38583,73.28003,73.25003,73.13563,72.93674,73.24641,72.9202,72.86012,73.01752,72.94243,72.58676,73.02192,72.66681,73.09046,72.7829,72.86254,72.62971,72.73125,72.72592,72.34731,72.81676,72.42218,72.84196,72.81262,72.66611,72.57519,71.96884,72.42045,72.21922,72.60027,72.25275,72.36952,72.46373,72.32671,72.40502,72.37803,72.28542,72.43332,72.07456,72.36346,72.09656,72.18336,72.2814,72.27669,71.99822,72.2451,72.12384,72.05894,72.48015,72.04987,71.84586,71.9246,72.05689,72.07422,72.42915,72.08159,71.83289,71.93876,72.23995,71.86611,72.39662,72.11843,72.30547,72.45536,72.09032,72.18267,72.28808,72.40108,72.64466,72.27714,72.82516,72.34981,73.11313,72.63707,73.11482,72.71838,73.0005,73.3595,73.2932,73.60679,73.70612,74.19105,74.03952,74.07942,74.17192,74.63606,74.6192,75.2015,75.09536,75.33338,75.86374,75.70412,76.18178,76.40461,76.7901,77.08226,76.9808,77.46293,77.57668,77.76848,78.08983,78.23408,78.37749,78.47314,78.61798,78.65544,79.34192
          ],
          aciFlValsR:
          [
            98.60804,64.71554,69.36072,68.2516,66.1148,68.11941,69.93986,68.10395,68.32643,69.18714,69.72907,69.57443,69.63888,70.24589,70.09144,70.23441,70.30991,69.92883,69.27955,70.30259,70.18616,70.5517,70.19365,70.5798,70.3061,70.52421,70.48819,70.87859,70.56115,70.62713,70.84646,70.51051,70.79645,70.85295,70.82024,71.35131,71.02134,71.05445,71.10961,70.85347,70.74302,70.62895,70.76393,70.56194,70.98444,69.68545,68.50314,70.82271,70.96948,71.43551,71.62675,71.59374,71.2389,71.34213,71.76067,71.7018,72.22704,72.20727,72.26215,72.43778,72.72234,73.28354,73.30598,73.62923,74.19289,73.83256,73.96968,74.13589,74.43933,74.5461,74.35285,74.47431,74.77967,74.69521,74.66103,74.96363,74.91039,74.75386,74.87502,74.86052,74.90918,74.69039,74.88545,74.79103,74.8275,74.84483,74.50212,74.65373,74.76593,74.3672,74.49859,74.47056,74.54613,74.53859,74.46146,74.53976,74.29548,74.44293,74.4152,74.3289,74.31065,74.39585,74.12674,74.38289,73.95064,74.51488,74.00404,74.16478,74.22625,74.0113,74.1315,73.9606,73.99959,74.04478,74.2642,73.87907,73.73552,73.78533,73.53799,73.94471,73.67985,73.51674,73.94555,73.33891,73.40691,73.61662,73.60159,73.32278,73.58343,73.10385,72.80658,73.1211,73.31451,73.03194,73.23462,72.95694,73.10817,72.69988,72.95771,72.95008,72.93574,72.79583,73.02425,72.5777,72.75645,72.83813,72.95055,72.96635,72.81968,72.32566,72.62346,72.51128,72.4251,72.38849,72.53273,72.55102,72.7854,72.69715,72.33291,72.50361,72.20472,72.65462,72.02264,72.50661,72.03472,72.40921,72.18054,72.28235,72.31476,72.0548,72.04456,71.6654,71.93143,71.97431,72.13668,71.93468,71.93555,71.84916,72.09868,71.90549,71.88309,71.87039,71.92434,71.96248,71.83442,71.72791,71.86283,71.67808,71.89115,71.67056,71.99666,71.92183,71.81728,71.73503,71.91986,71.83695,71.38927,71.43405,71.63097,71.78559,71.80425,71.92967,71.5878,71.7372,71.79802,71.7118,72.18038,71.6402,71.533,71.44576,71.48815,71.74548,71.78237,71.77388,71.65787,71.74255,72.13708,71.81022,71.93828,72.19113,72.2005,72.20869,72.6673,71.89644,72.49335,72.47447,72.44432,72.53993,72.81491,73.06479,73.06768,73.26469,73.19719,73.56885,74.07395,74.06711,74.36767,74.5437,75.10161,74.94963,75.02406,75.58589,75.60239,76.18511,75.97912,76.77618,76.73425,76.86807,77.26889,77.61593,77.46237,77.77316,77.92681,78.24075,78.09523,78.89437
          ]
        }
      }
    },
    {
      author: "Test Author",
      creationTimeMs: 1547505059899,
      status: "queued",
      spec: "5c3d0d73c5f0c52b109deaae",
      jobId: "5c3d0da3c5f0c52b109deab0",
      type: "ndsi",
      input:
      {
        fileName: 'zoo1.wav',
        siteName: 'Zoo',
        location: [65.01, 40.45],
        setName: 'aci-zoo',
        location: 'UCF Arboretum',
        recordTimeMs: 1547505059899,
        result:
        {
          aciTotAllL: 18639.29,
          aciTotAllR: 18531.27,
          aciTotAllByMinL: 1863.93,
          aciTotAllByMinR: 1853.13,
          aciFlValsL:
          [
            98.16754,63.9832,68.07306,67.71588,65.9806,68.14681,69.20445,66.4511,68.04805,69.13972,69.49838,69.62439,69.90528,70.35578,70.14987,69.71071,70.12826,70.28725,70.45375,70.46259,70.55792,71.27271,70.69414,70.64299,70.90558,71.44012,71.76148,72.56402,72.74806,71.73949,71.66343,72.35155,73.07944,73.62043,75.07479,76.79902,74.79617,72.32483,72.99559,73.1267,72.62347,72.18414,72.21863,71.61278,71.87223,71.37291,71.24533,71.11607,71.8474,71.76074,71.54331,71.21455,71.68615,71.54206,71.61951,71.44937,71.39066,71.59442,71.87294,72.19903,72.23082,72.25896,72.23005,72.67234,72.70826,72.86279,73.41804,73.69336,73.6882,74.14585,74.277,74.01013,74.44343,74.51411,74.77697,74.65776,74.64071,74.80776,74.74853,74.82634,74.6634,74.8314,74.54368,74.99016,74.62008,74.79575,74.50878,74.2562,74.60774,74.33038,74.43832,74.66239,74.47947,74.45673,74.36319,74.40474,74.34322,74.32834,74.26444,74.19322,74.2244,74.1753,74.33372,74.15366,74.37185,74.1859,74.16223,74.0471,74.02566,73.76265,74.08239,73.60472,73.74895,73.84277,73.57357,73.74599,73.61059,73.47313,73.61349,73.54224,73.24487,73.31815,73.36822,73.20165,73.54169,73.02546,73.20868,73.15642,73.20121,73.37709,73.36,73.06939,72.97474,72.90269,73.13367,72.92051,72.89741,72.90555,72.74482,72.44776,72.73556,72.68045,72.93287,72.65614,72.82314,72.85414,72.4967,72.57006,72.59382,72.60873,72.3246,72.40619,72.36117,72.27412,72.55873,72.40836,72.48665,72.2872,72.31536,72.1774,72.28785,72.39824,72.35606,72.19107,72.13966,72.01911,71.91445,71.77402,71.82108,71.87015,71.83056,72.16514,71.72786,71.83657,71.94045,71.32061,71.59392,71.86481,71.56349,71.93946,71.81514,71.97939,71.51292,71.63253,71.55345,71.67864,71.68677,71.75725,71.58316,71.5294,71.67445,71.63788,71.75145,71.61267,71.56044,71.51942,71.48929,71.46708,71.66502,71.59469,71.6941,71.41088,71.4606,71.64155,71.63636,71.44844,71.89312,71.42627,71.5013,71.2077,71.58334,71.50227,71.59438,71.59794,71.66961,71.81942,71.54574,71.36744,71.70003,72.2831,72.04724,72.15291,72.18873,72.03987,71.93771,72.33243,72.63865,72.51613,72.7702,72.74761,73.35732,73.05788,73.31861,73.49431,73.81882,74.31227,74.36962,74.31665,74.78371,74.97737,74.99234,75.55973,75.5079,75.86104,76.03701,76.34405,76.23431,76.60979,76.74211,77.17631,77.22919,77.40806,77.42242,77.52786,77.64298,78.44413
          ],
          aciFlValsR:
          [
            97.5913,63.31383,69.14947,68.48706,66.23732,68.30344,70.24508,68.33489,68.84017,68.35411,69.25107,69.82285,70.14722,70.12298,70.29045,69.68235,70.36147,69.89304,69.69933,70.32363,70.27344,70.13877,70.64961,70.46031,70.93127,70.47371,70.85566,70.91223,70.58463,71.1714,70.23579,70.72299,70.75278,70.54492,70.80437,71.06439,71.19198,71.35392,71.29469,71.28396,71.1972,71.28518,70.95511,71.04672,71.11529,71.11829,71.36338,71.60482,71.40522,71.32,71.71908,71.55442,71.76455,71.56131,71.6425,71.65066,72.3104,72.02511,72.21412,72.49623,72.55139,73.25622,73.15699,73.28761,73.86913,73.72824,73.84134,73.74964,73.74492,73.73752,73.97514,74.12058,74.23861,74.29458,74.00003,74.31629,74.34519,74.32237,74.0646,74.27277,74.16468,74.0304,74.04117,74.41642,73.9698,74.18791,74.15148,73.88026,74.03608,74.28013,73.69889,73.95507,73.92235,73.80292,73.94284,73.77387,73.81029,73.6575,73.85999,73.64301,73.92658,73.50852,73.58058,73.70294,73.50555,73.6642,73.47825,73.66422,73.28964,73.22093,73.5497,73.33935,73.42872,73.18156,73.26262,73.30041,73.12705,73.1101,73.1665,73.24372,72.75072,73.052,72.94146,72.8165,73.0034,72.69348,72.66475,72.71396,72.53718,72.64981,72.88878,72.30599,72.40371,72.63349,72.55132,72.31198,72.55734,72.43957,72.26343,72.36276,72.2271,72.2705,72.19472,72.3387,72.30787,72.3817,72.28944,72.22823,72.16678,71.8189,72.02147,72.04969,72.06671,72.10767,71.68716,72.07552,71.90085,71.93334,71.92402,71.7069,71.93851,71.52667,71.60998,71.69554,71.548,71.70717,71.50582,71.30288,71.59083,71.77322,71.47084,71.79132,71.56908,71.50009,71.65827,71.5141,71.54054,71.40042,71.78753,71.49754,71.73189,71.13244,71.40078,71.22336,71.35711,71.29972,71.53594,71.30574,71.19128,71.19154,71.34842,71.20155,71.26452,71.2102,71.14311,71.25158,71.06449,70.94419,71.27206,71.20725,71.34382,71.27111,70.88489,71.10204,71.1111,71.19527,71.35018,71.17008,71.17974,71.42786,71.08328,71.37251,71.14395,71.20456,71.44142,71.33145,71.44715,71.481,71.50035,71.2928,71.61599,71.80981,71.64213,72.05456,71.89101,71.7736,72.49806,72.48368,72.4235,72.43935,72.58344,72.85563,72.78516,73.21166,73.26491,73.27856,73.71093,73.68925,74.0907,74.5201,74.68773,74.98397,75.00581,75.40158,75.74828,75.75,75.89874,76.42476,76.28349,76.75432,76.74261,77.01213,76.94929,77.15068,77.30767,77.91666
          ]
        }
      }
    }

  ]

  console.log(jobs)
  let ret;

  let aciTotAllL = 0;
  let aciTotAllR = 0;
  let aciTotAllByMinL = 0;
  let aciTotAllByMinR = 0;

  let aciFlValsL = [];
  let aciFlValsR = [];

  // REMEMBER TO CHANGE DUMMY TO JOBS
  dummy.forEach(function(job){
    aciTotAllL += job.input.result.aciTotAllL;
    aciTotAllR += job.input.result.aciTotAllR;
    aciTotAllByMinL += job.input.result.aciTotAllByMinL;
    aciTotAllByMinR += job.input.result.aciTotAllByMinR;

    aciFlValsL.push.apply(aciFlValsL, job.input.result.aciFlValsL);
    aciFlValsR.push.apply(aciFlValsR, job.input.result.aciFlValsR);
  });

  ret = {
    graph1: [],
    graph2:
    [
      {
        name: 'ACI Total Left Channel',
        data: aciTotAllL
      },
      {
        name: 'ACI Total Right Channel',
        data: aciTotAllR
      },
      {
        name: 'ACI Total By Minutes Left Channel',
        data: aciTotAllByMinL
      },
      {
        name: 'ACI Total By Minutes Right Channel',
        data: aciTotAllByMinR
      }
    ],
    graph3: []
  }

  for(var i = 0; i < aciFlValsL.length; i++)
  {
    let curObject =
    {
      name: ((i + 1) * 5).toString(),
      aciLeft: aciFlValsL[i],
      aciRight: aciFlValsR[i]
    }

    ret.graph1.push(curObject);
  }

  // for(i = 0; i < jobs.length; i++)
  // {
  //   let curObject =
  //   {
  //     name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
  //     aciLeft: jobs[i].input.result.aciTotAllByMinL,
  //     aciRight: jobs[i].input.result.aciTotAllByMinR
  //   }
  //
  //   ret.graph3.push(curObject);
  // }

  dummy.forEach(function(job){
    let date = new Date(job.input.recordTimeMs);
    let curObject =
    {
      name: date.getHours() + ':' + date.getMinutes(),
      aciLeft: job.input.result.aciTotAllByMinL,
      aciRight: job.input.result.aciTotAllByMinR
    }

    ret.graph3.push(curObject);

  });


  return ret;
}

function convertADIResults(jobs) {
  let ret;

  let arrLength = jobs[0].input.result.ADIbandValsL.length;
  let adiLTotal = 0;
  let adiRTotal = 0;
  let adiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
  let adiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

  jobs.forEach(function(job){
    adiLTotal += job.input.result.adiL;
    adiRTotal += job.input.result.adiR;

    adiLBandTemp = adiLBandTemp.map(function(num, idx){
      return num + job.input.result.ADIbandValsL[idx];
    });

    adiRBandTemp = adiRBandTemp.map(function(num, idx){
      return num + job.input.result.ADIbandValsR[idx];
    });

  });

  let adiLAvg = adiLTotal / jobs.length;
  let adiRAvg = adiRTotal / jobs.length;

  let adiLBand = adiLBandTemp.map(function(element){
    return element / jobs.length;
  });

  let adiRBand = adiRBandTemp.map(function(element){
    return element / jobs.length;
  });

  ret = {
    graph1: [],
    graph2: [],
    graph3:
    [
      {
        name: 'ADI Left Channel',
        data: adiLAvg
      },
      {
        name: 'ADI Right Channel',
        data: adiRAvg
      }
    ],
    graph4: []
  }

  for(var i = 0; i < adiLBand.length; i++)
  {
    let curObject =
    {
      name: jobs[0].input.result.ADIbandRangeL[i],
      leftBandVal: adiLBand[i],
      rightBandVal: adiRBand[i]
    }

    ret.graph1.push(curObject);
  }

  for(i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
      leftADIVal: jobs[i].input.result.adiL,
      rightADIVal: jobs[i].input.result.adiR
    }

    ret.graph2.push(curObject);
  }

  jobs.forEach(function(job){
    let curObject =
    {
      name: job.input.fileName,
      leftADIVal: job.input.result.adiL,
      rightADIVal: job.input.result.adiR
    }

    ret.graph4.push(curObject);
  });


  return ret;
}

function convertAEIResults(jobs) {
  let ret;

  let arrLength = jobs[0].input.result.AEIbandValsL.length;
  let aeiLTotal = 0;
  let aeiRTotal = 0;
  let aeiLBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);
  let aeiRBandTemp = Array.apply(null, Array(arrLength)).map(Number.prototype.valueOf,0);

  jobs.forEach(function(job){
    aeiLTotal += job.input.result.aeiL;
    aeiRTotal += job.input.result.aeiR;

    aeiLBandTemp = aeiLBandTemp.map(function(num, idx){
      return num + job.input.result.AEIbandValsL[idx];
    });

    aeiRBandTemp = aeiRBandTemp.map(function(num, idx){
      return num + job.input.result.AEIbandValsR[idx];
    });

  });

  let aeiLAvg = aeiLTotal / jobs.length;
  let aeiRAvg = aeiRTotal / jobs.length;

  let aeiLBand = aeiLBandTemp.map(function(element){
    return element / jobs.length;
  });

  let aeiRBand = aeiRBandTemp.map(function(element){
    return element / jobs.length;
  });

  ret = {
    graph1: [],
    graph2: [],
    graph3:
    [
      {
        name: 'AEI Left Channel',
        data: aeiLAvg
      },
      {
        name: 'AEI Right Channel',
        data: aeiRAvg
      }
    ],
    graph4: []
  }

  for(var i = 0; i < aeiLBand.length; i++)
  {
    let curObject =
    {
      name: jobs[0].input.result.AEIbandRangeL[i],
      leftBandVal: aeiLBand[i],
      rightBandVal: aeiRBand[i]
    }

    ret.graph1.push(curObject);
  }

  for(i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
      leftAEIVal: jobs[i].input.result.aeiL,
      rightAEIVal: jobs[i].input.result.aeiR
    }

    ret.graph2.push(curObject);
  }

  jobs.forEach(function(job){
    let curObject =
    {
      name: job.input.fileName,
      leftAEIVal: job.input.result.aeiL,
      rightAEIVal: job.input.result.aeiR
    }

    ret.graph4.push(curObject);
  });

  return ret;

}

function convertBAResults(jobs) {
  let ret;

  let areaLTotal = 0;
  let areaRTotal = 0;

  jobs.forEach(function(job){
    areaLTotal += job.input.result.areaL;
    areaRTotal += job.input.result.areaR;
  });

  ret = {
    graph1: [],
    graph2:
    [
      {
        name: 'Left Channel Area',
        data: areaLTotal
      },
      {
        name: 'Right Channel Area',
        data: areaRTotal
      }
    ],
    graph3: []
  }

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject = {
      name: jobs[i].input.fileName,
      areaL: jobs[i].input.result.areaL,
      areaR: jobs[i].input.result.areaR
    }

    ret.graph3.push(curObject);
  }


  return ret;

}

function convertADIAEICompare(jobs) {
  let ret;

  ret =
  {
    graph1: [], // compare aei and adi by time
    graph2: []  // compare aei and adi by file
  }

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
      leftADIVal: jobs[i].input.result.adiL,
      rightADIVal: jobs[i].input.result.adiR,
      leftAEIVal: jobs[i].input.result.aeiL,
      rightAEIVal: jobs[i].input.result.aeiR
    }

    ret.graph1.push(curObject);
  }

  jobs.forEach(function(job){
    let curObject =
    {
      name: job.input.fileName,
      leftADIVal: job.input.result.adiL,
      rightADIVal: job.input.result.adiR,
      leftAEIVal: job.input.result.aeiL,
      rightAEIVal: job.input.result.aeiR
    }

    ret.graph2.push(curObject);
  });

  return ret;
}

function convertCompareACIResults(jobs) {
  let ret = {
    graph1: convertCompareACIResultsOverTime(jobs),
    graph2: convertCompareACIResultsOverSite(jobs)
  }

  return ret;
}

function convertCompareACIResultsOverTime(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
      leftData: jobs[i].input.result.aciTotAllByMinL,
      rightData: jobs[i].input.result.aciTotAllByMinR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareACIResultsOverSite(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].input.siteName,
      leftData: jobs[i].input.result.aciTotAllByMinL,
      rightData: jobs[i].input.result.aciTotAllByMinR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareBioResults(jobs) {
  let ret = {
    graph1: convertCompareBioResultsOverTime(jobs),
    graph2: convertCompareBioResultsOverSite(jobs)
  }

  return ret;
}

function convertCompareBioResultsOverTime(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
      areaL: jobs[i].input.result.areaL,
      areaR: jobs[i].input.result.areaR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareBioResultsOverSite(jobs) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject =
    {
      name: jobs[i].input.siteName,
      areaL: jobs[i].input.result.areaL,
      areaR: jobs[i].input.result.areaR
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareNDSIResults(jobs) {
  let ret = {
    graph1: convertCompareNDSIResultsOverTime(jobs, 'ndsi'),
    graph2: convertCompareNDSIResultsOverSite(jobs, 'ndsi'),
    graph3: convertCompareNDSIResultsOverTime(jobs, 'biophony'),
    graph4: convertCompareNDSIResultsOverSite(jobs, 'biophony'),
    graph5: convertCompareNDSIResultsOverTime(jobs, 'anthrophony'),
    graph6: convertCompareNDSIResultsOverSite(jobs, 'anthrophony')
  }

  return ret;
}

function convertCompareNDSIResultsOverTime(jobs, value) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject;

    if(value === 'ndsi')
    {
      curObject = {
        name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
        ndsiL: jobs[i].input.result.ndsiL,
        ndsiR: jobs[i].input.result.ndsiR
      }
    }else if(value === 'biophony')
    {
      curObject = {
        name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
        biophonyL: jobs[i].input.result.biophonyL,
        biophonyR: jobs[i].input.result.biophonyR
      }
    }else if(value === 'anthrophony')
    {
      curObject = {
        name: new Date(new Date(jobs[i].input.recordTimeMs).getTime()).toString(),
        anthrophonyL: jobs[i].input.result.anthrophonyL,
        anthrophonyR: jobs[i].input.result.anthrophonyR
      }
    }

    ret.push(curObject);
  }

  return ret;
}

function convertCompareNDSIResultsOverSite(jobs, value) {
  let ret = [];

  for(var i = 0; i < jobs.length; i++)
  {
    let curObject;

    if(value === 'ndsi')
    {
      curObject = {
        name: jobs[i].input.siteName,
        ndsiL: jobs[i].input.result.ndsiL,
        ndsiR: jobs[i].input.result.ndsiR
      }
    }else if(value === 'biophony')
    {
      curObject = {
        name: jobs[i].input.siteName,
        biophonyL: jobs[i].input.result.biophonyL,
        biophonyR: jobs[i].input.result.biophonyR
      }
    }else if(value === 'anthrophony')
    {
      curObject = {
        name: jobs[i].input.siteName,
        anthrophonyL: jobs[i].input.result.anthrophonyL,
        anthrophonyR: jobs[i].input.result.anthrophonyR
      }
    }

    ret.push(curObject);
  }

  return ret;
}

function convertOutlierResults(job) {
  // let ret = {
  //   graph1: [],
  //   index: job.type
  // }
  //
  // let curObject = {
  //   name: jobs[i].name,
  //   leftData: 0,
  //   rightData: 0
  // }
  //
  // if(ret.index === 'aci')
  // {
  //   curObject.leftData = job.result.aciTotAllByMinL;
  //   curObject.rightData = job.result.aciTotAllByMinR;
  // }else if(ret.index === 'bio')
  // {
  //   curObject.leftData = jobs.result.areaL;
  //   curObject.rightData = jobs.result.areaR;
  // }
  //
  // ret.graph1.push(curObject);

  // for(var i = 0; i < jobs.length; i++)
  // {
  //   let curObject = {
  //     name: jobs[i].name,
  //     leftData: 0,
  //     rightData: 0
  //   }
  //
  //   if(ret.index === 'aci')
  //   {
  //     curObject.leftData = jobs[i].results.aciTotAllByMinL;
  //     curObject.rightData = jobs[i].results.aciTotAllByMinR;
  //   }else if(ret.index === 'bio')
  //   {
  //     curObject.leftData = jobs[i].results.areaL;
  //     curObject.rightData = jobs[i].results.areaR;
  //   }
  //
  //   ret.graph1.push(curObject);
  // }

  // return ret;
}

class AnalysisView extends Component {
  constructor() {
    super();

    this.state = {
    };
  }

  componentWillReceiveProps(nextProps) {
    this.formatJob(nextProps.chosenResult)
    if(nextProps.resultToCompare)
      this.formatCompare(nextProps.resultToCompare)
    else
      this.setState({ formattedJobToCompare: null })
  }

  componentDidMount = () => {
    // console.log(this.props)
    this.formatJob(this.props.selectedResult)
  }

  formatJob = (props) => {
    console.log(this.props)
    console.log(this.props.selectedJobs)
    let graphs;
    switch(this.props.index)
    {
      case "aci":
        graphs = convertACIResults(this.props.selectedJobs)
        break;
      case "ndsi":
        graphs = convertNDSIResults(this.props.selectedJobs)
        break;
      case "adi":
        graphs = convertADIResults(this.props.selectedJobs)
        break;
      case "aei":
        graphs = convertAEIResults(this.props.selectedJobs)
        break;
      case "bio":
        graphs = convertBAResults(this.props.selectedJobs)
        break;
      default:
        graphs = null
    }

    var formattedJob = (
      <div>
        <h4>
          {this.props.selectedJobs[0].input.siteName} - {this.props.index.toUpperCase()}
        </h4>
        <h4>
          By: {this.props.selectedJobs[0].author}
        </h4>
        <h4>
          {this.props.selectedJobs[0].spec}
        </h4>
        <GraphsTable
          index={this.props.index}
          graphs={graphs}
        />
      </div>
    )
    this.setState({ formattedJob: formattedJob })
  }

  formatCompare = (props) => {
    var formattedJobToCompare = (
      <div>
        <h4>
          {props.input.sitename}
        </h4>

        {/*<p>{job.type.toUpperCase()}&nbsp;&nbsp;&nbsp;&nbsp;{job.input}&nbsp;&nbsp;&nbsp;&nbsp;{job.status}</p>*/}
        <p>{props.type.toUpperCase()}</p>
        <p>{props.spec.alias}</p>
      </div>
    )
    this.setState({ formattedJobToCompare: formattedJobToCompare })
  }

  render() {
    return (
      <div>
        {this.state.formattedJob ?
          <div>
            {this.state.formattedJobToCompare ?
              <div>
                {this.state.formattedJob}
                {this.state.formattedJobToCompare}
              </div>
              :
              <div>
                {this.state.formattedJob}
              </div>
            }
          </div>
        :
          ''
        }
      </div>
    );
  }
}

export default AnalysisView;
