import { WatermarkConfig } from './types'

/**
 * @description: 生成水印图片
 * @param {WatermarkConfig} config
 * @return {*}
 */
export function getWatermarkImage(config: WatermarkConfig) {
	const content =
		typeof config.text === 'function' ? config.text() : config.text
	const canvas = document.createElement('canvas')
	canvas.height = config.height
	canvas.width = config.width
	const degToPI = (config.rotate * Math.PI) / 180
	const context: CanvasRenderingContext2D | null = canvas.getContext('2d')
	if (context) {
		context.font = `${config.fontSize} ${config.fontFamily}`
		const txtWidth = context.measureText(content).width
		const txtHeight = parseInt(config.fontSize) + 4
		if (config.rotate > 0) { // 向下旋转
			context.translate(txtHeight * Math.sin(degToPI), 0)
		} else { // 向上旋转
			context.translate(0, Math.abs(txtWidth * Math.sin(degToPI)))
		}
		context.rotate(degToPI)
		context.fillStyle = config.color
		context.fillText(content, 0, txtHeight)
	}
	return canvas.toDataURL('image/png')
}

/**
 * @description: 获取目标元素匹配selector的非后代节点的子节点
 * @param {HTMLElement} el
 * @param {string} selector
 * @return {*}
 */
export function getDirectChild(el: HTMLElement, selector: string) {
	const childNodes = el.querySelectorAll(selector)
	if (childNodes.length) {
		const nodesArr = Array.from(childNodes)
		return nodesArr.find(childNode => childNode.parentNode === el)
	}
}
