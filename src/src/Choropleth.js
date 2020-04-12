import React from 'react';
import { ResponsiveChoropleth } from '@nivo/geo';
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
const Choropleth = ({ data, features, width, height }) => (
    <ResponsiveChoropleth
        data={data}
        value="Confirmed"
        features={features}
        width={width}
        height={height}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        colors="PuRd"
        domain={[ 0, 300 ]}
        unknownColor="#666666"
        valueFormat=".2s"
        projectionTranslation={[ -0.9, 2 ]}
        projectionRotation={[ 0, 0, 0 ]}
        projectionScale={680}
        enableGraticule={true}
        graticuleLineColor="#dddddd"
        borderWidth={0.5}
        borderColor="#152538"
        legends={[
            {
                anchor: 'bottom-left',
                direction: 'column',
                justify: true,
                translateX: 20,
                translateY: -10,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: 'left-to-right',
                itemTextColor: '#444444',
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000000',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)


export default Choropleth;
