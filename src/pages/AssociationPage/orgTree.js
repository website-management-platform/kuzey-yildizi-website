const CARD_WIDTH = 196
const SLOT_WIDTH = CARD_WIDTH + 20
const LEAF_GAP = 10
const LEAF_PADDING = 26
const MAX_LEAF_COLUMNS = 4
const DROP_CARD_WIDTH = 128
const DROP_GAP = 8
const DROPPED_EXTRA_WIDTH = 44
const MAX_DROP_COLUMNS = 12

export function buildTree(members) {
  const nodes = new Map(members.map((member) => [member.id, { ...member, children: [] }]))
  const roots = []
  for (const node of nodes.values()) {
    const parent = node.parentId ? nodes.get(node.parentId) : undefined
    if (parent && parent !== node) parent.children.push(node)
    else roots.push(node)
  }
  return roots
}

export const isLeafGroup = (node) => node.children.length >= 3 && node.children.every((child) => child.children.length === 0)

export const getLeafColumns = (node) => Math.min(node.children.length, MAX_LEAF_COLUMNS)

export function findDroppedIds(roots) {
  const dropped = new Set()
  const visit = (node) => {
    if (node.children.length >= 2) {
      const leafGroups = node.children.filter(isLeafGroup)
      if (leafGroups.length === 1) dropped.add(leafGroups[0].id)
    }
    node.children.forEach(visit)
  }
  roots.forEach(visit)
  return dropped
}

export function getDropColumns(count) {
  const rows = Math.ceil(count / MAX_DROP_COLUMNS)
  return Math.ceil(count / rows)
}

const getDropWidth = (columns) => columns * DROP_CARD_WIDTH + (columns - 1) * DROP_GAP + 20

export function getNodeWidth(node, droppedIds) {
  if (droppedIds.has(node.id)) return SLOT_WIDTH + DROPPED_EXTRA_WIDTH
  if (node.children.length === 0) return SLOT_WIDTH
  if (isLeafGroup(node)) {
    const columns = getLeafColumns(node)
    return Math.max(SLOT_WIDTH, columns * CARD_WIDTH + (columns - 1) * LEAF_GAP + LEAF_PADDING + 20)
  }
  const childrenWidth = node.children.reduce((sum, child) => sum + getNodeWidth(child, droppedIds), 0)
  const droppedChild = node.children.find((child) => droppedIds.has(child.id))
  const dropWidth = droppedChild ? getDropWidth(getDropColumns(droppedChild.children.length)) : 0
  return Math.max(SLOT_WIDTH, childrenWidth, dropWidth)
}

export function splitName(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length < 2) return [name.trim(), '']
  return [parts.slice(0, -1).join(' '), parts[parts.length - 1]]
}

export const getSurnameFontSize = (surname) => `${Math.min(1.05, 13.5 / Math.max(surname.length, 1)).toFixed(3)}rem`
