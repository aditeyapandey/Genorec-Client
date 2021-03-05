export const getIdeogram = (A, B, width) => {
    return {
        static: true,
        "tracks": [
          {
            "data": {
              "url": "https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/cytogenetic_band.csv",
              "type": "csv",
              "chromosomeField": "Chr.",
              "genomicFields": [
                "ISCN_start",
                "ISCN_stop",
                "Basepair_start",
                "Basepair_stop"
              ],
              "quantitativeFields": ["Band", "Density"]
            },
            "overlay": [
              {
                "mark": "text",
                "dataTransform": {
                  "filter": [
                    {"field": "Stain", "oneOf": ["acen-1", "acen-2"], "not": true}
                  ]
                },
                "text": {"field": "Band", "type": "nominal"},
                "color": {"value": "black"},
                "visibility": [
                  {
                    "operation": "less-than",
                    "measure": "width",
                    "threshold": "|xe-x|",
                    "transitionPadding": 10,
                    "target": "mark"
                  }
                ],
                "style": {"textStrokeWidth": 0}
              },
              {
                "mark": "rect",
                "dataTransform": {
                  "filter": [
                    {"field": "Stain", "oneOf": ["acen-1", "acen-2"], "not": true}
                  ]
                },
                "color": {
                  "field": "Density",
                  "type": "nominal",
                  "domain": ["", "25", "50", "75", "100"],
                  "range": ["white", "#D9D9D9", "#979797", "#636363", "black"]
                }
              },
              {
                "mark": "rect",
                "dataTransform": {
                  "filter": [{"field": "Stain", "oneOf": ["gvar"]}]
                },
                "color": {"value": "#A0A0F2"}
              },
              {
                "mark": "triangleRight",
                "dataTransform": {
                  "filter": [{"field": "Stain", "oneOf": ["acen-1"]}]
                },
                "color": {"value": "#B40101"}
              },
              {
                "mark": "triangleLeft",
                "dataTransform": {
                  "filter": [{"field": "Stain", "oneOf": ["acen-2"]}]
                },
                "color": {"value": "#B40101"}
              },
              {
                  mark: 'brush',
                  x: { linkingId: A }
              },
              {
                mark: 'brush',
                x: { linkingId: B }
            }
            ],
            "x": {"field": "Basepair_start", "type": "genomic"},
            "xe": {"field": "Basepair_stop", "type": "genomic"},
            "stroke": {"value": "gray"},
            "strokeWidth": {"value": 0.5},
            width,
            "height": 30
          }
        ]
    }
}