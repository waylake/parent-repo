import "./App.css";
import React from "react";
import Plot from "react-plotly.js";
import getInfo from "./DataExtraction";
import { visualization } from "./visualization";
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
      mode: 'read',
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
        legend:{
          x:0.04, //x: -2~3
          y:0.28, //y: -2~3
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
    const newLayout = { ...this.state.layout };
    if (this.state.mode === 'edit') {
      const re = /<\/?[br]+>/g;
      for (let i = 0; i < this.state.layout.annotations.length; i++) {
        newLayout.annotations[i].text = this.state.layout.annotations[i].text.replace(re, ' ');
        if (newLayout.annotations[i].text === 'EDIT') newLayout.annotations[i].text = 'COMPLETE'
      }
    }
    // else if (this.state.mode === 'complete') {
    //   //br태그 추가
    //   for (let i = 0; i < this.state.layout.annotations.length; i++) {
    //     newLayout.annotations[i].text = this.state.layout.annotations[i].text.replace(re, ' ');
    //     if (newLayout.annotations[i].text === 'COMPLETE') newLayout.annotations[i].text = 'EDIT'
    //   }
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
            //console.log(e);
            if (e.annotation.text === 'EDIT') { // edit 버튼 누르면
              this.setState({
                config: {
                  edits: {
                    annotationText: true,
                  },
                }
              });
              this.setState({
                layout: newLayout
              });
              this.setState({ mode: 'edit' });
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
            this.setState({ mode: 'complete' });
            console.log(this.state.layout.annotations);
          }}
        />
      </div>
    );
  }
}

export default App;
