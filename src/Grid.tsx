import type { CSSProperties } from 'react'

type Props = {
    x: number
    y: number
    cellPt: number
    noBorder: boolean
}
function Grid(props: Props) {
	const { x, y, cellPt, noBorder } = props
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
