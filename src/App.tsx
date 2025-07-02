import { useRef, useState } from 'react'
import './App.css'
import Cell from './Cell'
import Grid from './Grid'
import type { DraggableData, DraggableEvent } from 'react-draggable'
import { boards, type StateType, type Key, keys, type BoardType } from './type'
import { useWindowSize } from './useWidowSize'
type Position = { x: number; y: number }
function App() {
	const [width] = useWindowSize()
	const oneCell = width > 500 ? 80 : 50
	const dialog0Ref = useRef<HTMLDialogElement>(null)
	const dialog1Ref = useRef<HTMLDialogElement>(null)
	const [type, setType] = useState<BoardType>('step1')
	const initialState: StateType = boards[type].board
	const meta = boards[type].meta
	const [state, setState] = useState<StateType>(initialState)
	const [axis, setAxis] = useState<'x' | 'y' | 'both'>('both')
	const [step, setStep] = useState(0)
	const [isReach, setIsReach] = useState(false)
	const [snapshot, setSnapshot] = useState<StateType>(initialState)
	const isIn = (before: Position, after: Position, iam: Key) => {
		const { width: indexW, height: indexH } = state[iam]
		const boundIn = after.x >= 0 && after.x < meta.width && after.y >= 0 && after.y <= meta.height && after.x + indexW <= meta.width && after.y + indexH <= meta.height
		if (iam !== 'daughter' && !boundIn) return false
		if (iam === 'daughter' && !boundIn && !(after.x === Math.floor(meta.width / 2) - 1 && after.y === meta.height - 1)) return false
		for (const key of keys) {
			if (key === iam) continue
			const { x, y, width, height } = state[key]
			if (width === 0 || height === 0) continue // Skip empty cells
			let isXNg = false
			if (x >= before.x && after.x + indexW > x) isXNg = true
			if (x <= before.x && after.x < x + width) isXNg = true
			let isYNg = false
			if (y >= before.y && after.y + indexH > y) isYNg = true
			if (y <= before.y && after.y < y + height) isYNg = true
			if (isXNg && isYNg) return false
		}
		return true
	}
	const handleStop = (_d: DraggableData) => {
		if (JSON.stringify(snapshot) !== JSON.stringify(state)) setStep((prev) => prev + 1)
		setAxis('both')
	}
	const handleStart = (_d: DraggableData) => setSnapshot(state)
	const reset = (type: BoardType) => {
		setType(type)
		setState(boards[type].board)
		setAxis('both')
		setStep(0)
		setIsReach(false)
		setSnapshot(boards[type].board)
		dialog1Ref.current?.close()
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
		if (index === 'daughter' && indexX === Math.floor(meta.width / 2) - 1 && indexY === meta.height - 2) setIsReach(true)
		if (index === 'daughter' && indexX === Math.floor(meta.width / 2) - 1 && indexY === meta.height - 1) dialog1Ref.current?.showModal()
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
			<div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
				<select value={type} onChange={(e) => reset(e.target.value as BoardType)}>
					{Object.entries(boards).map(([key, value]) => (
						<option key={key} value={key}>
							{value.meta.title}
						</option>
					))}
				</select>
				{/** biome-ignore lint/a11y/useValidAnchor: <For btn> */}
				<a href="#" onClick={() => dialog0Ref.current?.showModal()} className="link" style={{ fontSize: 12 }}>
					ヘルプ
				</a>
			</div>
			<div className="grid">
				{Array.from({ length: meta.height }, (_, i) => (
					<div key={`${i.toString()}`} style={{ height: `${oneCell}px` }} className="grid-row">
						{Array.from({ length: meta.width }, (_, j) => (
							<Grid noBorder={(j === Math.floor(meta.width / 2) - 1 || j === meta.width / 2) && i === meta.height - 1} key={`${i}-${j.toString()}`} x={j} y={i} cellPt={oneCell} />
						))}
					</div>
				))}
				{keys.map(
					(key) =>
						state[key].width > 0 && (
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
						)
				)}
			</div>
			{isReach && <div>↓もう1マス下へ！↓</div>}
			<p>{step}手</p>
			<button type="button" onClick={() => reset(type)}>
				リセット
			</button>
			<p style={{ fontFamily: 'sans-serif', fontSize: 10, marginTop: 20 }}>
				(c) cutls 2025{' '}
				<a href="https://github.com/cutls/hakoirimusume" target="_blank" rel="noreferrer" className="link">
					GitHub
				</a>
			</p>
			<dialog className="long" open ref={dialog0Ref}>
				<h3>パズルの目標</h3>
				<img src="goal.webp" alt="目標" style={{ width: '80%', border: '2px solid #000' }} />
				<p>写真のように、"娘"を下の段の中央に移動させましょう。</p>
				<img src="goal2.webp" alt="目標2" style={{ width: '80%', border: '2px solid #000' }} />
				<p>最後は"娘"を下に移動させて完成です。</p>
				<div style={{ textAlign: 'left', fontSize: 12, marginBottom: 10 }}>
					なお、
					<a href="https://kainaga.web.fc2.com/madchen/madchen.htm" target="_blank" rel="noreferrer">
						箱入り娘パズルの攻略法
					</a>
					によると、
					<br />
					ステップ1は最短81手、ステップ2は最短123手、ステップ3は最短138手でクリアできるようです。
				</div>
				<button type="button" onClick={() => dialog0Ref.current?.close()}>
					閉じる
				</button>
			</dialog>
			<dialog ref={dialog1Ref}>
				<p style={{ fontSize: 20 }}>{step}手でクリア！</p>
				<p>
					<a className="x-post" href={`https://x.com/intent/post?text=箱入り娘パズル(${meta.title})を${step}手でクリア！ https://hakoiri-musume.vercel.app`} target="_blank" rel="noreferrer">
						Xに投稿
					</a>
				</p>
				<button type="button" onClick={() => reset(type)}>
					もう一度遊ぶ
				</button>
			</dialog>
		</div>
	)
}

export default App
