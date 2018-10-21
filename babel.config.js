const presets = [
    [
        '@babel/env',
        {
            targets: {
                node: '10'
            }
        }
    ]
]

const plugins = [
    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: false }],
    ['@babel/plugin-proposal-class-properties']
]

module.exports = {
    // Custom settings for the browser demo
    env: {
        browserdemo: {
            presets: [
                [
                    '@babel/env',
                    {
                        modules: false,
                        targets: {
                            edge: '17',
                            firefox: '60',
                            chrome: '67',
                            safari: '11.1'
                        }
                    }
                ]
            ]
        }
    },
    presets,
    plugins
}
