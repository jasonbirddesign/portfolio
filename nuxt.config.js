const PurgecssPlugin = require('purgecss-webpack-plugin')
const glob = require('glob-all')
const path = require('path')

class TailwindExtractor {
	static extract (content) {
		return content.match(/[A-Za-z0-9-_:\/]+/g) || []
	}
}

module.exports = {
	mode: 'spa',
	// Header
	head: {
		title: 'Work',
		titleTemplate: '%s | Jason Bird',
		htmlAttrs: { lang: 'en' },
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ hid: 'description', name: 'description', content: 'A Product Designer focused on creating digital experiences by solving human problems first to drive usable & scalable design systems' }
		],
		link: [{rel: 'icon', type: 'image/x-icon', href: (process.env.DEPLOY_ENV === 'GH_PAGES' ? '/portfolio' : '') + '/favicon.ico'}],
		script: process.env.DEPLOY_ENV === 'GH_PAGES' ? [{src: '/portfolio/gh-spa.js'}] : [] 
	},
	// Customize the progress bar color
	loading: {color: '#1869FF', height: '4px'},
	build: {
		extractCSS: true,
		vendor: ['babel-polyfill'],
		babel: {
			presets: ['env', 'vue-app']
		},
		// Run ESLint on save
		extend(config, { isDev, isClient }) {
			if (isDev && isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/
				})
			}
			// Cleanup CSS with PurgeCSS
			if (!isDev) {
				config.plugins.push(
					new PurgecssPlugin({
						paths: glob.sync([
							path.join(__dirname, './pages/**/*.vue'),
							path.join(__dirname, './layouts/**/*.vue'),
							path.join(__dirname, './components/**/*.vue')
						]),
						extractors: [{
							extractor: TailwindExtractor,
							extensions: ['vue']
						}],
						whitelist: ['html', 'body', 'md:w-1/3', 'md:w-1/4', 'md:w-2/3']
					})
				)
			}
		}
	},
	css: ['animate.css/animate.min.css', 'hamburgers/dist/hamburgers.css', '@/assets/css/global.css'],
	plugins: ['~/plugins/main.js'],
	// This option is given directly to the vue-router Router constructor
	router: {
		base: process.env.DEPLOY_ENV === 'GH_PAGES' ? '/portfolio/' : '',
		middleware: 'routeGuard'
	},
	env: {
		baseImgUrl: process.env.DEPLOY_ENV === 'GH_PAGES' ? 'https://jasonbirddesign.github.io/portfolio/img/' : '/img/'
	}
}
