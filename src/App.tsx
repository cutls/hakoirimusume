import { useRef, useState } from 'react'
import './App.css'
import Cell from './Cell'
import Grid from './Grid'
import type { DraggableData, DraggableEvent } from 'react-draggable'
import { initialState, type StateType, type Key, keys } from './type'
import { useWindowSize } from './useWidowSize'
type Position = { x: number; y: number }
function App() {
	const [width] = useWindowSize()
	const oneCell = width > 500 ? 80 : 50
	const dialogRef = useRef<HTMLDialogElement>(null)
	const [state, setState] = useState<StateType>(initialState)
	const [axis, setAxis] = useState<'x' | 'y' | 'both'>('both')
	const [step, setStep] = useState(0)
	const [isReach, setIsReach] = useState(false)
	const [stepChecker, setStepChecker] = useState<Position>({ x: 0, y: 0 })
	const isIn = (before: Position, after: Position, iam: Key) => {
		const { width: indexW, height: indexH } = state[iam]
		const boundIn = after.x >= 0 && after.x < 6 && after.y >= 0 && after.y < 6 && after.x + indexW <= 6 && after.y + indexH <= 6
		if (iam !== 'daughter' && !boundIn) return false
		if (iam === 'daughter' && !boundIn && !(after.x === 2 && after.y === 4)) return false
		for (const key of Object.keys(state) as Key[]) {
			if (key === iam) continue
			const { x, y, width, height } = state[key]
			let isXNg = false
			if (x >= before.x && after.x + indexW > x) isXNg = true
			if (x <= before.x && after.x <= x + width) isXNg = true
			let isYNg = false
			if (y >= before.y && after.y + indexH > y) isYNg = true
			if (y <= before.y && after.y <= y + height) isYNg = true
			if (isXNg && isYNg) return false
		}
		return true
	}
	const handleStop = (d: DraggableData) => {
		const { x, y } = d
		if (stepChecker.x !== x || stepChecker.y !== y) setStep((prev) => prev + 1)
		setStepChecker({ x: 0, y: 0 })
		setAxis('both')
	}
	const handleStart = (d: DraggableData) => setStepChecker({ x: d.x, y: d.y })
	const reset = () => {
		setState(initialState)
		setAxis('both')
		setStep(0)
		setIsReach(false)
		setStepChecker({ x: 0, y: 0 })
		dialogRef.current?.close()
	}
	const handleDrag = (_e: DraggableEvent, data: DraggableData, index: Key) => {
		const { x, y, deltaX, deltaY } = data
		const nextAxis = axis === 'both' ? (deltaX === 0 ? (deltaY === 0 ? 'both' : 'y') : 'x') : axis
		if (axis === 'both') setAxis(nextAxis)
		const indexX = Math.floor(x / oneCell)
		const indexY = Math.floor(y / oneCell)
		const before = { x: state[index].x, y: state[index].y }
		const after = { x: indexX, y: indexY }
		if (!isIn(before, after, index)) return
		if (index === 'daughter' && indexX === 2 && indexY === 3) setIsReach(true)
		if (index === 'daughter' && indexX === 2 && indexY === 4) dialogRef.current?.showModal()
		setState((prevState) => {
			return {
				...prevState,
				[index]: {
					width: prevState[index].width,
					height: prevState[index].height,
					x: nextAxis === 'x' ? indexX : prevState[index].x,
					y: nextAxis === 'y' ? indexY : prevState[index].y,
					name: prevState[index].name
				}
			}
		})
	}
	return (
		<div className="root">
			<h1>箱入り娘パズル</h1>
			<div className="grid">
				{Array.from({ length: 5 }, (_, i) => (
					<div key={`${i.toString()}`} style={{ height: `${oneCell}px` }} className="grid-row">
						{Array.from({ length: 6 }, (_, j) => (
							<Grid key={`${i}-${j.toString()}`} x={j} y={i} cellPt={oneCell} />
						))}
					</div>
				))}
				{keys.map((key) => (
					<Cell
						key={key}
						name={key}
						width={state[key].width}
						cellPt={oneCell}
						height={state[key].height}
						x={state[key].x}
						y={state[key].y}
						handleDrag={handleDrag}
						handleStop={handleStop}
						handleStart={handleStart}
					/>
				))}
			</div>
			{isReach && <div>↓もう1マス下へ！↓</div>}
			<p>{step}手</p>
			<button type="button" onClick={() => reset()}>
				リセット
			</button>
			<dialog ref={dialogRef}>
				<p style={{ fontSize: 20 }}>{step}手でクリア！</p>
				<p>
					<a className="x-post" href={`https://x.com/intent/post?text=箱入り娘パズルを${step}手でクリア！ https://hakoiri-musume.vercel.app`} target="_blank" rel="noreferrer">
						Xに投稿
					</a>
				</p>
				<button type="button" onClick={() => reset()}>
					もう一度遊ぶ
				</button>
			</dialog>
		</div>
	)
}

export default App
