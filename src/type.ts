export const keys = ['father', 'daughter', 'mother', 'tedai', 'daibantou', 'aniyome', 'detchi1', 'detchi2', 'jochu', 'bandou', 'detchi3', 'banken', 'sofu', 'sobo'] as const
export type Key = (typeof keys)[number]
export type StateType = Record<Key, { x: number; y: number; width: number; height: number, name: string, kana?: string }>

export const initialState: StateType = {
    father: { x: 2, y: 0, width: 1, height: 2, name: '父' },
    daughter: { x: 3, y: 0, width: 2, height: 2, name: '娘' },
    mother: { x: 5, y: 0, width: 1, height: 2, name: '母' },
    tedai: { x: 0, y: 2, width: 1, height: 1, name: '手代', kana: 'てだい' },
    daibantou: { x: 1, y: 2, width: 4, height: 1, name: '大番頭' },
    aniyome: { x: 5, y: 2, width: 1, height: 1, name: '兄嫁' },
    detchi1: { x: 0, y: 3, width: 1, height: 1, name: '丁稚', kana: 'でっち' },
    detchi2: { x: 5, y: 3, width: 1, height: 1, name: '丁稚', kana: 'でっち' },
    jochu: { x: 1, y: 3, width: 2, height: 1, name: '女中' },
    bandou: { x: 3, y: 3, width: 2, height: 1, name: '番頭' },
    detchi3: { x: 5, y: 4, width: 1, height: 1, name: '丁稚', kana: 'でっち' },
    banken: { x: 0, y: 4, width: 1, height: 1, name: '番犬' },
    sofu: { x: 1, y: 4, width: 2, height: 1, name: '祖父' },
    sobo: { x: 3, y: 4, width: 2, height: 1, name: '祖母' }
}
