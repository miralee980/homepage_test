import express from "express";
import path from "path";
import React from "react";
import { StaticRouter } from "react-router-dom";
import { ChunkExtractor } from "@loadable/server";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { renderToString } from "react-dom/server";

import reducers from "./reducers";

const app = express();

if (process.env.NODE_ENV !== "production") {
	const webpack = require("webpack");
	const webpackConfig = require("../webpack.client.js").map((config) => {
		config.output.path = config.output.path.replace("dist/dist/", "dist/");
		return config;
	});

	const webpackDevMiddleware = require("webpack-dev-middleware");
	const webpackHotMiddleware = require("webpack-hot-middleware");

	const compiler = webpack(webpackConfig);

	app.use(
		webpackDevMiddleware(compiler, {
			logLevel: "silent",
			publicPath: webpackConfig[0].output.publicPath,
			writeToDisk: true
		})
	);

	app.use(webpackHotMiddleware(compiler));
}

app.use(express.static(path.resolve(__dirname)));

app.get("*", (req, res) => {
	const nodeStats = path.resolve(__dirname, "./node/loadable-stats.json");
	const webStats = path.resolve(__dirname, "./web/loadable-stats.json");
	const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
	const { default: App } = nodeExtractor.requireEntrypoint();
	const webExtractor = new ChunkExtractor({ statsFile: webStats });

	const store = createStore(reducers);
	const context = {};

	const jsx = webExtractor.collectChunks(
		<Provider store={store}>
			<StaticRouter location={req.url} context={context}>
				<App />
			</StaticRouter>
		</Provider>
	);

	const html = renderToString(jsx);
	const helmet = Helmet.renderStatic();

	res.set("content-type", "text/html");
	res.send(`
    <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta name="viewport" content="width=device-width, user-scalable=no">
          <meta name="google" content="notranslate">
          ${helmet.title.toString()}
          ${webExtractor.getLinkTags()}
          ${webExtractor.getStyleTags()}
        </head>
        <body>
          <div id="root">${html}</div>
          ${webExtractor.getScriptTags()}
        </body>
      </html>
  `);
});

app.listen(8008, () => console.log("Server started http://localhost:8008"));
