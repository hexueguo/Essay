import { WatermarkConfig } from './types'
export const CONFIG: WatermarkConfig = {
	text: '', // 默认水印（字符串或函数）。若组件使用时也传入了文字，则组件传入文字优先级更高
	security: true, // 是否启动加强水印，防水印篡改
	color: 'rgba(0,0,0,.1)',
	fontSize: '16px',
	fontFamily: 'Arial',
	zIndex: 9999,
	height: 180,
	width: 180,
	rotate: 45
}
export const WATERMARK_CLASS = '__watermark'
