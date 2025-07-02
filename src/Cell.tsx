import { type CSSProperties } from 'react'
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable'
import { step1, type Key } from './type'
type Props = {
	name: Key
	width: number
	height: number
	x: number
	y: number
	handleDrag: (event: DraggableEvent, data: DraggableData, index: Key) => void
	handleStop: (d: DraggableData) => void
	handleStart: (d: DraggableData) => void
    cellPt: number
}
function Cell(props: Props) {
	const { name, width, height, x, y, handleDrag, handleStop, handleStart, cellPt } = props
	const { name: title, kana } = step1[name]
	const style: CSSProperties = {
		width: `${cellPt * width}px`,
		height: `${cellPt * height}px`,
		position: 'absolute',
		left: 0,
		top: 0
	}
    const cellStyle: CSSProperties = {
		backgroundColor: name === 'daughter' ? '#eac5ab' : '#e2c29f'
    }
	return (
		<Draggable
			axis="none"
			defaultPosition={{ x: cellPt * x, y: cellPt * y }}
			position={{ x: cellPt * x, y: cellPt * y }}
			grid={[cellPt, cellPt]}
			onDrag={(e, data) => handleDrag(e, data, name)}
			onStop={(_e, data) => handleStop(data)}
            onStart={(_e, data) => handleStart(data)}
		>
			<div style={style}>
				<div className="cell" style={cellStyle}>
					<ruby className="cell-name">{title}{kana && <rt>{kana}</rt>}</ruby>
				</div>
			</div>
		</Draggable>
	)
}
export default Cell
