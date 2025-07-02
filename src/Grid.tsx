import type { CSSProperties } from 'react'

type Props = {
    x: number
    y: number
    cellPt: number
}
function Grid(props: Props) {
	const { x, y, cellPt } = props
    const noBorder = y === 4 && (x === 2 || x === 3)
    const style: CSSProperties = {
        width: `${cellPt}px`,
        height: `${cellPt}px`,
        borderBottom: noBorder ? 'none' : undefined,
    }
	
	return (
		<div className="grid-cell" style={style}></div>
	)
}
export default Grid
