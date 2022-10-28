export type WatermarkText = string | { (): string }
export interface WatermarkConfig {
	text: WatermarkText // 默认水印（字符串或函数）。若组件使用时也传入了文字，则组件传入文字优先级更高
	security: boolean // 是否启动加强水印，防水印篡改
	color: string
	fontSize: string
	fontFamily: string
	zIndex: number
	height: number
	width: number
	rotate: number // 旋转角度
}
export interface WatermarkCustomConfig {
	text: WatermarkText // 默认水印（字符串或函数）。若组件使用时也传入了文字，则组件传入文字优先级更高
	security?: boolean // 是否启动加强水印，防水印篡改
	color?: string
	fontSize?: string
	fontFamily?: string
	zIndex?: number
	height?: number
	width?: number
	rotate?: number // 旋转角度
}
