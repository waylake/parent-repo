import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
import getInfo from "./DataExtraction";
import { visualization } from "./visualization";
import { countLine } from "./drawPopulation";
// import $ from "jquery";



class App extends React.Component {
  constructor(props) {
    super(props);

    let dataJson = getInfo("put url in this area");
    let visualizationInfo = visualization(dataJson);

    //data
    let vData = visualizationInfo.Gdata;

    //Layout
    let vLayout = visualizationInfo.Glayout;
    let shapes = vLayout.shapes;
    let annotations = vLayout.annotations;
    let width = 800;
    let height = 800;


    this.state = {
      data: vData,
      layout: {
        width,
        height,
        annotations,
        shapes,
        xaxis: {
          range: [9, 29],
          showgrid: false,
          showticklabels: false,
        },
        yaxis: {
          range: [9, 11.5],
          showgrid: false,
          showticklabels: false,
        },
        // legend position
        legend: {
          x: 0.04, //x: -2~3
          y: 0.28, //y: -2~3
        }
      },
      frames: [],
      config: {
        // staticPlot: true, 
        edits: {
          annotationText: false,
        },
        modeBarButtonsToRemove: ['zoomIn2d', 'zoomOut2d', 'zoom2d'],
      },

    };
  }

  render() {
    console.log(this.state.layout);
    return (
      <div>
        <Plot
          layout={this.state.layout}
          data={this.state.data}
          frames={this.state.frames}
          config={this.state.config}
          onInitialized={(figure) => this.setState(figure)}
          onUpdate={(figure) => this.setState(figure)}
          onClickAnnotation={e => {
            if (e.annotation.text === 'EDIT') { // edit 버튼 누르면
              // editable하게 바꾸기
              this.setState({
                config: {
                  edits: {
                    annotationText: true,
                  },
                }
              });
              // Layout값 바꾸기
              const newLayout = { ...this.state.layout };
              const annot = newLayout.annotations;
              const re1 = /<br>/g; //br태그 정규표현식
              const re2 = /<\/?b>/g; //b태그 정규표현식
              for (let i = 0; i < annot.length; i++) {
                annot[i].text = annot[i].text.replace(re1, ' ');
                annot[i].text = annot[i].text.replace(re2, '');
                if (annot[i].text === 'EDIT') annot[i].text = 'COMPLETE'
              }
              this.setState({
                layout: newLayout
              });
              console.log(newLayout);
            }// complete 버튼 누르면
            else if (e.annotation.text === 'COMPLETE') {
              this.setState({
                config: {
                  edits: {
                    annotationText: false,
                  },
                }
              });
            }
          }//click annotations event
          }
          onClick={() => { //임시 완료 버튼
            this.setState({
              config: {
                edits: {
                  annotationText: false,
                },
              }
            });
            //br태그 추가
            const newLayout = { ...this.state.layout };
            const annot = newLayout.annotations;
            for (let i = 0; i < annot.length; i++) {
              if (annot[i].name === 'population') {
                const idx = annot[i].text.indexOf(':');
                const front = annot[i].text.substring(0, idx + 1);
                const back = annot[i].text.substring(idx + 1);

                annot[i].text = `<b>${front}</b>${back}`;
                if (i === 0) annot[i].text = countLine(annot[i].text, 20)[1];
              }
              else {
                annot[i].text = countLine(annot[i].text, 70)[1];
                if (annot[i].text === 'COMPLETE') annot[i].text = 'EDIT';
              }
            }
            console.log(newLayout);
            this.setState({
              layout: newLayout
            });
          }}
        />
      </div>
    );
  }
}

export default App;
