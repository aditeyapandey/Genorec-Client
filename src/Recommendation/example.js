
export const SIMPLE_GOSLING_SPEC = (width) => {
    return {
        "tracks": [
            {
                "data": {
                    "url": "https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ",
                    "type": "multivec",
                    "row": "sample",
                    "column": "position",
                    "value": "peak",
                    "categories": ["sample 1", "sample 2", "sample 3", "sample 4"]
                },
                mark: "point",
                x: { field: 'position', type: 'genomic' },
                y: { field: 'peak', type: 'quantitative', grid: true },
                color: { value: 'gray' },
                opacity: { value: 0.5 },
                width,
                height: 100
            }
        ]
    }
}