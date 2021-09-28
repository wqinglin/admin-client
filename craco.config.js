const CracoLessPlugin = require("craco-less");

module.exports = {
    babel: {//支持装饰器
        plugins: [
            [
                "import",
                {
                    "libraryName": "antd",
                    "libraryDirectory": "es",
                    "style": true //设置为true即是less 这里用的是css
                }
            ]
        ]
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                // 此处根据 less-loader 版本的不同会有不同的配置，详见 less-loader 官方文档
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': 'green' },
                        javascriptEnabled: true
                    }
                }
            }
        }
    ]
}
