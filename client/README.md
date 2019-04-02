# Mangrove ‒ Client

## Prerequisites
Assuming you've cloned this repository and have a terminal open to this directory, you can install the client:
```
$ npm install
```

## Development
To run the client application in Electron with hot reloading run:
```
$ npm run electron-dev
```

### Updating packages
This application requires manual dependency updates. The easiest way to do this is to globally install the `npm-check-updates` package to your system and to periodically run `ncu` in this directory to find packages that are ready to be updated. Do not install this package to the project.
```
$ npm install -g npm-check-update
$ ncu
```

## User Guide
The purpose of this section is to guide you in organizing your files, and conducting jobs in the client to get the most out of the graphs for your specific research.

### Site and Series naming conventions
The Site field for files should be the location in which the recordings took place (e.g. Sanford Zoo) The Series field should specify the aim of the recordings taking place at the specified Site (e.g. Black Bear Exhibit, Giraffe Exhibit)

### Creating jobs that can be compared
In order to be able to compare results over Site or Series, you must conduct the same jobs on inputs from a Site or Series. This means that you must use the same inputs and specs for each index used. An example of a comparable set of inputs would be the following:

| Inputs | Site | Series | Index Used | Spec Used |
| ------ | ---- | ------ | ---------- | --------- |
| File 1 | Sanford Zoo | Black Bear | NDSI, ACI | NDSI1, ACI1 |
| File 2 | Sanford Zoo | Black Bear | NDSI, ACI | NDSI1, ACI1 |
| File 3 | Naples Zoo | Black Bear | NDSI | NDSI1 |

In this example, you could compare The Sanford Zoo Black Bear with the Naples Zoo Black Bear data **only** using NDSI. The reason for this is because only NDSI has been run on the Naples Zoo Black Bear data. If you wanted to compare ACI as well, you would need to run ACI on the Naples Zoo Black Bear data using the ACI1 spec. Using any other specs for ACI would not allow you to compare them, because different specs produce different results. Another case includes:

| Inputs | Site | Series | Index Used | Spec Used |
| ------ | ---- | ------ | ---------- | --------- |
| File 1 | Sanford Zoo | Black Bear | NDSI | NDSI1, NDSI2 |
| File 2 | Sanford Zoo | Black Bear | NDSI | NDSI1, NDSI2 |
| File 3 | Naples Zoo | Black Bear | NDSI | NDSI1, NDSI2 |

Here, you could compare all files from both Sanford Zoo Black Bear and Naples Zoo Black Bear. In this case, you would get two sections of NDSI graphs. One would be the results using NDSI1 specs, and the other would be results from the NDSI2 specs.

Another note is that the catalog will not let you select inputs and jobs that do not match these rules, so it is important that you follow these rules as to ensure you are able to conduct research correctly.

### Analysis over time
If you are aiming to look at data over time, it is best to include all files of interest in one Series. This way you can use the appropriate graphs to see each file's respective index value using the files' inputted dates. When uploading files, it is **very** important that you input the correct date and time for *each* file of interest in order to get a correct and valid graph.

Alternatively, if you want to see the results of a Site across all Series for that Site, simply use the Site drop down selection to specify which Site you want to view. This will use any inputs you have specified for the selected Site, and you can then view those results over time. 

### Analyzing a data set as a whole
If you are looking to see index values for an entire data set as a collective, each index includes these results in graphs.

### Analyzing individual files
You can look at individual file data in a Series or Site by using the appropriate graphs for each index, and you can also compare them to other files in the Series or Site as well.

### Comparing Series
When entering the Analysis page, the top will include two Series drop down selections. The first one will be the main data source, and you can choose to select another Series to compare to next to that. When doing this, a new section of graphs will display below the main data source graphs. These graphs will include graphs much like those explained above, but for both selected Sites. In addition, you will be able to compare individual files from each Series.

### Comparing Sites
In the same way you selected Series to compare, you can do the same for Sites. Another new section will display, with the same form of graphs as for comparing Series.
