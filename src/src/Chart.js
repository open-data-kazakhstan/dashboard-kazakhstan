import React from 'react';
import Plot from 'react-plotly.js';


export default function (props) {
  return (
    <Plot
      className="w-full h-graph"
      data={props.data}
      layout={ {title: props.title, yaxis: {type: props.scale}, colorway: ['black', 'gray', 'orange']} }
      config={ {responsive: true, displayModeBar: false} }
    />
  );
}
